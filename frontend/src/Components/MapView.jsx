import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const dangerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});
const safeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

function FitBounds({ readings }) {
  const map = useMap();
  useEffect(() => {
    if (readings.length === 0) return;
    map.fitBounds(readings.map(r => [r.latitude, r.longitude]), { padding: [40, 40] });
  }, [readings, map]);
  return null;
}

export default function MapView({ data, latestEntry }) {
  const validReadings = data.filter(r => r.latitude && r.longitude);
  const center = latestEntry ? [latestEntry.latitude, latestEntry.longitude] : [14.5995, 120.9842];

  return (
    <div className="map-container" style={{ flex: 1 }}>
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validReadings.map(r => (
          <Marker key={r.id} position={[r.latitude, r.longitude]} icon={r.status === "DANGER" ? dangerIcon : safeIcon}>
            <Popup>
              <div style={{ fontFamily: "Inter, sans-serif", minWidth: 160 }}>
                <strong style={{ fontSize: "0.85rem" }}>{r.location}</strong>
                <div style={{ marginTop: 6, fontSize: "0.75rem", lineHeight: 1.6 }}>
                  <div><b>Status:</b> <span style={{ color: r.status === "DANGER" ? "#dc2626" : "#16a34a", fontWeight: 700 }}>{r.status}</span></div>
                  <div><b>Voltage:</b> {r.voltage}V</div>
                  <div><b>Rescued:</b> {r.rescuedCount}</div>
                  <div><b>Coords:</b> {r.latitude?.toFixed(5)}, {r.longitude?.toFixed(5)}</div>
                  <div><b>Time:</b> {new Date(r.recordedAt).toLocaleString()}</div>
                </div>
                <a href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`} target="_blank" rel="noreferrer"
                  style={{ display: "inline-block", marginTop: 8, fontSize: "0.72rem", color: "#6366f1", fontWeight: 600 }}>
                  Open in Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
        {validReadings.length > 0 && <FitBounds readings={validReadings} />}
      </MapContainer>
    </div>
  );
}