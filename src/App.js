import { useState, useEffect } from "react";
import Dashboard from "./screens/Dashboard";
import MapView from "./screens/MapView";
import RequestForm from "./screens/RequestForm";
import VolunteerForm from "./screens/VolunteerForm";
import Matches from "./screens/Matches";
import Donation from "./screens/Donation";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "map", label: "Live Map" },
  { id: "request", label: "Requests" },
  { id: "volunteer", label: "Volunteers" },
  { id: "matches", label: "Algorithm" },
  { id: "donation", label: "Donate" },
];

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Bengaluru weather
  useEffect(() => {
    fetch("https://wttr.in/Bengaluru?format=j1")
      .then((r) => r.json())
      .then((d) => {
        const c = d.current_condition[0];
        setWeather({
          temp: c.temp_C,
          desc: c.weatherDesc[0].value,
          wind: c.windspeedKmph,
          humidity: c.humidity,
        });
      })
      .catch(() =>
        setWeather({ temp: "28", desc: "Clear", wind: "12", humidity: "60" })
      );
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f0f0f",
        color: "#e0e0e0",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes panicpulse {
          0%, 100% { background-color: #c62828; }
          50% { background-color: #e53935; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: #0f0f0f; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a1a1a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderBottom: "1px solid #2a2a2a",
          padding: "14px 24px",
        }}
      >
        {/* Top row — logo + clock + live */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                backgroundColor: "#c62828",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              ⚡
            </div>
            <div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#ffffff",
                  letterSpacing: "3px",
                }}
              >
                PANIC
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#666",
                  letterSpacing: "1px",
                }}
              >
                Priority Automated Network for Incident Coordination
              </div>
            </div>
          </div>

          {/* Clock + Live */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                fontSize: "13px",
                color: "#555",
                fontFamily: "monospace",
              }}
            >
              {time.toLocaleTimeString()}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#ff4444",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#ff4444",
                  animation: "pulse 1.5s infinite",
                }}
              />
              LIVE SYSTEM
            </div>
          </div>
        </div>

        {/* Weather bar */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            padding: "10px 0",
            borderTop: "1px solid #2a2a2a",
            borderBottom: "1px solid #2a2a2a",
            marginBottom: "12px",
            fontSize: "13px",
          }}
        >
          {weather ? (
            <>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span>☀️</span>
                <span style={{ color: "#666" }}>Bengaluru</span>
                <span style={{ color: "#fff", fontWeight: "bold" }}>
                  {weather.temp}°C
                </span>
              </div>
              <div style={{ color: "#333" }}>|</div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span>🌤️</span>
                <span style={{ color: "#666" }}>Conditions:</span>
                <span style={{ color: "#fff" }}>{weather.desc}</span>
              </div>
              <div style={{ color: "#333" }}>|</div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span>💨</span>
                <span style={{ color: "#666" }}>Wind:</span>
                <span style={{ color: "#fff" }}>{weather.wind} km/h</span>
              </div>
              <div style={{ color: "#333" }}>|</div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span>💧</span>
                <span style={{ color: "#666" }}>Humidity:</span>
                <span style={{ color: "#fff" }}>{weather.humidity}%</span>
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  color: "#ff4444",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ animation: "pulse 2s infinite" }}>⚠️</span>
                No severe weather alerts
              </div>
            </>
          ) : (
            <span style={{ color: "#555" }}>Loading Bengaluru weather...</span>
          )}
        </div>

        {/* Navigation tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setScreen(tab.id)}
              style={{
                padding: "8px 20px",
                backgroundColor: "transparent",
                color: screen === tab.id ? "#ff6b35" : "#666",
                border: "none",
                borderBottom:
                  screen === tab.id
                    ? "2px solid #ff6b35"
                    : "2px solid transparent",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: screen === tab.id ? "700" : "400",
                letterSpacing: "0.5px",
              }}
            >
              {tab.label}
            </button>
          ))}

          {/* PANIC emergency button */}
          <button
            style={{
              marginLeft: "auto",
              padding: "8px 24px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "800",
              letterSpacing: "2px",
              color: "#fff",
              animation: "panicpulse 2s infinite",
            }}
          >
            ⚡ PANIC
          </button>
        </div>
      </div>

      {/* Page content */}
      <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
        {screen === "dashboard" && <Dashboard />}
        {screen === "map" && <MapView />}
        {screen === "request" && <RequestForm />}
        {screen === "volunteer" && <VolunteerForm />}
        {screen === "matches" && <Matches />}
        {screen === "donation" && <Donation />}
      </div>
    </div>
  );
}
