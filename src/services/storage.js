// LocalStorage Database & Session Service for MediCare Connect
import {
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_APPOINTMENTS,
  INITIAL_LAB_REPORTS,
  DRUG_ALLERGY_KEYWORDS
} from './mockData';

const KEYS = {
  DOCTORS: 'medicare_doctors_v2',
  PATIENTS: 'medicare_patients_v2',
  PRESCRIPTIONS: 'medicare_prescriptions_v2',
  APPOINTMENTS: 'medicare_appointments_v2',
  LAB_REPORTS: 'medicare_lab_reports_v2',
  PILL_TRACKER: 'medicare_pill_tracker_v2',
  SESSION: 'medicare_session_v2',
  VIEW_MODE: 'medicare_view_mode_v2' // 'laptop' | 'android'
};

// Initialize database if not already present
export const initializeStorage = () => {
  try {
    if (!localStorage.getItem(KEYS.DOCTORS)) {
      localStorage.setItem(KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
    }
    if (!localStorage.getItem(KEYS.PATIENTS)) {
      localStorage.setItem(KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    }
    if (!localStorage.getItem(KEYS.PRESCRIPTIONS)) {
      localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(INITIAL_PRESCRIPTIONS));
    }
    if (!localStorage.getItem(KEYS.APPOINTMENTS)) {
      localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    }
    if (!localStorage.getItem(KEYS.LAB_REPORTS)) {
      localStorage.setItem(KEYS.LAB_REPORTS, JSON.stringify(INITIAL_LAB_REPORTS));
    }
  } catch (err) {
    console.error('Failed to initialize local storage', err);
  }
};

export const resetDatabase = () => {
  localStorage.setItem(KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
  localStorage.setItem(KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
  localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(INITIAL_PRESCRIPTIONS));
  localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
  localStorage.setItem(KEYS.LAB_REPORTS, JSON.stringify(INITIAL_LAB_REPORTS));
  localStorage.removeItem(KEYS.PILL_TRACKER);
  window.dispatchEvent(new Event('medicare_data_updated'));
};

// Doctors
export const getDoctors = () => {
  try {
    const data = localStorage.getItem(KEYS.DOCTORS);
    return data ? JSON.parse(data) : INITIAL_DOCTORS;
  } catch {
    return INITIAL_DOCTORS;
  }
};

export const getDoctorById = (id) => {
  const doctors = getDoctors();
  return doctors.find((d) => d.id === id) || null;
};

export const updateDoctor = (updatedDoctor) => {
  const doctors = getDoctors();
  const index = doctors.findIndex((d) => d.id === updatedDoctor.id);
  if (index !== -1) {
    doctors[index] = { ...doctors[index], ...updatedDoctor };
    localStorage.setItem(KEYS.DOCTORS, JSON.stringify(doctors));
    window.dispatchEvent(new Event('medicare_data_updated'));
    return doctors[index];
  }
  return null;
};

// Patients
export const getPatients = () => {
  try {
    const data = localStorage.getItem(KEYS.PATIENTS);
    return data ? JSON.parse(data) : INITIAL_PATIENTS;
  } catch {
    return INITIAL_PATIENTS;
  }
};

export const getPatientById = (id) => {
  const patients = getPatients();
  return patients.find((p) => p.id === id) || null;
};

export const updatePatient = (updatedPatient) => {
  const patients = getPatients();
  const index = patients.findIndex((p) => p.id === updatedPatient.id);
  if (index !== -1) {
    patients[index] = { ...patients[index], ...updatedPatient };
    localStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
    window.dispatchEvent(new Event('medicare_data_updated'));
    return patients[index];
  }
  return null;
};

// Prescriptions
export const getPrescriptions = () => {
  try {
    const data = localStorage.getItem(KEYS.PRESCRIPTIONS);
    return data ? JSON.parse(data) : INITIAL_PRESCRIPTIONS;
  } catch {
    return INITIAL_PRESCRIPTIONS;
  }
};

export const getPrescriptionsByDoctor = (doctorId) => {
  return getPrescriptions().filter((p) => p.doctorId === doctorId);
};

export const getPrescriptionsByPatient = (patientId) => {
  return getPrescriptions().filter((p) => p.patientId === patientId);
};

export const createPrescription = (newRxData) => {
  const prescriptions = getPrescriptions();
  const newRx = {
    ...newRxData,
    id: `rx-${Date.now()}`,
    rxNumber: `RX-MCC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Active'
  };

  prescriptions.unshift(newRx);
  localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));

  // Append to patient medical history
  const patient = getPatientById(newRx.patientId);
  if (patient) {
    const updatedHistory = [
      {
        date: newRx.date,
        condition: newRx.diagnosis,
        doctorName: newRx.doctorName,
        department: newRx.department || 'Clinical Consultation',
        notes: `Prescription issued (${newRx.medicines.length} medications). Diagnosis: ${newRx.diagnosis}.`
      },
      ...(patient.medicalHistory || [])
    ];
    updatePatient({ ...patient, medicalHistory: updatedHistory });
  }

  window.dispatchEvent(new Event('medicare_data_updated'));
  return newRx;
};

// Appointments
export const getAppointments = () => {
  try {
    const data = localStorage.getItem(KEYS.APPOINTMENTS);
    return data ? JSON.parse(data) : INITIAL_APPOINTMENTS;
  } catch {
    return INITIAL_APPOINTMENTS;
  }
};

export const getAppointmentsByDoctor = (doctorId) => {
  return getAppointments().filter((a) => a.doctorId === doctorId);
};

export const getAppointmentsByPatient = (patientId) => {
  return getAppointments().filter((a) => a.patientId === patientId);
};

export const createAppointment = (appointmentData) => {
  const appointments = getAppointments();
  const newAppt = {
    ...appointmentData,
    id: `appt-${Date.now()}`,
    appointmentNumber: `APT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    status: 'Confirmed'
  };
  appointments.unshift(newAppt);
  localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
  window.dispatchEvent(new Event('medicare_data_updated'));
  return newAppt;
};

export const updateAppointmentStatus = (id, newStatus) => {
  const appointments = getAppointments();
  const index = appointments.findIndex((a) => a.id === id);
  if (index !== -1) {
    appointments[index].status = newStatus;
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
    window.dispatchEvent(new Event('medicare_data_updated'));
    return appointments[index];
  }
  return null;
};

// Diagnostic Lab Reports
export const getLabReports = () => {
  try {
    const data = localStorage.getItem(KEYS.LAB_REPORTS);
    return data ? JSON.parse(data) : INITIAL_LAB_REPORTS;
  } catch {
    return INITIAL_LAB_REPORTS;
  }
};

export const getLabReportsByPatient = (patientId) => {
  return getLabReports().filter((r) => r.patientId === patientId);
};

export const createLabReport = (reportData) => {
  const reports = getLabReports();
  const newReport = {
    ...reportData,
    id: `lab-${Date.now()}`,
    reportNumber: `LAB-MCC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Verified'
  };
  reports.unshift(newReport);
  localStorage.setItem(KEYS.LAB_REPORTS, JSON.stringify(reports));
  window.dispatchEvent(new Event('medicare_data_updated'));
  return newReport;
};

// Drug Allergy & Contraindication Cross-Check Guard
export const checkDrugAllergyConflict = (patientAllergies = [], medicineName = '') => {
  if (!medicineName || !patientAllergies || patientAllergies.length === 0) return null;
  const medLower = medicineName.toLowerCase().trim();

  for (const allergy of patientAllergies) {
    const allergyLower = allergy.toLowerCase();
    for (const rule of DRUG_ALLERGY_KEYWORDS) {
      const patientHasAllergy =
        allergyLower.includes(rule.allergyName.toLowerCase()) ||
        rule.keywords.some((kw) => allergyLower.includes(kw));

      if (patientHasAllergy) {
        const matchedKeyword = rule.keywords.find((kw) => medLower.includes(kw));
        if (matchedKeyword) {
          return {
            allergyName: rule.allergyName,
            reaction: rule.reaction,
            matchedKeyword: matchedKeyword,
            severity: 'CRITICAL CONTRAINDICATION'
          };
        }
      }
    }
  }
  return null;
};

// Daily Medication Pill Tracker & Adherence Statistics
export const getPillTrackerMap = () => {
  try {
    const data = localStorage.getItem(KEYS.PILL_TRACKER);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const togglePillDose = (patientId, date, doseId, isTaken) => {
  const map = getPillTrackerMap();
  const key = `${patientId}_${date}`;
  if (!map[key]) map[key] = {};
  map[key][doseId] = {
    taken: isTaken,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  localStorage.setItem(KEYS.PILL_TRACKER, JSON.stringify(map));
  window.dispatchEvent(new Event('medicare_data_updated'));
};

export const getAdherenceStats = (patientId) => {
  const map = getPillTrackerMap();
  const today = new Date();
  let totalTracked = 0;
  let takenCount = 0;
  let streak = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayRecord = map[`${patientId}_${dateStr}`] || {};
    const keys = Object.keys(dayRecord);

    if (keys.length > 0) {
      totalTracked += keys.length;
      const taken = keys.filter((k) => dayRecord[k]?.taken).length;
      takenCount += taken;
      if (taken === keys.length && i === streak) streak++;
    } else {
      // Default initial baseline for realism
      totalTracked += 3;
      if (i > 0) takenCount += 3;
      else takenCount += 2;
      if (i < 5) streak++;
    }
  }

  const rate = totalTracked > 0 ? Math.round((takenCount / totalTracked) * 100) : 94;
  return {
    rate: Math.min(100, Math.max(70, rate)),
    streak: Math.max(1, streak || 5),
    takenCount,
    totalTracked
  };
};

// Session & Auth (RBAC)
export const getSession = () => {
  try {
    const data = localStorage.getItem(KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setSession = (role, user) => {
  const session = {
    role, // 'doctor' | 'patient'
    user,
    token: `jwt_medicare_${role}_${Date.now()}`,
    loginTime: new Date().toISOString()
  };
  localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
  window.dispatchEvent(new Event('medicare_auth_changed'));
  return session;
};

export const clearSession = () => {
  localStorage.removeItem(KEYS.SESSION);
  window.dispatchEvent(new Event('medicare_auth_changed'));
};

// Viewport Simulator Mode ('laptop' | 'android')
export const getViewMode = () => {
  return localStorage.getItem(KEYS.VIEW_MODE) || 'laptop';
};

export const setViewMode = (mode) => {
  localStorage.setItem(KEYS.VIEW_MODE, mode);
  window.dispatchEvent(new Event('medicare_viewmode_changed'));
};
