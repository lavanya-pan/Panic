import { useState } from "react";
import { supabase } from "../supabaseClient";

const AMOUNTS = [100, 500, 1000, 5000];

export default function Donation() {
  const [form, setForm] = useState({
    donor_name: "",
    donor_email: "",
    amount: 500,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.donor_name || !form.donor_email) {
      alert("Please enter name and email!");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("donations").insert([form]);
    if (!error) setSubmitted(true);
    setLoading(false);
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
    display: "block",
    marginBottom: "6px",
  };

  if (submitted)
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>💚</div>
        <h2 style={{ color: "#44bb44", letterSpacing: "2px" }}>
          THANK YOU, {form.donor_name.toUpperCase()}
        </h2>
        <p style={{ color: "#888" }}>
          Your donation of <b style={{ color: "#fff" }}>₹{form.amount}</b> has
          been recorded.
        </p>
        <p style={{ color: "#555", fontSize: "13px" }}>
          You are helping volunteers reach people in need faster.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          style={{
            marginTop: "24px",
            backgroundColor: "#ff6b35",
            color: "#fff",
            padding: "10px 24px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Donate Again
        </button>
      </div>
    );

  return (
    <div>
      <h2 style={{ color: "#fff", letterSpacing: "1px" }}>
        SUPPORT THE MISSION
      </h2>
      <p style={{ color: "#555", marginBottom: "24px" }}>
        Your donation funds volunteer operations and emergency response.
      </p>

      {/* Impact banner */}
      <div
        style={{
          backgroundColor: "#1a1a1a",
          border: "1px solid #ff6b3533",
          borderLeft: "3px solid #ff6b35",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            color: "#ff6b35",
            fontSize: "11px",
            letterSpacing: "2px",
            marginBottom: "8px",
          }}
        >
          YOUR ₹{form.amount} CAN
        </div>
        <div style={{ color: "#888", fontSize: "13px" }}>
          {form.amount >= 100 && <div>• Fund transport for 1 volunteer</div>}
          {form.amount >= 500 && <div>• Provide meals for 5 families</div>}
          {form.amount >= 1000 && (
            <div>• Cover medical supplies for emergencies</div>
          )}
          {form.amount >= 5000 && (
            <div>• Support a full day of disaster response</div>
          )}
        </div>
      </div>

      <label style={label}>Your Name</label>
      <input
        style={inp}
        placeholder="Full name"
        value={form.donor_name}
        onChange={(e) => setForm({ ...form, donor_name: e.target.value })}
      />

      <label style={label}>Email</label>
      <input
        style={inp}
        placeholder="your@email.com"
        value={form.donor_email}
        onChange={(e) => setForm({ ...form, donor_email: e.target.value })}
      />

      <label style={label}>Select Amount (₹)</label>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {AMOUNTS.map((amt) => (
          <button
            key={amt}
            onClick={() => setForm({ ...form, amount: amt })}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "15px",
              backgroundColor: form.amount === amt ? "#ff6b3522" : "#1a1a1a",
              color: form.amount === amt ? "#ff6b35" : "#555",
              border: `1px solid ${
                form.amount === amt ? "#ff6b35" : "#2a2a2a"
              }`,
            }}
          >
            ₹{amt}
          </button>
        ))}
      </div>

      <label style={label}>
        Custom Amount: <span style={{ color: "#ff6b35" }}>₹{form.amount}</span>
      </label>
      <input
        type="range"
        min="50"
        max="10000"
        step="50"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
        style={{ width: "100%", margin: "8px 0 20px", accentColor: "#ff6b35" }}
      />

      <label style={label}>Message (optional)</label>
      <textarea
        style={{ ...inp, height: "80px", resize: "vertical" }}
        placeholder="Leave a message of support..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
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
        {loading ? "PROCESSING..." : `❤️ DONATE ₹${form.amount}`}
      </button>
    </div>
  );
}
