import { useState } from "react";
import { supabase } from "../supabaseClient";

function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scoreMatch(request, volunteer) {
  const skillMatch = volunteer.skills?.includes(request.type) ? 1.0 : 0.0;
  const dist = distanceKm(
    request.latitude,
    request.longitude,
    volunteer.latitude,
    volunteer.longitude
  );
  const distScore = dist <= 50 ? 1 - dist / 50 : 0.0;
  return skillMatch * 0.6 + distScore * 0.4;
}

function urgencyScore(u) {
  return u === "high" ? 3 : u === "medium" ? 2 : 1;
}

export default function Matches() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigned, setAssigned] = useState({});
  const [steps, setSteps] = useState([]);

  const handleMatch = async () => {
    setLoading(true);
    setAssigned({});
    setSteps([]);

    const { data: requests } = await supabase
      .from("help_requests")
      .select("*")
      .eq("status", "pending");
    const { data: volunteers } = await supabase
      .from("volunteers")
      .select("*")
      .eq("is_available", true);

    const sorted = [...(requests || [])].sort(
      (a, b) => urgencyScore(b.urgency) - urgencyScore(a.urgency)
    );

    const usedVolunteers = new Set();
    const matched = [];
    const algorithmSteps = [];

    algorithmSteps.push(
      `📋 Found ${requests?.length || 0} pending requests, ${
        volunteers?.length || 0
      } available volunteers`
    );
    algorithmSteps.push(
      `🔢 Sorted requests by urgency: ${sorted
        .map((r) => r.urgency)
        .join(" → ")}`
    );

    for (const req of sorted) {
      const available = (volunteers || []).filter(
        (v) => v.is_available && !usedVolunteers.has(v.id)
      );
      if (!available.length) break;

      available.sort((a, b) => scoreMatch(req, b) - scoreMatch(req, a));
      const best = available[0];
      const score = scoreMatch(req, best);

      algorithmSteps.push(
        `✅ ${req.type} (${req.urgency}) → ${best.name} [score: ${(
          score * 100
        ).toFixed(0)}%]`
      );

      if (score > 0) {
        matched.push({
          request: req,
          volunteer: best,
          score: (score * 100).toFixed(0),
          scoreNum: score,
        });
        usedVolunteers.add(best.id);
      }
    }

    setSteps(algorithmSteps);
    setResults(matched);
    setLoading(false);
  };

  const handleAssign = async (match, index) => {
    const { error } = await supabase.from("assignments").insert([
      {
        request_id: match.request.id,
        volunteer_id: match.volunteer.id,
        match_score: match.scoreNum,
        status: "active",
      },
    ]);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    await supabase
      .from("help_requests")
      .update({ status: "assigned" })
      .eq("id", match.request.id);
    await supabase
      .from("volunteers")
      .update({ is_available: false })
      .eq("id", match.volunteer.id);
    setAssigned((prev) => ({ ...prev, [index]: true }));
  };

  const urgencyColor = (u) =>
    u === "high" ? "#ff4444" : u === "medium" ? "#ff8c00" : "#44bb44";

  return (
    <div>
      <h2 style={{ color: "#fff", letterSpacing: "1px" }}>
        MATCHING ALGORITHM
      </h2>
      <p style={{ color: "#555", marginBottom: "24px" }}>
        Priority Queue → Skill Filter → Haversine Distance Score
      </p>

      {/* Algorithm steps display */}
      {steps.length > 0 && (
        <div
          style={{
            backgroundColor: "#0d1117",
            border: "1px solid #2a2a2a",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
            fontFamily: "monospace",
            fontSize: "13px",
          }}
        >
          <div
            style={{
              color: "#ff6b35",
              marginBottom: "8px",
              fontSize: "11px",
              letterSpacing: "2px",
            }}
          >
            ALGORITHM EXECUTION LOG
          </div>
          {steps.map((step, i) => (
            <div key={i} style={{ color: "#44bb44", marginBottom: "4px" }}>
              <span style={{ color: "#555" }}>
                [{String(i).padStart(2, "0")}]{" "}
              </span>
              {step}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleMatch}
        style={{
          backgroundColor: "#c62828",
          color: "#fff",
          padding: "14px 32px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "800",
          letterSpacing: "2px",
          marginBottom: "24px",
        }}
      >
        {loading ? "PROCESSING..." : "⚡ RUN MATCHING ALGORITHM"}
      </button>

      {results.length === 0 && !loading && steps.length === 0 && (
        <div
          style={{
            color: "#444",
            textAlign: "center",
            padding: "40px",
            border: "1px dashed #2a2a2a",
            borderRadius: "8px",
          }}
        >
          Add requests and volunteers, then run the algorithm
        </div>
      )}

      {results.map((r, i) => (
        <div
          key={i}
          style={{
            backgroundColor: "#1a1a1a",
            border: `1px solid ${assigned[i] ? "#44bb4444" : "#2a2a2a"}`,
            borderLeft: `3px solid ${urgencyColor(r.request.urgency)}`,
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "12px",
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
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "2px 10px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: "800",
                  letterSpacing: "1px",
                  backgroundColor: urgencyColor(r.request.urgency) + "22",
                  color: urgencyColor(r.request.urgency),
                  border: `1px solid ${urgencyColor(r.request.urgency)}44`,
                }}
              >
                {r.request.urgency?.toUpperCase()}
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
                {r.request.type}
              </span>
              {assigned[i] && (
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    color: "#44bb44",
                    backgroundColor: "#44bb4422",
                    border: "1px solid #44bb4444",
                  }}
                >
                  ✓ ASSIGNED
                </span>
              )}
            </div>

            {/* Score */}
            <div
              style={{
                fontSize: "28px",
                fontWeight: "800",
                color:
                  r.score >= 80
                    ? "#44bb44"
                    : r.score >= 50
                    ? "#ff8c00"
                    : "#ff4444",
              }}
            >
              {r.score}%
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  color: "#555",
                  fontSize: "11px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Requester
              </div>
              <div
                style={{ color: "#fff", fontWeight: "600", marginTop: "2px" }}
              >
                {r.request.requester_name || "—"}
              </div>
            </div>
            <div style={{ color: "#555" }}>→</div>
            <div>
              <div
                style={{
                  color: "#555",
                  fontSize: "11px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Volunteer
              </div>
              <div
                style={{
                  color: "#4fc3f7",
                  fontWeight: "600",
                  marginTop: "2px",
                }}
              >
                {r.volunteer.name || "—"}
              </div>
            </div>
            <div>
              <div
                style={{
                  color: "#555",
                  fontSize: "11px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Skills
              </div>
              <div
                style={{ color: "#ff6b35", fontSize: "13px", marginTop: "2px" }}
              >
                {r.volunteer.skills?.join(", ")}
              </div>
            </div>
          </div>

          {!assigned[i] && (
            <button
              onClick={() => handleAssign(r, i)}
              style={{
                marginTop: "14px",
                backgroundColor: "#1565C0",
                color: "#fff",
                padding: "8px 20px",
                border: "1px solid #4fc3f7",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "13px",
                letterSpacing: "1px",
              }}
            >
              ASSIGN VOLUNTEER
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
