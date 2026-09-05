import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Calendar,
  FileText,
  Clock,
  Printer,
  Plus,
  Stethoscope,
  Activity,
  AlertTriangle,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Pill,
  Sun,
  Moon,
  Coffee,
  Microscope,
  TrendingUp
} from 'lucide-react';
import {
  getDoctors,
  getAppointmentsByPatient,
  getPrescriptionsByPatient,
  updatePatient
} from '../../services/storage';
import PrescriptionSlipModal from '../common/PrescriptionSlipModal';
import BookAppointmentModal from './BookAppointmentModal';
import DailyPillTracker from './DailyPillTracker';
import VitalsTrendChart from '../common/VitalsTrendChart';
import LabReportsHub from '../common/LabReportsHub';

export default function PatientPortal({ patient, onToast, initialTab = 'overview' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'overview' | 'prescriptions' | 'appointments' | 'lab-reports' | 'trends' | 'history' | 'doctors' | 'profile'
  const [doctors, setDoctors] = useState(getDoctors());
  const [appointments, setAppointments] = useState(getAppointmentsByPatient(patient.id));
  const [prescriptions, setPrescriptions] = useState(getPrescriptionsByPatient(patient.id));

  const [selectedRxForPrint, setSelectedRxForPrint] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState(null);

  // Profile edit form
  const [profileData, setProfileData] = useState({
    name: patient.name || '',
    phone: patient.phone || '',
    email: patient.email || '',
    address: patient.address || '',
    emergencyContact: patient.emergencyContact || ''
  });

  // Listen for storage updates
  useEffect(() => {
    const handleUpdate = () => {
      setDoctors(getDoctors());
      setAppointments(getAppointmentsByPatient(patient.id));
      setPrescriptions(getPrescriptionsByPatient(patient.id));
    };
    window.addEventListener('medicare_data_updated', handleUpdate);
    return () => window.removeEventListener('medicare_data_updated', handleUpdate);
  }, [patient.id]);

  const upcomingAppt = appointments.find((a) => a.status === 'Confirmed');
  const activeRx = prescriptions.find((r) => r.status === 'Active') || prescriptions[0];

  const handleOpenBookModal = (docId = null) => {
    setPreselectedDoctorId(docId);
    setShowBookModal(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updatePatient({ ...patient, ...profileData });
    onToast('Personal profile and emergency contacts updated', 'success');
  };

  return (
    <div className="patient-portal">
      {/* Patient Tab Navigation Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          paddingBottom: '16px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-color)',
          overflowX: 'auto'
        }}
      >
        <button
          className={`btn ${activeTab === 'overview' ? 'btn-secondary' : 'btn-outline'}`}
          onClick={() => setActiveTab('overview')}
        >
          <HeartPulse size={16} />
          <span>Health Overview</span>
        </button>

        <button
          className={`btn ${activeTab === 'prescriptions' ? 'btn-secondary' : 'btn-outline'}`}
          onClick={() => setActiveTab('prescriptions')}
        >
          <FileText size={16} />
          <span>My Prescriptions ({prescriptions.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'appointments' ? 'btn-secondary' : 'btn-outline'}`}
          onClick={() => setActiveTab('appointments')}
        >
          <Calendar size={16} />
          <span>Appointments ({appointments.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'lab-reports' ? 'btn-secondary' : 'btn-outline'}`}
          onClick={() => setActiveTab('lab-reports')}
        >
          <Microscope size={16} />
          <span>Lab Reports</span>
        </button>

        <button
          className={`btn ${activeTab === 'trends' ? 'btn-secondary' : 'btn-outline'}`}
          onClick={() => setActiveTab('trends')}
        >
          <TrendingUp size={16} />
          <span>Vitals Trends</span>
        </button>

        <button
          className={`btn ${activeTab === 'history' ? 'btn-secondary' : 'btn-outline'}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={16} />
          <span>Medical History & Allergies</span>
        </button>

        <button
          className={`btn ${activeTab === 'doctors' ? 'btn-secondary' : 'btn-outline'}`}
          onClick={() => setActiveTab('doctors')}
        >
          <Stethoscope size={16} />
          <span>Find Doctors ({doctors.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'profile' ? 'btn-secondary' : 'btn-outline'}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={16} />
          <span>My Profile</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          {/* Welcome Banner */}
          <div
            className="card"
            style={{
              padding: '24px 28px',
              background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #0284c7 100%)',
              color: '#ffffff',
              marginBottom: '24px',
              border: 'none',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', marginBottom: '8px' }}>
                  UHID: {patient.idNumber} • Blood Group: {patient.bloodGroup}
                </span>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0 6px' }}>
                  Welcome back, {patient.name}
                </h1>
                <p style={{ fontSize: '0.9rem', color: '#ccfbf1', maxWidth: '560px' }}>
                  Your personal health dashboard at MediCare Central. All your verified medical prescriptions, upcoming visits, and health vitals are synchronized in real-time.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn"
                  style={{ background: '#ffffff', color: '#0f766e', fontWeight: 700 }}
                  onClick={() => handleOpenBookModal()}
                >
                  <Calendar size={16} />
                  <span>Book Appointment</span>
                </button>
                {activeRx && (
                  <button
                    className="btn btn-outline"
                    style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.5)' }}
                    onClick={() => setSelectedRxForPrint(activeRx)}
                  >
                    <Printer size={16} />
                    <span>Print Latest Rx</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Appointment Notification Alert */}
          {upcomingAppt && (
            <div
              style={{
                background: 'var(--primary-subtle)',
                border: '1.5px solid var(--border-focus)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '10px',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Calendar size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.96rem' }}>
                    Upcoming Consultation with {upcomingAppt.doctorName}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-body)', marginTop: '2px' }}>
                    Date: <strong>{upcomingAppt.date}</strong> at <strong>{upcomingAppt.time}</strong> • Chamber: 304 ({upcomingAppt.department})
                  </div>
                </div>
              </div>

              <span className="badge badge-primary">Confirmed</span>
            </div>
          )}

          {/* Interactive Daily Medication Pill Checklist & Streak */}
          <DailyPillTracker patientId={patient.id} onToast={onToast} />

          {/* Vitals Summary Grid */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="var(--secondary)" />
              <span>Current Health Vitals Monitor</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
              <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Blood Pressure</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: patient.vitals?.bpStatus === 'elevated' ? 'var(--danger)' : 'var(--text-main)', margin: '4px 0 2px' }}>
                  {patient.vitals?.bp || '120/80'}
                </div>
                <span className={`badge ${patient.vitals?.bpStatus === 'elevated' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.68rem' }}>
                  {patient.vitals?.bpStatus === 'elevated' ? 'Elevated' : 'Normal'}
                </span>
              </div>

              <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pulse Rate</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 2px' }}>
                  {patient.vitals?.heartRate || '74'}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>bpm</div>
              </div>

              <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Oxygen SpO2</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7', margin: '4px 0 2px' }}>
                  {patient.vitals?.spo2 || '98'}%
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Optimal</div>
              </div>

              <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Body Temp</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 2px' }}>
                  {patient.vitals?.temp || '98.4'}°F
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Normal</div>
              </div>

              <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>BMI Index</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 2px' }}>
                  {patient.vitals?.bmi || '21.3'}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{patient.vitals?.bmiCategory || 'Normal'}</div>
              </div>
            </div>
          </div>

          {/* Interactive 6-Month Vitals Trajectory Chart */}
          <VitalsTrendChart
            vitalsHistory={patient.vitalsHistory}
            patientName={patient.name}
          />

          {/* Daily Active Pill Schedule (Extracted from Active Prescriptions) */}
          {activeRx && (
            <div className="card" style={{ marginBottom: '28px' }}>
              <div className="card-header" style={{ background: 'var(--bg-surface-alt)' }}>
                <h3 className="card-title">
                  <Pill size={18} color="var(--primary)" />
                  <span>Current Medication Routine (from Dr. {activeRx.doctorName})</span>
                </h3>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setSelectedRxForPrint(activeRx)}
                >
                  <Printer size={14} />
                  <span>View Full Rx Slip</span>
                </button>
              </div>

              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
                  {activeRx.medicines?.map((med, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '14px',
                        background: '#ffffff',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: '4px solid var(--primary)'
                      }}
                    >
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                        {med.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                        {med.strength} • {med.form}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '0.82rem', color: 'var(--text-body)' }}>
                        <Clock size={14} color="var(--text-muted)" />
                        <span><strong>{med.dosage}</strong> — {med.frequency}</span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {med.timing} • Duration: {med.duration}
                      </div>
                      {med.instructions && (
                        <div style={{ fontSize: '0.76rem', color: '#0369a1', fontStyle: 'italic', marginTop: '6px' }}>
                          Note: "{med.instructions}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Doctor Directory preview */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Consult Hospital Specialists
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('doctors')}>
                View All Specialists →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {doctors.slice(0, 2).map((doc) => (
                <div key={doc.id} className="card" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem' }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                        {doc.specialty}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Fee: {doc.fee} • Chamber: {doc.chamber}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-sm btn-block"
                    onClick={() => handleOpenBookModal(doc.id)}
                  >
                    <Calendar size={14} />
                    <span>Book Consultation</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRESCRIPTIONS LIST & PRINTABLE SLIP */}
      {activeTab === 'prescriptions' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                My Digital Prescriptions
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Official medical prescriptions issued by consulting physicians with verifiable digital signatures
              </p>
            </div>
          </div>

          {prescriptions.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No prescriptions found for this patient account.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {prescriptions.map((rx) => (
                <div key={rx.id} className="card">
                  <div className="card-header" style={{ background: 'var(--bg-surface-alt)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                          {rx.diagnosis}
                        </h3>
                        <span className={`badge ${rx.status === 'Active' ? 'badge-primary' : 'badge-neutral'}`}>
                          {rx.status || 'Active'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Prescribed by <strong>{rx.doctorName}</strong> ({rx.department}) • Date: {rx.date} • Ref: {rx.rxNumber}
                      </div>
                    </div>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedRxForPrint(rx)}
                      title="View and print official hospital prescription"
                    >
                      <Printer size={15} />
                      <span>Print / Download Rx Slip</span>
                    </button>
                  </div>

                  <div className="card-body">
                    {/* Medicines Breakdown Table */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Prescribed Medications ({rx.medicines?.length}):
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                        {rx.medicines?.map((med, mIdx) => (
                          <div
                            key={mIdx}
                            style={{
                              padding: '12px',
                              background: 'var(--bg-surface-alt)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-color)'
                            }}
                          >
                            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                              {med.name} {med.strength && `(${med.strength})`}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                              {med.dosage} • {med.frequency}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                              {med.timing} • Duration: {med.duration}
                            </div>
                            {med.instructions && (
                              <div style={{ fontSize: '0.74rem', color: '#0284c7', fontStyle: 'italic', marginTop: '4px' }}>
                                "{med.instructions}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Advice */}
                    {rx.generalAdvice && (
                      <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.82rem', color: 'var(--text-body)' }}>
                        <strong>Doctor's Advice:</strong> {Array.isArray(rx.generalAdvice) ? rx.generalAdvice.join(' ') : rx.generalAdvice}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Consultation Appointments
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Your scheduled and previous clinical consultations at MediCare Central
              </p>
            </div>

            <button className="btn btn-secondary" onClick={() => handleOpenBookModal()}>
              <Calendar size={16} />
              <span>Book New Consultation</span>
            </button>
          </div>

          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              {appointments.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No appointments found. Click "Book New Consultation" to schedule one.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {appointments.map((appt) => (
                    <div
                      key={appt.id}
                      style={{
                        padding: '18px 24px',
                        borderBottom: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '14px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                            {appt.doctorName}
                          </span>
                          <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                            {appt.department}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.86rem', color: 'var(--text-body)', marginTop: '4px' }}>
                          <strong>Reason:</strong> {appt.reason}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                          <Clock size={14} />
                          <span>Date: {appt.date} • Time Slot: {appt.time}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          className={`badge ${
                            appt.status === 'Confirmed' ? 'badge-primary' : 'badge-success'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: DIAGNOSTIC LAB REPORTS */}
      {activeTab === 'lab-reports' && (
        <LabReportsHub patient={patient} isDoctor={false} onToast={onToast} />
      )}

      {/* TAB: HEALTH & VITALS TRENDS */}
      {activeTab === 'trends' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Personal Health Trajectory & Vitals Analytics
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Track blood pressure stabilization, glucose control, and resting heart rate over 6 months
            </p>
          </div>

          <VitalsTrendChart vitalsHistory={patient.vitalsHistory} patientName={patient.name} />
        </div>
      )}

      {/* TAB 4: MEDICAL HISTORY & ALLERGIES */}
      {activeTab === 'history' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '18px' }}>
            Personal Medical History & Health Records
          </h2>

          {/* Allergies Callout Banner */}
          <div
            style={{
              background: 'var(--danger-bg)',
              border: '1.5px solid var(--danger-border)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 22px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}
          >
            <AlertTriangle size={24} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, color: 'var(--danger-text)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                Documented Drug Allergies & Hypersensitivities:
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '4px' }}>
                {patient.allergies?.join(' • ') || 'No known drug allergies on record'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--danger-text)', marginTop: '4px' }}>
                Always notify any new attending physician of these allergies before starting treatment.
              </div>
            </div>
          </div>

          {/* Chronic Conditions */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <h3 className="card-title">Chronic Conditions & Ongoing Diagnoses</h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {patient.chronicConditions?.map((cond, idx) => (
                  <span key={idx} className="badge badge-primary" style={{ padding: '6px 14px', fontSize: '0.84rem' }}>
                    {cond}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Clinical Visits Timeline */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Past Clinical Consultation Timeline</h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {patient.medicalHistory?.map((hist, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      background: 'var(--bg-surface-alt)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '4px solid var(--secondary)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-main)' }}>
                        {hist.condition}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {hist.date}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                      Consulting Doctor: {hist.doctorName} ({hist.department})
                    </div>
                    <div style={{ fontSize: '0.86rem', color: 'var(--text-body)', marginTop: '8px', lineHeight: 1.5 }}>
                      {hist.notes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DOCTORS DIRECTORY */}
      {activeTab === 'doctors' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Hospital Medical Staff & Specialist Directory
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Browse verified physicians, credentials, visiting chamber hours, and book instant OPD appointments
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {doctors.map((doc) => (
              <div key={doc.id} className="card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      style={{ width: 62, height: 62, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.1rem' }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700 }}>
                        {doc.title}
                      </div>
                      <span className="badge badge-neutral" style={{ marginTop: '4px', fontSize: '0.7rem' }}>
                        {doc.department}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-body)', marginBottom: '14px', lineHeight: 1.5 }}>
                    {doc.bio}
                  </p>

                  <div style={{ background: 'var(--bg-surface-alt)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <div>📍 <strong>Chamber:</strong> {doc.chamber}</div>
                    <div style={{ marginTop: '3px' }}>🕒 <strong>Visiting Hours:</strong> {doc.visitingHours}</div>
                    <div style={{ marginTop: '3px' }}>💳 <strong>Consultation Fee:</strong> {doc.fee}</div>
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-block"
                  onClick={() => handleOpenBookModal(doc.id)}
                >
                  <Calendar size={16} />
                  <span>Book Consultation with {doc.name.split(' ')[1]}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PROFILE */}
      {activeTab === 'profile' && (
        <div className="card" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="card-header">
            <h2 className="card-title">
              <User size={20} color="var(--secondary)" />
              <span>Personal Patient Profile & Emergency Contact</span>
            </h2>
          </div>

          <div className="card-body">
            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <textarea
                  className="form-textarea"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Contact (Name, Relationship, Phone)</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                  placeholder="e.g. Sumit Roy (Brother) - +91 98312-99001"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="submit" className="btn btn-secondary btn-lg">
                  <CheckCircle2 size={18} />
                  <span>Update Profile Information</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Prescription Modal */}
      {selectedRxForPrint && (
        <PrescriptionSlipModal
          prescription={selectedRxForPrint}
          onClose={() => setSelectedRxForPrint(null)}
        />
      )}

      {/* Book Appointment Modal */}
      {showBookModal && (
        <BookAppointmentModal
          patient={patient}
          initialDoctorId={preselectedDoctorId}
          onClose={() => setShowBookModal(false)}
          onToast={onToast}
          onAppointmentBooked={(newAppt) => {
            setAppointments(getAppointmentsByPatient(patient.id));
            setActiveTab('appointments');
          }}
        />
      )}
    </div>
  );
}
