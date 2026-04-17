import Icon from "./Icon";

const maskPhone = (phone) => {
  if (!phone) return "****";
  const s = String(phone);
  if (s.length < 6) return "****";
  return `${s.substring(0, 2)}*****${s.substring(s.length - 4)}`;
};

export default function SmsPanel({ smsAlerts, contacts, onAddContact, onEditContact, onDeleteContact, onSendAlert, sendingAlert, latestEntry }) {
  return (
    <div className="sms-layout" style={{ flex: 1 }}>
      {/* Alert History */}
      <div className="sms-panel">
        <div className="panel-title">
          <Icon name="message" size={13} color="#64748b" /> ALERT HISTORY
        </div>
        <div className="sms-scroll">
          {smsAlerts.map(alert => (
            <div key={alert.id} className="sms-card">
              <div className="sms-hdr">
                <span className="sms-badge" style={{
                  color: alert.status === "DANGER" ? "#dc2626" : "#16a34a",
                  background: alert.status === "DANGER" ? "rgba(220,38,38,0.1)" : "rgba(22,163,74,0.1)",
                  border: `1px solid ${alert.status === "DANGER" ? "#dc2626" : "#16a34a"}`
                }}>
                  {alert.status}
                </span>
                <span className="sms-time">{new Date(alert.sentAt).toLocaleString()}</span>
              </div>
              {[["Recipient", alert.recipientName], ["Phone", maskPhone(alert.phoneNumber)], ["Location", alert.location], ["Voltage", `${alert.voltage}V`]].map(([label, val]) => (
                <div key={label} className="sms-row">
                  <span className="sms-lbl">{label}</span>
                  <span className="sms-val">{val}</span>
                </div>
              ))}
            </div>
          ))}
          {smsAlerts.length === 0 && <div className="empty-state">No SMS alerts sent yet.</div>}
        </div>
      </div>

      {/* Saved Contacts */}
      <div className="sms-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div className="panel-title">
            <Icon name="contact" size={13} color="#64748b" /> SAVED CONTACTS
          </div>
        </div>
        <div className="sms-scroll">
          {contacts.map(c => (
            <div key={c.id} className="contact-card">
              <div className="contact-avatar">
                <Icon name="contact" size={16} color="#fff" />
              </div>
              <div className="contact-info">
                <div className="contact-name">{c.name}</div>
                {c.organization && <div className="contact-org">{c.organization}</div>}
                <div className="contact-phone">{maskPhone(c.phoneNumber)}</div>
              </div>
              <div className="contact-actions">
                <button className="send-btn" style={{ height: 28, padding: "0 10px" }}
                  onClick={() => onSendAlert(c)} disabled={sendingAlert || !latestEntry} title="Send alert">
                  <Icon name="send" size={11} color="#fff" />
                </button>
                <button className="edit-btn" onClick={() => onEditContact(c)}><Icon name="edit" size={12} color="#fff" /></button>
                <button className="del-btn" onClick={() => onDeleteContact(c)}><Icon name="trash" size={12} color="#fff" /></button>
              </div>
            </div>
          ))}
          {contacts.length === 0 && <div className="empty-state">No contacts saved. Add emergency contacts above.</div>}
        </div>
      </div>
    </div>
  );
}