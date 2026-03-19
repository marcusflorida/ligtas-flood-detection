import { useState } from "react";
import Icon from "./Icon";

export default function IncidentLogs({ incidentLogs, onAdd, onEdit, onDeleteClick }) {
  return (
    <>
      <div className="toolbar">
        <span />
        <button className="add-btn" onClick={onAdd}>
          <Icon name="plus" size={14} color="#fff" /> ADD INCIDENT LOG
        </button>
      </div>

      <div className="tbl-scroll">
        <div className="inc-grid">
          {incidentLogs.map(log => (
            <div key={log.id} className="inc-card">
              <div className="inc-hdr">
                <div>
                  <span className="inc-loc">{log.location}</span>
                  <span className="inc-date">
                    <Icon name="clock" size={11} color="#94a3b8" />{log.dateOccurred}
                  </span>
                </div>
                <div className="inc-actions">
                  <button className="edit-btn" onClick={() => onEdit(log)}><Icon name="edit" size={13} color="#fff" /></button>
                  <button className="del-btn" onClick={() => onDeleteClick(log)}><Icon name="trash" size={13} color="#fff" /></button>
                </div>
              </div>
              <div className="inc-row"><span className="i-lbl">Total Rescued</span><span className="i-val" style={{ color: "#8b5cf6" }}>{log.totalRescued}</span></div>
              <div className="inc-row"><span className="i-lbl">Danger Alerts</span><span className="i-val" style={{ color: "#dc2626" }}>{log.dangerReadings}</span></div>
              <div className="inc-row"><span className="i-lbl">Safe Readings</span><span className="i-val" style={{ color: "#16a34a" }}>{log.safeReadings}</span></div>
            </div>
          ))}
          {incidentLogs.length === 0 && (
            <div className="empty-state">No incident logs yet. Click "ADD INCIDENT LOG" to create one.</div>
          )}
        </div>
      </div>
    </>
  );
}