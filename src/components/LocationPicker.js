import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGPS = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition({ lat, lng });
        onLocationSelect(lat, lng);
        setLoading(false);
      },
      () => {
        alert("Could not get location. Please click on the map instead.");
        setLoading(false);
      }
    );
  };

  const handleMapClick = (lat, lng) => {
    setPosition({ lat, lng });
    onLocationSelect(lat, lng);
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        style={{
          fontWeight: "bold",
          color: "#2E7D32",
          display: "block",
          marginBottom: "8px",
        }}
      >
        📍 Pick Location
      </label>

      {/* GPS Button */}
      <button
        type="button"
        onClick={handleGPS}
        style={{
          marginBottom: "10px",
          padding: "8px 16px",
          backgroundColor: "#1565C0",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "13px",
        }}
      >
        {loading ? "Detecting..." : "📡 Use My Location (GPS)"}
      </button>

      <p style={{ fontSize: "12px", color: "#888", margin: "0 0 8px 0" }}>
        Or click anywhere on the map to drop a pin
      </p>

      {/* Map */}
      <div
        style={{
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #ddd",
        }}
      >
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={12}
          style={{ height: "250px", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onSelect={handleMapClick} />
          {position && <Marker position={[position.lat, position.lng]} />}
        </MapContainer>
      </div>

      {/* Show coordinates */}
      {position && (
        <div
          style={{
            marginTop: "8px",
            padding: "8px 12px",
            backgroundColor: "#e8f5e9",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#2E7D32",
          }}
        >
          ✅ Location selected: <b>{position.lat.toFixed(5)}</b>,{" "}
          <b>{position.lng.toFixed(5)}</b>
        </div>
      )}
    </div>
  );
}
