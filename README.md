# 🏥 MediCare Connect

A modern, clinical healthcare management web application and Android Progressive Web App (PWA) designed for hospitals, medical officers, residents, and patients.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)
![PWA](https://img.shields.io/badge/PWA-Installable-0d9488.svg)

---

## ✨ Features

### 👨‍⚕️ Doctor Portal
- **Clinical Dashboard**: Real-time patient volume, pending OPD consultations, active prescriptions, and critical allergy alerts.
- **Patient Directory & Vitals Monitor**: Instant search by UHID, name, blood group, or clinical condition with full demographic profiles.
- **Digital Prescription Studio**:
  - Instant pre-configured clinical presets (Upper Respiratory Infection, Hypertension, Acute Gastritis / GERD).
  - Dynamic multi-medication composer: Form (Tablet, Syrup, Inhaler, Drops), Strength, Dosage, Frequency, Duration, and Timing.
  - Generates verifiable digital prescriptions with unique Rx numbers and QR verification stamps.
- **🛡️ Drug Allergy Safety Guard (Clinical Decision Support)**:
  - Real-time contraindication cross-check against patient allergy profiles (Penicillins, NSAIDs, Sulfas, Aspirin, Opioids).
  - Highlights contraindicated medicines with red danger alerts and auto-blocks submission until explicit physician override confirmation.
- **📈 6-Month Visual Vitals Trend Charts**:
  - Pure SVG responsive curves tracking Blood Pressure (with shaded 120/80 mmHg corridor), Heart Rate (BPM), and Fasting Blood Glucose (mg/dL).
- **🧪 Diagnostic Lab Reports Hub**:
  - Pathology & Radiology reports with biological reference ranges and out-of-range flag badges (High/Low/Critical).
  - Order new diagnostic tests (CBC, Lipid Panel, HbA1c, Renal Function, Chest X-Ray) directly from the consultation console.
  - Printable official lab report stationery.

### 🙋‍♀️ Patient Portal
- **Personal Health Dashboard**: Active medication timetable, vitals tracking, and upcoming consultation reminders.
- **💊 Daily Pill Adherence Tracker & Streak**:
  - Time-of-day slots (Morning, Afternoon, Night) with adherence percentage and consecutive compliance day streak counter.
- **Official Printable Prescription Slips**:
  - Full-screen modal and `@media print` formatted hospital stationery with doctor credentials, licensing codes, digital signature, and verification stamp.
- **OPD Appointment Booking**: Schedule consultations with hospital specialists, pick available time slots, and submit presenting symptoms.
- **Hospital Specialist Directory**: Search doctors by department, qualifications, chamber hours, and consultation fees.

### 📱 Android Progressive Web App (PWA) & Dual-Mode UI
- Installable on Android mobile devices with standalone display mode, custom medical icons, and offline service worker caching.
- Built-in **Device Toolbar** allowing instant toggle between wide Desktop/Laptop View and a simulated 412x870px Android smartphone frame with status bar and touch navigation.
- 1-Click Demo Persona Switcher (Dr. Preetam Sen, Dr. Sarah Jenkins, Ananya Roy, Rahul Sharma).

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/MR-1124/Preetam-Medicare.git

# Navigate into project directory
cd Preetam-Medicare

# Install dependencies
npm install

# Start local development server
npm run dev
```

The app will start at `http://localhost:5173/`.

### Production Build
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 🚢 Deployment

### Vercel
Configured with `vercel.json` for SPA rewrites.
```bash
npx vercel
```

### Netlify
Configured with `netlify.toml` and `public/_redirects`.
```bash
npx netlify deploy --prod --dir=dist
```

---

## 🛠️ Tech Stack
- **Frontend Core**: React 19, JavaScript (ES2023)
- **Bundler & Dev Server**: Vite 6
- **Styling**: 100% Vanilla CSS (Design system with clinical tokens, dark mode gradients, and print stylesheets)
- **Icons**: Lucide React
- **Data Persistence**: LocalStorage with automatic schema initialization and sample clinical datasets
- **PWA**: Web App Manifest (`manifest.json`) and Service Worker (`sw.js`)

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
