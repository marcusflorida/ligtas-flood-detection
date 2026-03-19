import { useState, useEffect } from "react";
import "/DashStyles.css";
import { getAllReadings, getSummary, getAllSmsAlerts, sendSmsAlert, connectWebSocket } from "../Services/api";

import Icon        from "./Icon";
import TelemetryCard from "./TelemetryCard";
import DataTable   from "./DataTable";
import IncidentLogs from "./IncidentLogs";
import MapView     from "./MapView";
import SmsPanel    from "./SmsPanel";
import { IncidentFormModal, ContactFormModal, DeleteConfirmModal } from "./Modals";

// ── Contact API helpers ──────────────────────────────────────────────────────
const CONTACTS_API = "http://localhost:8080/api/contacts";
const fetchContacts  = () => fetch(CONTACTS_API).then(r => r.json()).catch(() => []);
const saveContact    = (c) => fetch(CONTACTS_API, { method: "POST",   headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) }).then(r => r.json());
const updateContact  = (id, c) => fetch(`${CONTACTS_API}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) }).then(r => r.json());
const deleteContact  = (id) => fetch(`${CONTACTS_API}/${id}`, { method: "DELETE" });

const TABS = [
  { id: "DATA",          icon: "database"  },
  { id: "INCIDENT LOGS", icon: "satellite" },
  { id: "MAP",           icon: "map"       },
  { id: "SMS",           icon: "message"   },
];

export default function DeviceDashboard() {
  // ── Core data ──────────────────────────────────────────────────────────────
  const [data, setData]               = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [summary, setSummary]         = useState({ totalReadings: 0, dangerCount: 0, safeCount: 0, totalRescued: 0, avgVoltage: 0 });
  const [smsAlerts, setSmsAlerts]     = useState([]);
  const [contacts, setContacts]       = useState([]);
  const [loading, setLoading]         = useState(true);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]     = useState("DATA");
  const [filterOpen, setFilterOpen]   = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [animIn, setAnimIn]           = useState(false);

  // ── Incident log state ─────────────────────────────────────────────────────
  const [incidentLogs, setIncidentLogs] = useState(() => {
    try { const s = localStorage.getItem("incidentLogs"); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [showIncidentForm, setShowIncidentForm]   = useState(false);
  const [editingIncident, setEditingIncident]     = useState(null);
  const [incidentForm, setIncidentForm]           = useState({ location: "", totalRescued: 0, dangerAlerts: 0, safeReadings: 0, dateOccurred: "" });
  const [showIncidentDelete, setShowIncidentDelete] = useState(false);
  const [incidentToDelete, setIncidentToDelete]   = useState(null);

  // ── Contact state ──────────────────────────────────────────────────────────
  const [showContactForm, setShowContactForm]     = useState(false);
  const [editingContact, setEditingContact]       = useState(null);
  const [contactForm, setContactForm]             = useState({ name: "", phoneNumber: "", organization: "" });
  const [showContactDelete, setShowContactDelete] = useState(false);
  const [contactToDelete, setContactToDelete]     = useState(null);
  const [sendingAlert, setSendingAlert]           = useState(false);

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  useEffect(() => { localStorage.setItem("incidentLogs", JSON.stringify(incidentLogs)); }, [incidentLogs]);

  useEffect(() => {
    fetchData(); loadContacts();
    setTimeout(() => setAnimIn(true), 100);
    let stompClient = null;
    try {
      stompClient = connectWebSocket((newReading) => {
        setData(prev => [newReading, ...prev]);
        fetchSummaryOnly();
      });
    } catch (e) { console.error("WebSocket failed:", e); }
    return () => { if (stompClient) stompClient.deactivate(); };
  }, []);

  useEffect(() => {
    setFilteredData(filterStatus === "ALL" ? data : data.filter(d => d.status === filterStatus));
  }, [filterStatus, data]);

  useEffect(() => {
    const close = () => setFilterOpen(false);
    if (filterOpen) window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [filterOpen]);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchData = async () => {
    try {
      setLoading(true);
      const [readingsRes, summaryRes, smsRes] = await Promise.all([getAllReadings(), getSummary(), getAllSmsAlerts()]);
      setData(readingsRes.data); setFilteredData(readingsRes.data);
      setSummary(summaryRes.data); setSmsAlerts(smsRes.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchSummaryOnly = async () => {
    try { const r = await getSummary(); setSummary(r.data); } catch (e) { console.error(e); }
  };

  const loadContacts = async () => {
    const list = await fetchContacts();
    setContacts(Array.isArray(list) ? list : []);
  };

  // ── CSV export ─────────────────────────────────────────────────────────────
  const exportCSV = () => {
  const header = "ID,Date,Latitude,Longitude,Voltage,Status,Spike Detected,Spike Count,Rescued,Location";
  const rows = filteredData.map(d => 
    `${d.id},${d.recordedAt},${d.latitude},${d.longitude},${d.voltage},${d.status},${d.spikeDetected ? 'YES' : 'NO'},${d.spikeCount || 0},${d.rescuedCount},${d.location}`
  );
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); 
  a.href = url;
  a.download = `device_data_${new Date().toISOString().split("T")[0]}.csv`; 
  a.click();
  URL.revokeObjectURL(url);
  };

  const openGoogleMaps = (lat, lng) => window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");

  // ── Incident handlers ──────────────────────────────────────────────────────
  const handleAddIncident = () => {
    setEditingIncident(null);
    setIncidentForm({ location: "", totalRescued: 0, dangerAlerts: 0, safeReadings: 0, dateOccurred: new Date().toISOString().split("T")[0] });
    setShowIncidentForm(true);
  };
  const handleEditIncident = (inc) => {
    setEditingIncident(inc);
    setIncidentForm({ location: inc.location, totalRescued: inc.totalRescued, dangerAlerts: inc.dangerReadings, safeReadings: inc.safeReadings, dateOccurred: inc.dateOccurred });
    setShowIncidentForm(true);
  };
  const handleSaveIncident = () => {
    if (editingIncident) {
      setIncidentLogs(incidentLogs.map(l => l.id === editingIncident.id ? { ...l, ...incidentForm, dangerReadings: incidentForm.dangerAlerts } : l));
    } else {
      setIncidentLogs([...incidentLogs, { id: Math.random().toString(36).substr(2, 9), ...incidentForm, dangerReadings: incidentForm.dangerAlerts }]);
    }
    setShowIncidentForm(false);
  };
  const handleDeleteIncident = () => {
    if (incidentToDelete) {
      setIncidentLogs(incidentLogs.filter(l => l.id !== incidentToDelete.id));
      setShowIncidentDelete(false); setIncidentToDelete(null);
    }
  };

  // ── Contact handlers ───────────────────────────────────────────────────────
  const handleAddContact = () => {
    setEditingContact(null);
    setContactForm({ name: "", phoneNumber: "", organization: "" });
    setShowContactForm(true);
  };
  const handleEditContact = (c) => {
    setEditingContact(c);
    setContactForm({ name: c.name, phoneNumber: c.phoneNumber, organization: c.organization || "" });
    setShowContactForm(true);
  };
  const handleSaveContact = async () => {
    if (!contactForm.name || !contactForm.phoneNumber) return;
    if (editingContact) {
      const updated = await updateContact(editingContact.id, contactForm);
      setContacts(contacts.map(c => c.id === editingContact.id ? updated : c));
    } else {
      const created = await saveContact(contactForm);
      setContacts([...contacts, created]);
    }
    setShowContactForm(false);
  };
  const handleDeleteContact = async () => {
    if (contactToDelete) {
      await deleteContact(contactToDelete.id);
      setContacts(contacts.filter(c => c.id !== contactToDelete.id));
      setShowContactDelete(false); setContactToDelete(null);
    }
  };
  const handleSendAlert = async (contact) => {
    if (!latestEntry) return;
    setSendingAlert(true);
    try {
      const alertData = { recipientName: contact.name, phoneNumber: contact.phoneNumber, location: latestEntry.location, voltage: latestEntry.voltage, status: latestEntry.status };
      const saved = await sendSmsAlert(alertData);
      setSmsAlerts(prev => [saved.data, ...prev]);
    } catch (e) { console.error(e); } finally { setSendingAlert(false); }
  };

  const latestEntry = data[0] ?? null;

  return (
    <>

      <div className="dash-wrap">
        <div className="dash-inner" style={{ opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(10px)", transition: "all 0.5s ease" }}>

          {/* Header */}
          <header className="dash-header">
            <div className="dash-brand">
              <div className="dash-brand-icon"><Icon name="bolt" size={18} color="#fff" /></div>
              <span className="dash-title">LIGTAS COMMAND CENTER</span>
            </div>
            <button className="dash-sync-btn" onClick={fetchData}>
              <Icon name="sync" size={14} color="#fff" /> SYNC DATA
            </button>
          </header>

          {/* Telemetry Card */}
          <TelemetryCard loading={loading} latestEntry={latestEntry} onOpenMap={openGoogleMaps} />

          {/* Data Area */}
          <div className="data-area">
            <nav className="tab-bar">
              {TABS.map(({ id, icon }) => (
                <button key={id} className={`tab-btn${activeTab === id ? " active" : ""}`} onClick={() => setActiveTab(id)}>
                  <Icon name={icon} size={13} color={activeTab === id ? "#6366f1" : "#64748b"} />
                  {id}
                </button>
              ))}
            </nav>

            <div className="content-body">
              {activeTab === "DATA" && (
                <DataTable
                  filteredData={filteredData}
                  filterStatus={filterStatus} setFilterStatus={setFilterStatus}
                  filterOpen={filterOpen} setFilterOpen={setFilterOpen}
                  onOpenMap={openGoogleMaps} onExportCSV={exportCSV}
                />
              )}
              {activeTab === "INCIDENT LOGS" && (
                <IncidentLogs
                  incidentLogs={incidentLogs}
                  onAdd={handleAddIncident}
                  onEdit={handleEditIncident}
                  onDeleteClick={(inc) => { setIncidentToDelete(inc); setShowIncidentDelete(true); }}
                />
              )}
              {activeTab === "MAP" && (
                <MapView data={data} latestEntry={latestEntry} />
              )}
              {activeTab === "SMS" && (
                <SmsPanel
                  smsAlerts={smsAlerts}
                  contacts={contacts}
                  latestEntry={latestEntry}
                  sendingAlert={sendingAlert}
                  onAddContact={handleAddContact}
                  onEditContact={handleEditContact}
                  onDeleteContact={(c) => { setContactToDelete(c); setShowContactDelete(true); }}
                  onSendAlert={handleSendAlert}
                />
              )}
            </div>
          </div>

          {/* Modals */}
          <IncidentFormModal
            show={showIncidentForm} editing={editingIncident}
            form={incidentForm} setForm={setIncidentForm}
            onSave={handleSaveIncident} onClose={() => setShowIncidentForm(false)}
          />
          <DeleteConfirmModal
            show={showIncidentDelete} title="Delete Incident Log?"
            message="This action cannot be undone."
            onConfirm={handleDeleteIncident} onClose={() => setShowIncidentDelete(false)}
          />
          <ContactFormModal
            show={showContactForm} editing={editingContact}
            form={contactForm} setForm={setContactForm}
            onSave={handleSaveContact} onClose={() => setShowContactForm(false)}
          />
          <DeleteConfirmModal
            show={showContactDelete} title="Delete Contact?"
            message={`Remove ${contactToDelete?.name} from emergency contacts?`}
            onConfirm={handleDeleteContact} onClose={() => setShowContactDelete(false)}
          />

        </div>
      </div>
    </>
  );
}