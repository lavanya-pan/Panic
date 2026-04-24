# ⚡ PANIC
### Priority Automated Network for Incident Coordination

A real-time AI-based volunteer coordination system built for disaster response.
Built at a hackathon to solve the problem of slow, manual volunteer coordination
during emergencies and disasters.

---

## 🚀 Live Demo
[Click here to view the live app][https://codesandbox.io/p/sandbox/qksck4]

---

## 🛠️ Tech Stack
- **Frontend:** React.js (CodeSandbox / Vite)
- **Backend:** Supabase (PostgreSQL + Row Level Security)
- **Maps:** Leaflet.js + OpenStreetMap (free, no API key)
- **Algorithm:** Priority Queue + Greedy + Haversine Distance Formula
- **Hosting:** CodeSandbox (live preview)

---

## ✨ Features

### 📊 Incident Dashboard
- Live stats — Total Requests, Volunteers, Critical, Pending, Assigned, Resolved
- Filter incidents by status — All / Pending / Assigned / Completed
- Incidents sorted automatically by urgency (high first)
- Color coded cards — red for critical, orange for pending, green for resolved
- Auto refreshes every 5 seconds
- Mark Complete button — full lifecycle management

### 📋 Help Request System
- Submit help requests with name, type, urgency and location
- 5 incident types — Medical, Food, Shelter, Transport, General
- 3 urgency levels — High, Medium, Low
- Real Bengaluru area location picker (Indiranagar, Koramangala, HSR Layout, Whitefield, Jayanagar, Yelahanka)
- Success confirmation screen after submission

### 🙋 Volunteer Registration
- Register with name, email, skills and base location
- Skill selection with toggle buttons — Medical, Food, Driving, Shelter, Counseling, General
- Real Bengaluru area location picker
- Volunteer availability tracked automatically

### 🤖 3-Phase Matching Algorithm
- **Phase 1 — Priority Queue:** Sorts all requests by urgency level (high → medium → low)
- **Phase 2 — Greedy Skill Filter:** Eliminates volunteers without the required skill
- **Phase 3 — Haversine Distance Score:** Calculates real GPS distance, picks nearest volunteer
- Match score shown as percentage (0% - 100%)
- Algorithm execution log shown step by step
- One-click Assign Volunteer button
- Each volunteer can only be assigned once (no double assignments)

### 🗺️ Live Map
- Real Bengaluru map powered by Leaflet.js + OpenStreetMap
- 🔴 Red markers — High urgency incidents
- 🟠 Orange markers — Medium urgency incidents
- 🟢 Green markers — Low urgency incidents
- 🔵 Blue markers — Volunteers
- Dashed blue lines connecting assigned volunteer to their incident
- Click any marker to see full details (name, type, urgency, skills, status)
- Filter map by urgency level
- Volunteer markers offset slightly to avoid overlapping with nearby requests

### ✅ Assignment & Completion System
- Assign Volunteer button saves match to Supabase assignments table
- Request status updates from Pending → Assigned → Completed
- Volunteer marked unavailable after assignment
- Mark Complete button on dashboard frees volunteer back to available
- All updates reflected live across dashboard and map

### 💚 Donation System
- Quick amount buttons — ₹100, ₹500, ₹1000, ₹5000
- Custom amount slider (₹50 to ₹10,000)
- Dynamic impact message based on donation amount
- Optional support message
- Thank you screen after successful donation
- All donations saved to Supabase

### 🌐 PANIC Branding
- Full dark theme UI
- Live system indicator with pulsing red dot
- Live clock display
- Live weather display
- ⚡ PANIC emergency button
- Professional incident-response styling

---

## 🧠 Matching Algorithm — How It Works

The algorithm runs in 3 phases when "Run Matching" is clicked:

**Phase 1 — Priority Queue**
All pending help requests are sorted by urgency level.
High urgency requests are processed first, then Medium, then Low.
This ensures critical cases are never delayed.

**Phase 2 — Greedy Skill Filter**
For each request, volunteers are filtered by required skill.
Example — a Medical request only considers volunteers with medical skill.
Volunteers already assigned are excluded automatically.

**Phase 3 — Haversine Distance Score**
Among skill-matched volunteers, the nearest one is selected.
Real GPS coordinates are used to calculate distance in kilometers.
A match score (0-100%) is shown — higher score = better match.

**Result**
The best volunteer is suggested with a one-click Assign button.
Once assigned, the volunteer is marked unavailable.
The request status updates from Pending → Assigned.
When help is delivered, Mark Complete frees the volunteer again.
