import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    const { data: r } = await supabase.from("help_requests").select("*");
    const { data: v } = await supabase.from("volunteers").select("*");
    const { data: a } = await supabase.from("assignments").select("*");
    setRequests(r || []);
    setVolunteers(v || []);
    setAssignments(a || []);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = async (request) => {
    await supabase
      .from("help_requests")
      .update({ status: "completed" })
      .eq("id", request.id);
    await supabase
      .from("assignments")
      .update({ status: "completed" })
      .eq("request_id", request.id);
    const assignment = assignments.find((a) => a.request_id === request.id);
    if (assignment) {
      await supabase
        .from("volunteers")
        .update({ is_available: true })
        .eq("id", assignment.volunteer_id);
    }
    load();
  };

  const urgencyColor = (u) =>
    u === "high" ? "#ff4444" : u === "medium" ? "#ff8c00" : "#44bb44";

  const statusColor = (s) =>
    s === "assigned" ? "#1565C0" : s === "completed" ? "#2E7D32" : "#555";

  const filtered = requests.filter((r) =>
    filter === "all" ? true : r.status === filter
  );

  const card = (value, label, color) => (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        border: `1px solid ${color}33`,
        borderTop: `3px solid ${color}`,
        borderRadius: "10px",
        padding: "20px",
        textAlign: "center",
        flex: 1,
        minWidth: "140px",
      }}
    >
      <div style={{ fontSize: "36px", fontWeight: "800", color }}>{value}</div>
      <div
        style={{
          fontSize: "12px",
          color: "#888",
          letterSpacing: "1px",
          textTransform: "uppercase",
          marginTop: "4px",
        }}
      >
        {label}
      </div>
    </div>
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2
            style={{
              color: "#fff",
              margin: 0,
              fontSize: "22px",
              letterSpacing: "1px",
            }}
          >
            INCIDENT DASHBOARD
          </h2>
          <p style={{ color: "#555", margin: "4px 0 0", fontSize: "13px" }}>
            Real-time volunteer coordination system
          </p>
        </div>
        <button
          onClick={load}
          style={{
            backgroundColor: "#1a1a1a",
            color: "#ff6b35",
            padding: "8px 16px",
            border: "1px solid #ff6b35",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        {card(requests.length, "Total Requests", "#ff6b35")}
        {card(volunteers.length, "Volunteers", "#4fc3f7")}
        {card(
          requests.filter((r) => r.urgency === "high").length,
          "Critical",
          "#ff4444"
        )}
        {card(
          requests.filter((r) => r.status === "pending").length,
          "Pending",
          "#ff8c00"
        )}
        {card(assignments.length, "Assigned", "#7c4dff")}
        {card(
          requests.filter((r) => r.status === "completed").length,
          "Resolved",
          "#44bb44"
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {["all", "pending", "assigned", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 16px",
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
            {f}
          </button>
        ))}
      </div>

      {/* Section label */}
      <div
        style={{
          fontSize: "11px",
          color: "#555",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}
      >
        Recent Incidents — Sorted by Priority ({filtered.length} shown)
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            color: "#444",
            textAlign: "center",
            padding: "40px",
            border: "1px dashed #2a2a2a",
            borderRadius: "8px",
          }}
        >
          No incidents found
        </div>
      )}

      {/* Request cards */}
      {filtered
        .sort((a, b) => {
          const u = { high: 3, medium: 2, low: 1 };
          return (u[b.urgency] || 0) - (u[a.urgency] || 0);
        })
        .map((r) => (
          <div
            key={r.id}
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderLeft: `3px solid ${urgencyColor(r.urgency)}`,
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "800",
                    letterSpacing: "1px",
                    backgroundColor: urgencyColor(r.urgency) + "22",
                    color: urgencyColor(r.urgency),
                    border: `1px solid ${urgencyColor(r.urgency)}44`,
                  }}
                >
                  {r.urgency?.toUpperCase()}
                </span>
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    letterSpacing: "1px",
                    backgroundColor: statusColor(r.status) + "22",
                    color:
                      r.status === "assigned"
                        ? "#4fc3f7"
                        : r.status === "completed"
                        ? "#44bb44"
                        : "#888",
                    border: `1px solid ${statusColor(r.status)}44`,
                  }}
                >
                  {r.status}
                </span>
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    color: "#888",
                    backgroundColor: "#2a2a2a",
                  }}
                >
                  {r.type}
                </span>
              </div>

              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                {r.status === "assigned" && (
                  <button
                    onClick={() => handleComplete(r)}
                    style={{
                      backgroundColor: "#1b5e20",
                      color: "#44bb44",
                      padding: "4px 14px",
                      border: "1px solid #44bb44",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    ✓ Complete
                  </button>
                )}
                {r.status === "completed" && (
                  <span style={{ color: "#44bb44", fontSize: "13px" }}>
                    ✓ Resolved
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginTop: "10px" }}>
              <div
                style={{ color: "#fff", fontWeight: "600", fontSize: "15px" }}
              >
                {r.requester_name || "—"}
              </div>
              {r.description && (
                <div
                  style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}
                >
                  {r.description}
                </div>
              )}
              <div
                style={{ color: "#444", fontSize: "12px", marginTop: "6px" }}
              >
                {r.latitude && r.longitude
                  ? `△ ${r.latitude}N ${r.longitude}E`
                  : "Location not set"}
                {" · "}
                {new Date(r.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        ))}

      {/* Volunteers section */}
      <div
        style={{
          fontSize: "11px",
          color: "#555",
          letterSpacing: "2px",
          textTransform: "uppercase",
          margin: "28px 0 12px",
        }}
      >
        Volunteer Status
      </div>

      {volunteers.map((v) => (
        <div
          key={v.id}
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderLeft: `3px solid ${v.is_available ? "#44bb44" : "#4fc3f7"}`,
            borderRadius: "8px",
            padding: "14px",
            marginBottom: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ color: "#fff", fontWeight: "600" }}>
              {v.name || "—"}
            </div>
            <div style={{ color: "#555", fontSize: "12px", marginTop: "2px" }}>
              {v.skills?.join(" · ")}
            </div>
          </div>
          <span
            style={{
              padding: "4px 14px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
              backgroundColor: v.is_available ? "#1b5e2044" : "#0d47a144",
              color: v.is_available ? "#44bb44" : "#4fc3f7",
              border: `1px solid ${v.is_available ? "#44bb4444" : "#4fc3f744"}`,
            }}
          >
            {v.is_available ? "AVAILABLE" : "ASSIGNED"}
          </span>
        </div>
      ))}
    </div>
  );
}
