// MediCare Connect - Clinic Knowledge Base & Assistant Engine
// Pure local JavaScript logic - No external AI API, database, or backend required.

export const ASSISTANT_DISCLAIMER = "This assistant provides general clinic information only and does not provide medical advice.";

export const MEDICAL_ADVICE_FALLBACK = "I can’t provide medical advice. Please consult a qualified healthcare professional. For emergencies, call your local emergency number or visit the nearest hospital.";

export const UNKNOWN_QUERY_FALLBACK = "I’m sorry, I can only help with general Medicare Connect clinic information. Please contact our support team for further assistance.";

export const INITIAL_GREETING = "Hello! 👋 I'm your Medicare Connect Clinic Assistant. I can help you with clinic timings, booking appointments, doctor consultations, department details, clinic location, and portal navigation.\n\nHow can I help you today?";

export const QUICK_SUGGESTIONS = [
  { label: "🕒 Clinic Timings", query: "What are your clinic timings?" },
  { label: "📅 Book Appointment", query: "How do I book an appointment?" },
  { label: "🏥 Departments & Services", query: "What departments and services are available?" },
  { label: "👨‍⚕️ Doctor Consultation", query: "Doctor consultation information" },
  { label: "📍 Clinic Location", query: "Where is the clinic located?" },
  { label: "📞 Contact Details", query: "What are your contact details?" },
  { label: "👤 Patient Portal Guide", query: "How does the patient portal work?" },
  { label: "🩺 Doctor Portal Guide", query: "How does the doctor portal work?" },
  { label: "❓ General Support", query: "General support and help" }
];

