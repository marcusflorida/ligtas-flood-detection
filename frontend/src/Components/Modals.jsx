import Icon from "./Icon";

export function IncidentFormModal({ show, editing, form, setForm, onSave, onClose }) {
  if (!show) return null;
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">{editing ? "Edit Incident Log" : "Add Incident Log"}</h3>
        <div className="form-grp">
          <label className="form-lbl">Location</label>
          <input className="form-inp" type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g., Sampaloc, Manila" />
        </div>
        <div className="form-grp">
          <label className="form-lbl">Date Occurred</label>
          <input className="form-inp" type="date" value={form.dateOccurred} onChange={e => setForm({ ...form, dateOccurred: e.target.value })} />
        </div>
        <div className="form-row3">
          <div className="form-grp">
            <label className="form-lbl">Total Rescued</label>
            <input className="form-inp" type="number" value={form.totalRescued} onChange={e => setForm({ ...form, totalRescued: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="form-grp">
            <label className="form-lbl">Danger Alerts</label>
            <input className="form-inp" type="number" value={form.dangerAlerts} onChange={e => setForm({ ...form, dangerAlerts: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="form-grp">
            <label className="form-lbl">Safe Readings</label>
            <input className="form-inp" type="number" value={form.safeReadings} onChange={e => setForm({ ...form, safeReadings: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
        <div className="modal-acts">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export function ContactFormModal({ show, editing, form, setForm, onSave, onClose }) {
  if (!show) return null;
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">{editing ? "Edit Contact" : "Add Emergency Contact"}</h3>
        <div className="form-grp">
          <label className="form-lbl">Full Name / Organization Name</label>
          <input className="form-inp" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Fire Department Manila" />
        </div>
        <div className="form-grp">
          <label className="form-lbl">Organization / Department</label>
          <input className="form-inp" type="text" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} placeholder="e.g., Bureau of Fire Protection" />
        </div>
        <div className="form-grp">
          <label className="form-lbl">Phone Number</label>
          <input className="form-inp" type="tel" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} placeholder="e.g., 09171234567" />
        </div>
        <div className="modal-acts">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={onSave}>Save Contact</button>
        </div>
      </div>
    </div>
  );
}

export function DeleteConfirmModal({ show, title, message, onConfirm, onClose }) {
  if (!show) return null;
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="confirm-box" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon"><Icon name="warning" size={24} color="#dc2626" /></div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-msg">{message}</p>
        <div className="confirm-acts">
          <button className="cc-btn" onClick={onClose}>Cancel</button>
          <button className="cd-btn" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}