import Icon from "./Icon";

export default function TelemetryCard({ loading, latestEntry, onOpenMap }) {
  if (loading) {
    return (
      <div className="tele-card">
        <div className="tele-placeholder">UPDATING TELEMETRY...</div>
      </div>
    );
  }
  if (!latestEntry) return null;

  const isDanger = latestEntry.status === "DANGER";
  const voltColor = isDanger ? "#dc2626" : "#16a34a";
  const voltBg = isDanger ? "rgba(220,38,38,0.12)" : "rgba(22,163,74,0.12)";
  
  // Spike detection status
  const spikeDetected = latestEntry.spikeDetected || false;
  const spikeCount = latestEntry.spikeCount || 0;
  const spikeColor = spikeDetected ? "#dc2626" : "#64748b";
  const spikeBg = spikeDetected ? "rgba(220,38,38,0.12)" : "rgba(100,116,139,0.08)";

  return (
    <div className="tele-card">
      <div className="tele-layout">
        <span className="live-badge">
          <span className="live-dot" /> LIVE TELEMETRY
        </span>

        <div className="tele-main-row">
          {/* Left: location + meta */}
          <div className="tele-left">
            <h2 className="loc-title">{latestEntry.location}</h2>
            <div className="meta-row">
              <div className="meta-item">
                <span className="meta-lbl">COORDINATES</span>
                <span className="meta-value clickable" onClick={() => onOpenMap(latestEntry.latitude, latestEntry.longitude)}>
                  <Icon name="pin" size={13} color="#6366f1" />
                  {latestEntry.latitude}, {latestEntry.longitude}
                  <Icon name="externalLink" size={11} color="#6366f1" />
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-lbl">LAST UPDATED</span>
                <span className="meta-value">
                  <Icon name="clock" size={13} color="#475569" />
                  {new Date(latestEntry.recordedAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                </span>
              </div>
            </div>
          </div>

          {/* Right: status pills */}
          <div className="status-pills">
            {/* Voltage */}
            <div className="status-pill" style={{ borderLeftColor: voltColor }}>
              <div className="pill-icon-box" style={{ background: voltBg }}>
                <Icon name="zap" size={30} color={voltColor} />
              </div>
              <div className="pill-text-col">
                <span className="pill-title">VOLTAGE DETECTED</span>
                <span className="pill-value" style={{ color: voltColor }}>{latestEntry.voltage}V</span>
                <span className="pill-sub" style={{ color: voltColor }}>
                  <Icon name={isDanger ? "warning" : "check"} size={12} color={voltColor} />
                  {isDanger ? "DANGER" : "SAFE"}
                </span>
              </div>
            </div>

            {/* Spike Detection */}
            <div className="status-pill" style={{ borderLeftColor: spikeColor }}>
              <div className="pill-icon-box" style={{ background: spikeBg }}>
                <Icon name="alert" size={30} color={spikeColor} />
              </div>
              <div className="pill-text-col">
                <span className="pill-title">SPIKE DETECTION</span>
                <span className="pill-value" style={{ color: spikeColor }}>
                  {spikeDetected ? "ACTIVE" : "STABLE"}
                </span>
                <span className="pill-sub" style={{ color: spikeColor }}>
                  <Icon name={spikeDetected ? "warning" : "check"} size={12} color={spikeColor} />
                  {spikeDetected ? `${spikeCount} SPIKES` : "NO SPIKES"}
                </span>
              </div>
            </div>

            {/* Coverage */}
            <div className="status-pill" style={{ borderLeftColor: "#6366f1" }}>
              <div className="pill-icon-box" style={{ background: "rgba(99,102,241,0.12)" }}>
                <Icon name="target" size={30} color="#6366f1" />
              </div>
              <div className="pill-text-col">
                <span className="pill-title">COVERAGE AREA</span>
                <span className="pill-value" style={{ color: "#6366f1" }}>50m²</span>
                <span className="pill-sub" style={{ color: "#64748b" }}>SENSOR RANGE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}