// Clinic Knowledge Base Topics
export const CLINIC_KNOWLEDGE_BASE = {
  timings: {
    id: "timings",
    title: "Clinic Timings & Hours",
    keywords: [
      "timing", "timings", "hours", "hour", "open", "opening", "close", "closing", 
      "schedule", "when", "time", "opd hours", "visiting hours", "sunday", "saturday", 
      "weekday", "weekend", "holiday", "morning", "evening"
    ],
    response: `🕒 **MediCare Central Clinic Timings & Schedule**:

• **General OPD**: Monday to Saturday: 8:00 AM – 8:00 PM
• **Emergency & Ambulance Service**: 24/7 round-the-clock
• **Diagnostic & Pathology Lab**: Monday to Sunday: 7:30 AM – 8:30 PM
• **Pharmacy Counter**: 24/7 Open

**Doctor Visiting Hours by Specialty**:
• **Cardiology (Dr. Preetam Sen)**: Mon – Fri: 10:00 AM – 04:00 PM
• **Pediatrics (Dr. Sarah Jenkins)**: Mon – Sat: 09:00 AM – 02:00 PM
• **Orthopedics (Dr. Rajesh Kulkarni)**: Tue, Thu, Sat: 11:00 AM – 05:00 PM
• **Dermatology (Dr. Emily Chen)**: Mon, Wed, Fri: 01:00 PM – 06:00 PM

*Sunday OPD is reserved for emergencies and urgent walk-in consultations.*`,
    followUp: ["📅 Book Appointment", "👨‍⚕️ Doctor Consultation", "📍 Clinic Location"]
  },

  appointment: {
    id: "appointment",
    title: "How to Book an Appointment",
    keywords: [
      "book", "booking", "appointment", "schedule", "slot", "consult", "consultation",
      "visit", "reserve", "see doctor", "make appointment", "how to book",
      "book doctor", "doctor appointment", "book visit", "book an appointment",
      "schedule visit", "book consultation"
    ],
    response: `📅 **How to Book an Appointment at Medicare Connect**:

You can easily schedule a consultation in a few simple steps:

1. **Sign in to Patient Portal**: Log into your patient account (or tap **"Ananya"** or **"Rahul"** in the top Demo Hub).
2. **Click "Book Appointment"**: Tap the primary blue appointment button on your dashboard.
3. **Select Doctor & Specialty**: Choose from Cardiology, Pediatrics, Orthopedics, or Dermatology.
4. **Pick Date & Time Slot**: Select an available OPD slot that fits your schedule.
5. **Confirm Details**: Enter any symptom notes or reason for visit, then confirm.

💡 *Need immediate phone booking?*
Call our direct OPD Appointment Desk at **+91 98310-98765** or Toll-Free **1800-266-3422**.`,
    followUp: ["🕒 Clinic Timings", "👨‍⚕️ Doctor Consultation", "📞 Contact Details"]
  },

  departments: {
    id: "departments",
    title: "Available Departments & Services",
    keywords: [
      "department", "departments", "service", "services", "specialty", "specialties",
      "facilities", "facility", "care", "cardiology", "pediatrics", "orthopedics", 
      "dermatology", "pathology", "radiology", "tests", "xray", "ecg", "lab"
    ],
    response: `🏥 **MediCare Connect Specialized Departments & Clinical Services**:

• **Cardiology & Internal Medicine**: 12-lead ECG, 2D Echocardiography, hypertension management, preventive cardiac checkups.
• **Pediatrics & Family Health**: Child immunization & vaccines, developmental milestones, pediatric allergy care, adolescent medicine.
• **Orthopedics & Joint Replacement**: Arthritis management, spine care, joint restoration, fracture stabilization, sports injury rehab.
• **Dermatology & Allergies**: Clinical skin assessments, allergic dermatoses, eczema care, acne therapy.
• **Diagnostic Pathology & Biochemistry**: Automated CBC, Comprehensive Lipid Profiles, HbA1c, Liver & Kidney Function Panels.
• **Digital Radiology & Imaging**: High-resolution Digital X-Rays, Ultrasound, Sonography.
• **24/7 Pharmacy & Day-care Unit**: Emergency medication dispensary, nebulization, wound dressing, observation beds.`,
    followUp: ["👨‍⚕️ Doctor Consultation", "🕒 Clinic Timings", "📅 Book Appointment"]
  },

  doctors: {
    id: "doctors",
    title: "Doctor Consultation Information",
    keywords: [
      "doctor", "doctors", "consultation", "physician", "specialist", "specialists",
      "fee", "fees", "cost", "preetam", "jenkins", "kulkarni", "chen", "qualification",
      "chamber", "visiting", "experience", "who are the doctors"
    ],
    response: `👨‍⚕️ **MediCare Connect Specialist Consultation Information**:

• **Dr. Preetam Sen** — MD, DM (Cardiology), FACC
  - *Specialty*: Cardiology & Internal Medicine (12 Yrs Exp.)
  - *Chamber*: Room 304, Block B, 3rd Floor
  - *Hours*: Mon – Fri: 10:00 AM – 04:00 PM | Fee: ₹800

• **Dr. Sarah Jenkins** — MBBS, MD (Pediatrics), DCH
  - *Specialty*: Pediatrics & Family Health (9 Yrs Exp.)
  - *Chamber*: Room 208, Pediatric Pavilion, 2nd Floor
  - *Hours*: Mon – Sat: 09:00 AM – 02:00 PM | Fee: ₹700

• **Dr. Rajesh Kulkarni** — MS (Orthopedics), MCh, FRCS
  - *Specialty*: Orthopedics & Joint Replacement (16 Yrs Exp.)
  - *Chamber*: Room 102, Ortho Suite, 1st Floor
  - *Hours*: Tue, Thu, Sat: 11:00 AM – 05:00 PM | Fee: ₹950

• **Dr. Emily Chen** — MD (Dermatology), DVL
  - *Specialty*: Dermatology & Clinical Allergies (8 Yrs Exp.)
  - *Chamber*: Room 410, Special Clinics, 4th Floor
  - *Hours*: Mon, Wed, Fri: 01:00 PM – 06:00 PM | Fee: ₹750

*Consultation fee includes digital prescription slip and 7-day post-visit follow-up review.*`,
    followUp: ["📅 Book Appointment", "🕒 Clinic Timings", "📞 Contact Details"]
  },

  contact: {
    id: "contact",
    title: "Contact Details & Helplines",
    keywords: [
      "contact", "phone", "call", "number", "email", "helpline", "reach",
      "tollfree", "toll free", "telephone", "mobile", "whatsapp", "inquiry"
    ],
    response: `📞 **Medicare Connect Contact & Support Channels**:

• **OPD Helpdesk & Appointments**: +91 98310-98765
• **National Toll-Free Helpline**: 1800-266-3422 (1800-MEDICARE)
• **Emergency & Trauma Unit (24/7)**: 108 / +91 98310-98799
• **General Email**: support@medicare.org
• **Appointments Email**: appointments@medicare.org
• **Official Portal**: medicare-connect-one.vercel.app

Our telephone lines are active Monday through Saturday from 7:30 AM to 9:00 PM. Emergency lines are manned 24 hours daily.`,
    followUp: ["📍 Clinic Location", "🕒 Clinic Timings", "📅 Book Appointment"]
  },

  location: {
    id: "location",
    title: "Clinic Location & Directions",
    keywords: [
      "location", "address", "where", "directions", "landmark", "situated",
      "find", "map", "city", "building", "floor", "chamber", "kolkata"
    ],
    response: `📍 **MediCare Connect Hospital Location & Campus Navigation**:

• **Hospital Address**:
  MediCare Central Super Specialty Hospital
  Block B, Health City, Salt Lake Sector 3,
  Kolkata, West Bengal – 700098, India.

• **Prominent Landmarks**:
  Near Central Park Metro Station & Sector 3 Water Tank, Opposite Subhash Sarovar Lake.

• **Campus Floor Directory**:
  - **Ground Floor**: Emergency Casualty, OPD Registration & 24/7 Pharmacy
  - **1st Floor**: Orthopedics Suite (Room 102) & Central Diagnostic Lab
  - **2nd Floor**: Pediatric Pavilion (Room 208) & Digital Radiology
  - **3rd Floor**: Cardiology Department (Room 304), ECG & Echo Labs
  - **4th Floor**: Dermatology Suite (Room 410) & Executive Administration`,
    followUp: ["🕒 Clinic Timings", "📞 Contact Details", "👨‍⚕️ Doctor Consultation"]
  },

  patient_portal: {
    id: "patient_portal",
    title: "How the Patient Portal Works",
    keywords: [
      "patient portal", "portal", "my appointments", "lab report",
      "reports", "pill tracker", "vitals", "prescription slip", "how patient portal works",
      "patient login", "patient account", "patient dashboard", "patient features"
    ],
    response: `👤 **How the Patient Portal Works**:

The Patient Portal is your personal healthcare companion inside MediCare Connect:

1. **Appointments Hub**: View upcoming and completed consultations, doctor visiting chambers, and book new appointments.
2. **Digital Prescriptions**: View complete digital prescription slips issued by doctors with dosage instructions and QR authentication.
3. **Daily Pill Tracker**: Keep track of daily morning, afternoon, and night medications with interactive "Take" and "Skip" status.
4. **Verified Lab Reports Hub**: Instantly view and download verified diagnostic reports (CBC, Lipid Profile, HbA1c, Chest X-Rays) with reference range alerts.
5. **Vitals & Health Trend Graphs**: Track your Blood Pressure (Systolic/Diastolic), Blood Glucose, Heart Rate, and SpO2 history visually.

💡 *To test it right now, click "Ananya" or "Rahul" in the top Demo Hub!*`,
    followUp: ["🩺 Doctor Portal Guide", "📅 Book Appointment", "❓ General Support"]
  },

  doctor_portal: {
    id: "doctor_portal",
    title: "How the Doctor Portal Works",
    keywords: [
      "doctor portal", "physician portal", "prescription studio",
      "allergy alert", "queue", "clinical notes", "how doctor portal works",
      "doctor login", "doctor account", "doctor dashboard", "doctor features",
      "protocols", "clinical protocols"
    ],
    response: `🩺 **How the Doctor Portal Works**:

The Doctor Portal provides clinicians with a unified OPD workflow:

1. **Live OPD Queue**: View today's scheduled patient list with real-time status badges (Waiting, In-Consult, Completed).
2. **Electronic Health Records (EHR)**: View patient demographics, recorded vitals, documented drug allergies, and past visit summaries.
3. **Smart Prescription Studio**: Add medicines with dosage, frequency, duration, and instructions. Features automated drug allergy checks (e.g., Penicillin, NSAIDs, Sulfa).
4. **Rapid Clinical Protocols**: Apply 1-click clinical order sets for Viral Fever, Essential Hypertension, or GERD/Dyspepsia.
5. **Printable Prescription Slips**: Generate official clinic prescription slips complete with doctor registration number and verification QR codes.

💡 *To test it right now, click "Dr. Preetam" or "Dr. Sarah" in the top Demo Hub!*`,
    followUp: ["👤 Patient Portal Guide", "👨‍⚕️ Doctor Consultation", "❓ General Support"]
  },

  support: {
    id: "support",
    title: "General Support & FAQs",
    keywords: [
      "support", "help", "faq", "guide", "demo", "reset", "switch", "login",
      "password", "how to use", "feature", "features", "website", "what can you do",
      "medicare", "medicare connect", "about", "overview", "what is medicare connect"
    ],
    response: `❓ **Medicare Connect Support & Quick Guide**:

• **What is Medicare Connect?**: A modern, frontend-only healthcare prototype built with React for streamlined doctor-patient OPD interactions.
• **How to switch accounts?**: Use the **Demo Hub** at the top of your screen to switch between Doctor and Patient personas with 1 click.
• **How to reset demo data?**: Click the **Reset** button in the top toolbar to restore sample patients, doctors, appointments, and vitals.
• **View Modes**: Switch between **Laptop (Full Screen)** and **Android (Simulated Mobile Frame)** using the top toolbar.
• **Is patient data saved?**: This is a frontend demo application using local browser storage (\`localStorage\`). No external servers or patient databases are connected.

Need more help? Ask about any department, doctor, timings, or portal features!`,
    followUp: ["🕒 Clinic Timings", "📅 Book Appointment", "📞 Contact Details"]
  }
};

