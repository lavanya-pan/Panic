import { useState } from "react";
import { supabase } from "../supabaseClient";

const LOCATIONS = [
  { label: "Indiranagar", lat: 12.9784, lng: 77.6408 },
  { label: "Koramangala", lat: 12.9352, lng: 77.6245 },
  { label: "HSR Layout", lat: 12.9116, lng: 77.6389 },
  { label: "Whitefield", lat: 12.9698, lng: 77.7499 },
  { label: "Jayanagar", lat: 12.9308, lng: 77.5831 },
  { label: "Yelahanka", lat: 13.1005, lng: 77.5963 },
];

export default function RequestForm() {
  const [form, setForm] = useState({
    requester_name: "",
    type: "medical",
    urgency: "high",
    description: "",
    latitude: 12.9784,
    longitude: 77.6408,
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!form.requester_name) {
      setMessage("Please enter your name!");
      return;
    }
    const { error } = await supabase.from("help_requests").insert([
      {
        ...form,
        status: "pending",
      },
    ]);
    setMessage(error ? "Error: " + error.message : "success");
  };

  const inp = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "1px solid #2a2a2a",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "14px",
    outline: "none",
  };

  if (message === "success")
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
        <h2 style={{ color: "#44bb44" }}>Request Submitted</h2>
        <p style={{ color: "#888" }}>
          Your request has been logged. A volunteer will be assigned shortly.
        </p>
        <button
          onClick={() => setMessage("")}
          style={{
            marginTop: "20px",
            backgroundColor: "#ff6b35",
            color: "#fff",
            padding: "10px 24px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Submit Another
        </button>
      </div>
    );

  return (
    <div>
      <h2 style={{ color: "#fff", letterSpacing: "1px" }}>
        NEW INCIDENT REQUEST
      </h2>
      <p style={{ color: "#555", marginBottom: "24px" }}>
        Submit a help request — high urgency requests are prioritized
        automatically.
      </p>

      <label
        style={{
          color: "#888",
          fontSize: "12px",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        Requester Name
      </label>
      <input
        style={{ ...inp, marginTop: "6px" }}
        placeholder="Full name"
        onChange={(e) => setForm({ ...form, requester_name: e.target.value })}
      />

      <label
        style={{
          color: "#888",
          fontSize: "12px",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        Incident Type
      </label>
      <select
        style={{ ...inp, marginTop: "6px" }}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="medical">🏥 Medical</option>
        <option value="food">🍱 Food</option>
        <option value="shelter">🏠 Shelter</option>
        <option value="transport">🚗 Transport</option>
        <option value="general">📋 General</option>
      </select>

      <label
        style={{
          color: "#888",
          fontSize: "12px",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        Urgency Level
      </label>
      <div
        style={{
          display: "flex",
          gap: "10px",
          margin: "8px 0 16px",
          flexWrap: "wrap",
        }}
      >
        {["high", "medium", "low"].map((u) => (
          <button
            key={u}
            onClick={() => setForm({ ...form, urgency: u })}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontSize: "13px",
              backgroundColor:
                form.urgency === u
                  ? u === "high"
                    ? "#c62828"
                    : u === "medium"
                    ? "#e65100"
                    : "#1b5e20"
                  : "#1a1a1a",
              color: form.urgency === u ? "#fff" : "#555",
              border: `1px solid ${
                form.urgency === u
                  ? u === "high"
                    ? "#ff4444"
                    : u === "medium"
                    ? "#ff8c00"
                    : "#44bb44"
                  : "#2a2a2a"
              }`,
            }}
          >
            {u === "high" ? "🔴" : u === "medium" ? "🟠" : "🟢"} {u}
          </button>
        ))}
      </div>

      <label
        style={{
          color: "#888",
          fontSize: "12px",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        Location (Bengaluru)
      </label>
      <select
        style={{ ...inp, marginTop: "6px" }}
        onChange={(e) => {
          const loc = LOCATIONS[e.target.value];
          setForm({ ...form, latitude: loc.lat, longitude: loc.lng });
        }}
      >
        {LOCATIONS.map((loc, i) => (
          <option key={i} value={i}>
            {loc.label}
          </option>
        ))}
      </select>

      <label
        style={{
          color: "#888",
          fontSize: "12px",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        Description
      </label>
      <textarea
        style={{
          ...inp,
          height: "100px",
          marginTop: "6px",
          resize: "vertical",
        }}
        placeholder="Describe the situation in detail..."
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          backgroundColor: "#c62828",
          color: "#fff",
          padding: "14px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "800",
          letterSpacing: "2px",
        }}
      >
        ⚡ SUBMIT EMERGENCY REQUEST
      </button>

      {message && message !== "success" && (
        <p style={{ marginTop: "12px", color: "#ff4444" }}>{message}</p>
      )}
    </div>
  );
}
