import Icon from "./Icon";

export default function DataTable({ filteredData, filterStatus, setFilterStatus, filterOpen, setFilterOpen, onOpenMap, onExportCSV }) {
  return (
    <>
      <div className="toolbar">
        <div className="filter-wrap">
          <button className="filter-btn" onClick={(e) => { e.stopPropagation(); setFilterOpen(!filterOpen); }}>
            <Icon name="filter" size={12} color="#6366f1" />
            STATUS: <strong style={{ color: "#1e293b", marginLeft: 4 }}>{filterStatus}</strong>
            <Icon name={filterOpen ? "chevronUp" : "chevronDown"} size={10} color="#64748b" />
          </button>
          {filterOpen && (
            <div className="dropdown">
              <div className="dd-header">SELECT DATA FILTER</div>
              {["ALL", "DANGER", "SAFE"].map(opt => (
                <div key={opt} className="dd-item"
                  style={{ color: filterStatus === opt ? "#6366f1" : "#475569", background: filterStatus === opt ? "rgba(99,102,241,0.07)" : "transparent" }}
                  onClick={() => { setFilterStatus(opt); setFilterOpen(false); }}>
                  {opt}
                  {filterStatus === opt && <Icon name="check" size={12} color="#6366f1" />}
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="export-btn" onClick={onExportCSV}>
          <Icon name="download" size={14} color="#fff" /> DOWNLOAD REPORT (.CSV)
        </button>
      </div>

      <div className="tbl-scroll">
        <table className="data-tbl">
          <thead>
            <tr>
              {["#", "TIMESTAMP", "COORDINATES", "VOLT", "STATUS", "SPIKE", "RESCUED"].map(h => 
                <th key={h} className="th">{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.map(row => {
              const spikeDetected = row.spikeDetected || false;
              const spikeCount = row.spikeCount || 0;
              
              return (
                <tr key={row.id} className="tr">
                  <td className="td">{row.id}</td>
                  <td className="td">{new Date(row.recordedAt).toLocaleString()}</td>
                  <td className="td">
                    <span style={{ color: "#6366f1", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}
                      onClick={() => onOpenMap(row.latitude, row.longitude)}>
                      <Icon name="pin" size={12} color="#6366f1" />
                      {row.latitude?.toFixed(4)}, {row.longitude?.toFixed(4)}
                    </span>
                  </td>
                  <td className="td">{row.voltage}V</td>
                  <td className="td">
                    <span className="badge" style={{
                      color: row.status === "DANGER" ? "#dc2626" : "#16a34a",
                      borderColor: row.status === "DANGER" ? "#dc2626" : "#16a34a",
                      background: row.status === "DANGER" ? "rgba(220,38,38,0.08)" : "rgba(22,163,74,0.08)"
                    }}>
                      {row.status}
                    </span>
                  </td>
                  <td className="td">
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="badge" style={{
                        color: spikeDetected ? "#dc2626" : "#64748b",
                        borderColor: spikeDetected ? "#dc2626" : "#cbd5e1",
                        background: spikeDetected ? "rgba(220,38,38,0.08)" : "rgba(100,116,139,0.05)"
                      }}>
                        {spikeDetected ? "ACTIVE" : "STABLE"}
                      </span>
                      {spikeDetected && (
                        <span style={{ 
                          fontSize: "0.7rem", 
                          fontWeight: 700, 
                          color: "#dc2626",
                          display: "flex",
                          alignItems: "center",
                          gap: 3
                        }}>
                          <Icon name="warning" size={11} color="#dc2626" />
                          {spikeCount}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="td">{row.rescuedCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}