// Medical advice / diagnosis / symptom queries regex & keyword detector
const MEDICAL_ADVICE_KEYWORDS = [
  // Symptoms & Conditions
  "chest pain", "shortness of breath", "heart attack", "stroke", "seizure", "unconscious",
  "headache", "migraine", "stomach ache", "stomach pain", "abdominal pain", "back pain",
  "body ache", "toothache", "ear pain", "joint pain", "knee pain", "throat pain",
  "fever", "high temperature", "chills", "shivering", "cough", "cold", "sneezing",
  "sore throat", "runny nose", "congestion", "phlegm", "vomiting", "vomit", "nausea",
  "diarrhea", "loose motion", "constipation", "acid reflux", "heartburn", "gerd symptom",
  "dizziness", "dizzy", "fainting", "fatigue", "weakness", "blurred vision",
  "rash", "itching", "swelling", "hives", "bruise", "bleeding", "blood in",
  "infection", "covid", "flu", "asthma attack", "wheezing", "breathless",
  "diabetes cure", "cancer symptom", "tumor", "fracture", "sprain", "burn",

  // Medical Advice / Treatment Questions
  "medical advice", "health advice", "clinical advice", "treatment advice",
  "what medicine", "what drug", "which pill", "what should i take", "can i take",
  "medicine for", "tablet for", "pill for", "cure for", "treatment for", "home remedy",
  "prescribe me", "write prescription", "diagnose me", "do i have", "am i sick",
  "symptoms of", "side effect of", "dosage of", "how much paracetamol", "dose of",
  "how to treat", "how to cure", "how to heal", "is it dangerous", "am i having",
  "pregnant", "pregnancy test", "morning sickness", "blood pressure is high",
  "sugar is high", "glucose is high", "low blood pressure"
];

