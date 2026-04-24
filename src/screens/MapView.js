import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { supabase } from "../supabaseClient";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom colored icons
const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

const redIcon = createIcon("red");
const orangeIcon = createIcon("orange");
const greenIcon = createIcon("green");
const blueIcon = createIcon("blue");

export default function MapView() {
  const [requests, setRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      const { data: r } = await supabase.from("help_requests").select("*");
      const { data: v } = await supabase.from("volunteers").select("*");
      const { data: a } = await supabase.from("assignments").select("*");
      setRequests(r || []);
      setVolunteers(v || []);
      setAssignments(a || []);
    };
    load();
  }, []);

  // Get icon based on urgency
  const getRequestIcon = (urgency) => {
    if (urgency === "high") return redIcon;
    if (urgency === "medium") return orangeIcon;
    return greenIcon;
  };

  // Build lines between assigned volunteer and request
  // Using offset coordinates to match volunteer marker positions
  const assignmentLines = assignments
    .map((a) => {
      const req = requests.find((r) => r.id === a.request_id);
      const vol = volunteers.find((v) => v.id === a.volunteer_id);
      if (!req || !vol) return null;
      if (!req.latitude || !vol.latitude) return null;
      return {
        positions: [
          [req.latitude, req.longitude],
          [vol.latitude + 0.003, vol.longitude + 0.003], // match volunteer offset
        ],
        color: "#4fc3f7",
      };
    })
    .filter(Boolean);

  const filteredRequests = requests.filter((r) => {
    if (filter === "all") return true;
    return r.urgency === filter;
  });

  return (
    <div>
      <h2 style={{ color: "#fff", letterSpacing: "1px" }}>LIVE MAP</h2>
      <p style={{ color: "#555", marginBottom: "16px" }}>
        Real-time locations of incidents and volunteers across Bengaluru.
      </p>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "16px",
          fontSize: "13px",
          backgroundColor: "#1a1a1a",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "1px solid #2a2a2a",
        }}
      >
        {[
          { color: "#ff4444", label: "High urgency" },
          { color: "#ff8c00", label: "Medium urgency" },
          { color: "#44bb44", label: "Low urgency" },
          { color: "#4fc3f7", label: "Volunteer" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: item.color,
              }}
            />
            <span style={{ color: "#888" }}>{item.label}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "20px",
              height: "0px",
              borderTop: "2px dashed #4fc3f7",
            }}
          />
          <span style={{ color: "#888" }}>Assigned pair</span>
        </div>
      </div>

      {/* Filter buttons */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        {["all", "high", "medium", "low"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 14px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              backgroundColor: filter === f ? "#ff6b35" : "#1a1a1a",
              color: filter === f ? "#fff" : "#666",
              border: `1px solid ${filter === f ? "#ff6b35" : "#2a2a2a"}`,
            }}
          >
            {f === "all" ? "All" : `${f} urgency`}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "12px",
          fontSize: "13px",
          color: "#555",
        }}
      >
        <span>
          Incidents:{" "}
          <b style={{ color: "#ff6b35" }}>{filteredRequests.length}</b>
        </span>
        <span>
          Volunteers: <b style={{ color: "#4fc3f7" }}>{volunteers.length}</b>
        </span>
        <span>
          Assigned pairs:{" "}
          <b style={{ color: "#44bb44" }}>{assignmentLines.length}</b>
        </span>
      </div>

      {/* Map */}
      <div
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #2a2a2a",
        }}
      >
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={12}
          style={{ height: "520px", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Request markers */}
          {filteredRequests.map((r) =>
            r.latitude && r.longitude ? (
              <Marker
                key={r.id}
                position={[r.latitude, r.longitude]}
                icon={getRequestIcon(r.urgency)}
              >
                <Popup>
                  <div style={{ minWidth: "180px" }}>
                    <b
                      style={{
                        color:
                          r.urgency === "high"
                            ? "#c62828"
                            : r.urgency === "medium"
                            ? "#e65100"
                            : "#2e7d32",
                        fontSize: "15px",
                      }}
                    >
                      {r.requester_name || "Unknown"}
                    </b>
                    <hr style={{ margin: "6px 0", borderColor: "#eee" }} />
                    <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
                      <div>
                        📋 Type: <b>{r.type}</b>
                      </div>
                      <div>
                        ⚡ Urgency:{" "}
                        <b
                          style={{
                            color:
                              r.urgency === "high"
                                ? "#c62828"
                                : r.urgency === "medium"
                                ? "#e65100"
                                : "#2e7d32",
                          }}
                        >
                          {r.urgency}
                        </b>
                      </div>
                      <div>
                        📌 Status: <b>{r.status}</b>
                      </div>
                      {r.description && (
                        <div
                          style={{
                            marginTop: "6px",
                            color: "#666",
                            fontSize: "12px",
                            fontStyle: "italic",
                          }}
                        >
                          "{r.description}"
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}

          {/* Volunteer markers — offset by 0.003 to avoid overlap with requests */}
          {volunteers.map((v) =>
            v.latitude && v.longitude ? (
              <Marker
                key={v.id}
                position={[v.latitude + 0.003, v.longitude + 0.003]}
                icon={blueIcon}
              >
                <Popup>
                  <div style={{ minWidth: "180px" }}>
                    <b style={{ color: "#1565C0", fontSize: "15px" }}>
                      {v.name}
                    </b>
                    <hr style={{ margin: "6px 0", borderColor: "#eee" }} />
                    <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
                      <div>
                        🛠️ Skills:{" "}
                        <b>
                          {Array.isArray(v.skills)
                            ? v.skills.join(", ")
                            : v.skills}
                        </b>
                      </div>
                      <div>📧 {v.email}</div>
                      <div>
                        ✅ Status:{" "}
                        <b
                          style={{
                            color: v.is_available ? "#2E7D32" : "#1565C0",
                          }}
                        >
                          {v.is_available ? "Available" : "Assigned"}
                        </b>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}

          {/* Dashed lines connecting assigned pairs */}
          {assignmentLines.map((line, i) => (
            <Polyline
              key={i}
              positions={line.positions}
              color={line.color}
              weight={2}
              dashArray="6 4"
            />
          ))}
        </MapContainer>
      </div>

      <p style={{ color: "#444", fontSize: "12px", marginTop: "8px" }}>
        💡 Volunteer markers are offset slightly so they don't overlap with
        nearby requests. Click any marker to see full details.
      </p>
    </div>
  );
}
