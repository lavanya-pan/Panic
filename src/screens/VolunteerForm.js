import { useState } from "react";
import { supabase } from "../supabaseClient";

const ALL_SKILLS = [
  "medical",
  "food",
  "driving",
  "shelter",
  "counseling",
  "general",
];

const LOCATIONS = [
  { label: "Indiranagar", lat: 12.9784, lng: 77.6408 },
  { label: "Koramangala", lat: 12.9352, lng: 77.6245 },
  { label: "HSR Layout", lat: 12.9116, lng: 77.6389 },
  { label: "Whitefield", lat: 12.9698, lng: 77.7499 },
  { label: "Jayanagar", lat: 12.9308, lng: 77.5831 },
  { label: "Yelahanka", lat: 13.1005, lng: 77.5963 },
];

export default function VolunteerForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: [],
    latitude: 12.9784,
    longitude: 77.6408,
    is_available: true,
  });
  const [message, setMessage] = useState("");

  const toggleSkill = (skill) => {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter((s) => s !== skill)
        : [...f.skills, skill],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      setMessage("Please fill in name and email!");
      return;
    }
    const { error } = await supabase.from("volunteers").insert([form]);
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

  const label = {
    color: "#888",
    fontSize: "12px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  };

  if (message === "success")
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🙌</div>
        <h2 style={{ color: "#44bb44" }}>Volunteer Registered</h2>
        <p style={{ color: "#888" }}>
          You're now in the system. You'll be matched to incidents
          automatically.
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
          Register Another
        </button>
      </div>
    );

  return (
    <div>
      <h2 style={{ color: "#fff", letterSpacing: "1px" }}>
        VOLUNTEER REGISTRATION
      </h2>
      <p style={{ color: "#555", marginBottom: "24px" }}>
        Register your skills and location to be matched to incidents in your
        area.
      </p>

      <label style={label}>Full Name</label>
      <input
        style={{ ...inp, marginTop: "6px" }}
        placeholder="Your name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <label style={label}>Email</label>
      <input
        style={{ ...inp, marginTop: "6px" }}
        placeholder="your@email.com"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <label style={{ ...label, display: "block", marginBottom: "10px" }}>
        Skills / Capabilities
      </label>
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        {ALL_SKILLS.map((skill) => (
          <button
            key={skill}
            onClick={() => toggleSkill(skill)}
            style={{
              padding: "8px 18px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              backgroundColor: form.skills.includes(skill)
                ? "#ff6b3522"
                : "#1a1a1a",
              color: form.skills.includes(skill) ? "#ff6b35" : "#555",
              border: `1px solid ${
                form.skills.includes(skill) ? "#ff6b35" : "#2a2a2a"
              }`,
            }}
          >
            {skill}
          </button>
        ))}
      </div>

      <label style={label}>Base Location</label>
      <select
        style={{ ...inp, marginTop: "6px" }}
        onChange={(e) => {
          const loc = LOCATIONS[e.target.value];
          setForm({ ...form, latitude: loc.lat, longitude: loc.lng });
        }}
      >
        {LOCATIONS.map((loc, i) => (
          <option key={i} value={i}>
            {loc.label}, Bengaluru
          </option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          backgroundColor: "#ff6b35",
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
        JOIN AS VOLUNTEER
      </button>

      {message && message !== "success" && (
        <p style={{ marginTop: "12px", color: "#ff4444" }}>{message}</p>
      )}
    </div>
  );
}