// Greetings patterns
const GREETING_KEYWORDS = [
  "hi", "hello", "hey", "good morning", "good afternoon", "good evening",
  "namaste", "greetings", "whats up", "what's up", "howdy"
];

const THANKS_KEYWORDS = [
  "thank", "thanks", "thank you", "great", "awesome", "perfect", "good job"
];

/**
 * Normalizes input text for keyword and intent matching
 */
function normalizeText(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Evaluates whether a user prompt is asking for medical advice, diagnosis, or symptom treatment
 */
export function isMedicalAdviceQuery(rawText) {
  const normalized = normalizeText(rawText);
  if (!normalized) return false;

  // Specific medical consultation queries that are ADMINISTRATIVE rather than clinical advice
  const administrativeExceptions = [
    "doctor consultation information",
    "consultation fee",
    "doctor timings",
    "doctor visiting hours",
    "who are the doctors",
    "cardiology department",
    "pediatrics department",
    "orthopedics department",
    "dermatology department",
    "how to book",
    "book appointment"
  ];

  for (const ex of administrativeExceptions) {
    if (normalized.includes(ex)) {
      return false;
    }
  }

  // Check against medical advice keywords and phrases
  for (const pattern of MEDICAL_ADVICE_KEYWORDS) {
    if (normalized.includes(pattern)) {
      return true;
    }
  }

  // Common pattern checks: "i have [condition]", "my [body part] hurts", "cure [condition]"
  if (
    /\b(i have|i feel|i am suffering|my .* hurts|pain in my|cure my|treat my|should i take)\b/i.test(rawText)
  ) {
    return true;
  }

  return false;
}

/**
 * Main Assistant response engine.
 * Pure local computation, no network calls or external APIs.
 *
 * @param {string} userMessage - User's input question
 * @returns {{ text: string, suggestions: string[], intent: string }}
 */
export function getAssistantResponse(userMessage) {
  if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
    return {
      text: "Please feel free to ask any question regarding Medicare Connect clinic timings, doctors, departments, appointments, or portal guides.",
      suggestions: ["🕒 Clinic Timings", "📅 Book Appointment", "👨‍⚕️ Doctor Consultation"],
      intent: "empty"
    };
  }

  const raw = userMessage.trim();
  const normalized = normalizeText(raw);

  // 1. Mandatory Guardrail: Check for medical advice, diagnosis, or treatment request (Requirement 6)
  if (isMedicalAdviceQuery(raw)) {
    return {
      text: MEDICAL_ADVICE_FALLBACK,
      suggestions: ["📅 Book Appointment", "👨‍⚕️ Doctor Consultation", "📞 Contact Details"],
      intent: "medical_advice_guardrail"
    };
  }

  // 2. Greetings & Salutations
  for (const greet of GREETING_KEYWORDS) {
    if (normalized === greet || normalized.startsWith(greet + " ") || normalized.endsWith(" " + greet)) {
      return {
        text: `Hello! 👋 Welcome to Medicare Connect. I can provide accurate information about our clinic timings, doctor consultations, appointment booking, departments, clinic address, and how to use our patient and doctor portals.\n\nWhat would you like to explore?`,
        suggestions: ["🕒 Clinic Timings", "📅 Book Appointment", "👨‍⚕️ Doctor Consultation", "📍 Clinic Location"],
        intent: "greeting"
      };
    }
  }

  // 3. Gratitude & Pleasantries
  for (const thanks of THANKS_KEYWORDS) {
    if (normalized.includes(thanks)) {
      return {
        text: `You're very welcome! 😊 If you have any other questions regarding MediCare Connect clinic services, timings, or appointments, I'm always here to help.`,
        suggestions: ["🕒 Clinic Timings", "📅 Book Appointment", "📞 Contact Details"],
        intent: "pleasantry"
      };
    }
  }

  // 4. Intent Scoring across Clinic Knowledge Base Categories (Requirement 4)
  const words = normalized.split(" ");
  let bestTopic = null;
  let highestScore = 0;

  for (const [topicKey, topicData] of Object.entries(CLINIC_KNOWLEDGE_BASE)) {
    let score = 0;

    // Check multi-word phrase matches first (higher weight)
    for (const kw of topicData.keywords) {
      if (kw.includes(" ") && normalized.includes(kw)) {
        score += 8;
      }
    }

    // Check individual word matches
    for (const word of words) {
      if (word.length < 3) continue;
      for (const kw of topicData.keywords) {
        if (kw === word) {
          score += 3;
        } else if (kw.length > 4 && word.length > 4 && (kw.startsWith(word) || word.startsWith(kw))) {
          score += 1.5;
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestTopic = topicData;
    }
  }

  // Minimum threshold for confident match
  if (bestTopic && highestScore >= 2.5) {
    return {
      text: bestTopic.response,
      suggestions: bestTopic.followUp || ["🕒 Clinic Timings", "📅 Book Appointment", "📞 Contact Details"],
      intent: bestTopic.id
    };
  }

  // 5. Fallback for unknown or unrelated inquiries (Requirement 5)
  return {
    text: UNKNOWN_QUERY_FALLBACK,
    suggestions: ["🕒 Clinic Timings", "📅 Book Appointment", "👨‍⚕️ Doctor Consultation", "📞 Contact Details"],
    intent: "unknown_fallback"
  };
}
