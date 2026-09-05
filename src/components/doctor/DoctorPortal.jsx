import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Calendar,
  FileText,
  FilePlus,
  UserCheck,
  Activity,
  Heart,
  AlertCircle,
  Clock,
  Printer,
  Edit3,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Microscope,
  Flame
} from 'lucide-react';
import {
  getPatients,
  getAppointmentsByDoctor,
  getPrescriptionsByDoctor,
  updateAppointmentStatus,
  updateDoctor,
  updatePatient,
  getAdherenceStats
} from '../../services/storage';
import PrescriptionStudio from './PrescriptionStudio';
import PrescriptionSlipModal from '../common/PrescriptionSlipModal';
import VitalsTrendChart from '../common/VitalsTrendChart';
import LabReportsHub from '../common/LabReportsHub';

export default function DoctorPortal({ doctor, onToast, initialTab = 'dashboard' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'dashboard' | 'patients' | 'new-rx' | 'lab-reports' | 'appointments' | 'profile'
  const [patients, setPatients] = useState(getPatients());
  const [appointments, setAppointments] = useState(getAppointmentsByDoctor(doctor.id));
  const [prescriptions, setPrescriptions] = useState(getPrescriptionsByDoctor(doctor.id));

  // Patient directory search & selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || null);
  const [selectedRxForPrint, setSelectedRxForPrint] = useState(null);

  // Profile edit form state
  const [profileData, setProfileData] = useState({
    name: doctor.name || '',
    title: doctor.title || '',
    specialty: doctor.specialty || '',
    chamber: doctor.chamber || '',
    visitingHours: doctor.visitingHours || '',
    fee: doctor.fee || '',
    phone: doctor.phone || '',
    bio: doctor.bio || ''
  });

  // Listen for storage updates
  useEffect(() => {
    const handleUpdate = () => {
      setPatients(getPatients());
      setAppointments(getAppointmentsByDoctor(doctor.id));
      setPrescriptions(getPrescriptionsByDoctor(doctor.id));
    };
    window.addEventListener('medicare_data_updated', handleUpdate);
    return () => window.removeEventListener('medicare_data_updated', handleUpdate);
  }, [doctor.id]);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  // Filter patients by search query
  const filteredPatients = patients.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.idNumber.toLowerCase().includes(query) ||
      p.bloodGroup.toLowerCase().includes(query) ||
      p.chronicConditions?.some((c) => c.toLowerCase().includes(query))
    );
  });

  // Handle appointment status change
  const handleStatusChange = (apptId, newStatus) => {
    updateAppointmentStatus(apptId, newStatus);
    onToast(`Appointment marked as ${newStatus}`, 'success');
  };

  // Quick switch to prescription studio for selected patient
  const handleWriteRxForPatient = (patId) => {
    setSelectedPatientId(patId);
    setActiveTab('new-rx');
  };

  // Handle Doctor Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateDoctor({ ...doctor, ...profileData });
    onToast('Doctor profile and chamber timings updated successfully!', 'success');
  };

  return (
    <div className="doctor-portal">
      {/* Tab Navigation Bar */}
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
          className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Activity size={16} />
          <span>Doctor Dashboard</span>
        </button>

        <button
          className={`btn ${activeTab === 'patients' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('patients')}
        >
          <Users size={16} />
          <span>Patients & History ({patients.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'new-rx' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('new-rx')}
          style={{ background: activeTab === 'new-rx' ? 'var(--primary)' : 'transparent' }}
        >
          <FilePlus size={16} />
          <span>Issue Prescription</span>
        </button>

        <button
          className={`btn ${activeTab === 'lab-reports' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('lab-reports')}
        >
          <Microscope size={16} />
          <span>Diagnostic Lab Hub</span>
        </button>

        <button
          className={`btn ${activeTab === 'appointments' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('appointments')}
        >
          <Calendar size={16} />
          <span>Appointments ({appointments.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('profile')}
        >
          <Edit3 size={16} />
          <span>My Profile & Chamber</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Welcome Banner */}
          <div
            className="card"
            style={{
              padding: '24px 28px',
              background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 60%, #0d9488 100%)',
              color: '#ffffff',
              marginBottom: '24px',
              border: 'none',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', marginBottom: '8px' }}>
                  {doctor.department} • Active Duty
                </span>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0 6px' }}>
                  Welcome, {doctor.name}
                </h1>
                <p style={{ fontSize: '0.9rem', color: '#e0f2fe', maxWidth: '560px' }}>
                  {doctor.title} • {doctor.chamber}. You have {appointments.filter((a) => a.status === 'Confirmed').length} active appointments scheduled.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn"
                  style={{ background: '#ffffff', color: '#0369a1', fontWeight: 700 }}
                  onClick={() => setActiveTab('new-rx')}
                >
                  <FilePlus size={16} />
                  <span>Write New Prescription</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-blue">
                <Users size={24} />
              </div>
              <div>
                <div className="stat-val">{patients.length}</div>
                <div className="stat-label">Assigned Patients</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-green">
                <Calendar size={24} />
              </div>
              <div>
                <div className="stat-val">{appointments.filter((a) => a.status === 'Confirmed').length}</div>
                <div className="stat-label">Upcoming Visits</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-teal">
                <FileText size={24} />
              </div>
              <div>
                <div className="stat-val">{prescriptions.length}</div>
                <div className="stat-label">Issued Prescriptions</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-amber">
                <AlertCircle size={24} />
              </div>
              <div>
                <div className="stat-val">
                  {patients.filter((p) => p.allergies?.length > 0).length}
                </div>
                <div className="stat-label">Allergy Monitored</div>
              </div>
            </div>
          </div>

          {/* Grid: Upcoming Appointments & Recent Issued Prescriptions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {/* Appointments Section */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Calendar size={18} color="var(--primary)" />
                  <span>Upcoming Consultations</span>
                </h3>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setActiveTab('appointments')}
                >
                  View All
                </button>
              </div>

              <div className="card-body" style={{ padding: 0 }}>
                {appointments.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No appointments scheduled
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {appointments.slice(0, 4).map((appt) => (
                      <div
                        key={appt.id}
                        style={{
                          padding: '16px 20px',
                          borderBottom: '1px solid var(--border-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.94rem' }}>
                            {appt.patientName}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {appt.reason || 'Routine consultation'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 600 }}>
                            <Clock size={12} />
                            <span>{appt.date} at {appt.time}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                          <span
                            className={`badge ${
                              appt.status === 'Confirmed'
                                ? 'badge-primary'
                                : appt.status === 'Completed'
                                ? 'badge-success'
                                : 'badge-warning'
                            }`}
                          >
                            {appt.status}
                          </span>
                          {appt.status === 'Confirmed' && (
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                              onClick={() => handleStatusChange(appt.id, 'Completed')}
                            >
                              Mark Done
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Prescriptions */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <FileText size={18} color="var(--secondary)" />
                  <span>Recent Issued Prescriptions</span>
                </h3>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setActiveTab('patients')}
                >
                  Search Records
                </button>
              </div>

              <div className="card-body" style={{ padding: 0 }}>
                {prescriptions.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No prescriptions issued yet
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {prescriptions.slice(0, 4).map((rx) => (
                      <div
                        key={rx.id}
                        style={{
                          padding: '16px 20px',
                          borderBottom: '1px solid var(--border-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.94rem' }}>
                            {rx.patientName}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-body)', marginTop: '2px', fontWeight: 500 }}>
                            {rx.diagnosis}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {rx.medicines?.length} medicines • {rx.date}
                          </div>
                        </div>

                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setSelectedRxForPrint(rx)}
                          title="View and print official hospital prescription"
                        >
                          <Printer size={14} />
                          <span>View Slip</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PATIENTS DIRECTORY & MEDICAL HISTORY */}
      {activeTab === 'patients' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: '24px' }}>
            
            {/* Left: Search & Patient List */}
            <div>
              <div className="card" style={{ marginBottom: '16px' }}>
                <div className="card-body" style={{ padding: '16px' }}>
                  <div className="input-with-icon" style={{ marginBottom: '10px' }}>
                    <Search size={16} />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search name, UHID, blood group..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Showing {filteredPatients.length} of {patients.length} patients
                  </div>
                </div>
              </div>

              {/* Patient Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '700px', overflowY: 'auto' }}>
                {filteredPatients.map((p) => {
                  const isSelected = p.id === selectedPatientId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPatientId(p.id)}
                      className={`card card-interactive`}
                      style={{
                        padding: '14px 16px',
                        borderLeft: isSelected ? '4px solid var(--primary)' : '1px solid var(--border-color)',
                        background: isSelected ? 'var(--primary-subtle)' : 'var(--bg-surface)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={p.avatar}
                          alt={p.name}
                          style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.94rem' }}>
                              {p.name}
                            </span>
                            <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                              {p.bloodGroup}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {p.age} Yrs, {p.gender} • <span style={{ fontFamily: 'var(--font-mono)' }}>{p.idNumber}</span>
                          </div>
                          {p.chronicConditions?.length > 0 && (
                            <div style={{ fontSize: '0.74rem', color: 'var(--primary)', marginTop: '4px', fontWeight: 600 }}>
                              {p.chronicConditions[0]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Patient Details & Medical History */}
            {selectedPatient ? (
              <div className="card">
                <div className="card-header" style={{ background: 'var(--bg-surface-alt)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={selectedPatient.avatar}
                      alt={selectedPatient.name}
                      style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {selectedPatient.name}
                        </h2>
                        <span className="badge badge-primary">{selectedPatient.bloodGroup}</span>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                        Age: {selectedPatient.age} Yrs • Gender: {selectedPatient.gender} • UHID: <strong>{selectedPatient.idNumber}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleWriteRxForPatient(selectedPatient.id)}
                  >
                    <FilePlus size={16} />
                    <span>Write Prescription</span>
                  </button>
                </div>

                <div className="card-body">
                  {/* Allergy Banner (Critical Medical Warning) */}
                  <div
                    style={{
                      background: 'var(--danger-bg)',
                      border: '1px solid var(--danger-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 18px',
                      marginBottom: '22px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <AlertCircle size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--danger-text)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Known Allergies & Drug Contraindications:
                      </div>
                      <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600, marginTop: '2px' }}>
                        {selectedPatient.allergies?.join(' • ') || 'No known drug allergies reported'}
                      </div>
                    </div>
                  </div>

                  {/* Vitals Cards */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={18} color="var(--primary)" />
                      <span>Latest Recorded Vitals (as of {selectedPatient.vitals?.lastUpdated || 'Recent'})</span>
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                      <div style={{ background: 'var(--bg-surface-alt)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Blood Pressure</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: selectedPatient.vitals?.bpStatus === 'elevated' ? 'var(--danger)' : 'var(--text-main)' }}>
                          {selectedPatient.vitals?.bp || '--'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>mmHg</div>
                      </div>

                      <div style={{ background: 'var(--bg-surface-alt)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Heart Rate</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {selectedPatient.vitals?.heartRate || '--'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>bpm</div>
                      </div>

                      <div style={{ background: 'var(--bg-surface-alt)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Blood Oxygen (SpO2)</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7' }}>
                          {selectedPatient.vitals?.spo2 || '--'}%
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Room Air</div>
                      </div>

                      <div style={{ background: 'var(--bg-surface-alt)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Body Temp</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {selectedPatient.vitals?.temp || '98.6'}°F
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Oral</div>
                      </div>

                      <div style={{ background: 'var(--bg-surface-alt)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>BMI Index</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {selectedPatient.vitals?.bmi || '--'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{selectedPatient.vitals?.bmiCategory || 'Normal'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Patient Adherence Rate Banner */}
                  {(() => {
                    const adherence = getAdherenceStats(selectedPatient.id);
                    return (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 18px',
                          background: 'var(--secondary-subtle)',
                          border: '1.5px solid var(--secondary-light)',
                          borderRadius: 'var(--radius-md)',
                          marginBottom: '22px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Flame size={20} color="#f59e0b" />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f766e' }}>
                              Patient Medication Adherence: {adherence.rate}% Compliance
                            </div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                              Active {adherence.streak}-day streak taking prescribed medicines on schedule.
                            </div>
                          </div>
                        </div>
                        <span className="badge badge-secondary">{adherence.streak}-Day Streak</span>
                      </div>
                    );
                  })()}

                  {/* Interactive Vitals Trend Chart */}
                  <VitalsTrendChart
                    vitalsHistory={selectedPatient.vitalsHistory}
                    patientName={selectedPatient.name}
                  />

                  {/* Chronic Conditions & Contact */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: 'var(--bg-surface-alt)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Chronic Diagnoses & Conditions:
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {selectedPatient.chronicConditions?.join(', ') || 'None recorded'}
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-surface-alt)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Emergency Contact & Location:
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-body)' }}>
                        <div>{selectedPatient.emergencyContact || 'No emergency contact on file'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{selectedPatient.address}</div>
                      </div>
                    </div>
                  </div>

                  {/* Medical History Timeline */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={18} color="var(--primary)" />
                      <span>Past Consultation Timeline & History</span>
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {selectedPatient.medicalHistory?.map((hist, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '14px 16px',
                            background: '#ffffff',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: '4px solid var(--secondary)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                              {hist.condition}
                            </span>
                            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                              {hist.date}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                            Attending: {hist.doctorName} ({hist.department})
                          </div>
                          <div style={{ fontSize: '0.84rem', color: 'var(--text-body)', marginTop: '6px', lineHeight: 1.5 }}>
                            {hist.notes}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prescriptions issued to this patient */}
                  <div>
                    <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={18} color="var(--secondary)" />
                      <span>Issued Prescriptions for {selectedPatient.name}</span>
                    </h3>

                    {prescriptions.filter((r) => r.patientId === selectedPatient.id).length === 0 ? (
                      <div style={{ padding: '20px', background: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No prescriptions issued to this patient yet.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {prescriptions
                          .filter((r) => r.patientId === selectedPatient.id)
                          .map((rx) => (
                            <div
                              key={rx.id}
                              style={{
                                padding: '14px 16px',
                                background: '#ffffff',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                                  {rx.diagnosis}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                  Ref: {rx.rxNumber} • Issued {rx.date} • {rx.medicines?.length} medicines
                                </div>
                              </div>

                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => setSelectedRxForPrint(rx)}
                              >
                                <Printer size={14} />
                                <span>View / Print Rx</span>
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Diagnostic Lab Reports for Selected Patient */}
                  <div style={{ marginTop: '28px' }}>
                    <LabReportsHub
                      patient={selectedPatient}
                      isDoctor={true}
                      doctor={doctor}
                      onToast={onToast}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Select a patient from the left directory to view full profile and medical history.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: NEW PRESCRIPTION STUDIO */}
      {activeTab === 'new-rx' && (
        <PrescriptionStudio
          doctor={doctor}
          initialPatientId={selectedPatientId}
          onToast={onToast}
          onPrescriptionIssued={(newRx) => {
            setSelectedRxForPrint(newRx);
            setActiveTab('dashboard');
          }}
        />
      )}

      {/* TAB: DIAGNOSTIC LAB HUB (FULL VIEW) */}
      {activeTab === 'lab-reports' && (
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-body" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Microscope size={22} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.94rem' }}>Select Patient to Inspect Laboratory Records:</span>
              </div>
              <select
                className="form-select"
                style={{ maxWidth: '340px' }}
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.age}Y, {p.gender}) - {p.idNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedPatient && (
            <LabReportsHub
              patient={selectedPatient}
              isDoctor={true}
              doctor={doctor}
              onToast={onToast}
            />
          )}
        </div>
      )}

      {/* TAB 4: APPOINTMENTS MANAGEMENT */}
      {activeTab === 'appointments' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Calendar size={20} color="var(--primary)" />
              <span>Doctor Consultation Schedule</span>
            </h2>
            <span className="badge badge-primary">{appointments.length} Total</span>
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            {appointments.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No appointments booked at this time.
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
                      gap: '16px'
                    }}
                  >
                    <div style={{ maxWidth: '480px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                          {appt.patientName}
                        </span>
                        <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                          {appt.type || 'Consultation'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.86rem', color: 'var(--text-body)', marginTop: '4px' }}>
                        <strong>Reason:</strong> {appt.reason}
                      </div>
                      {appt.notes && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Note: {appt.notes}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                        <Clock size={14} />
                        <span>Date: {appt.date} • Scheduled Slot: {appt.time}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        className={`badge ${
                          appt.status === 'Confirmed'
                            ? 'badge-primary'
                            : appt.status === 'Completed'
                            ? 'badge-success'
                            : 'badge-warning'
                        }`}
                      >
                        {appt.status}
                      </span>

                      {appt.status === 'Confirmed' && (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleStatusChange(appt.id, 'Completed')}
                        >
                          <CheckCircle size={14} />
                          <span>Mark Completed</span>
                        </button>
                      )}

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleWriteRxForPatient(appt.patientId)}
                      >
                        <FilePlus size={14} />
                        <span>Write Rx</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: DOCTOR PROFILE & CHAMBER UPDATE */}
      {activeTab === 'profile' && (
        <div className="card" style={{ maxWidth: '750px', margin: '0 auto' }}>
          <div className="card-header">
            <h2 className="card-title">
              <Edit3 size={20} color="var(--primary)" />
              <span>Update Doctor Profile & Consultation Chamber</span>
            </h2>
          </div>

          <div className="card-body">
            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Doctor Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Degrees / Credentials</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.title}
                    onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Medical Specialty</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.specialty}
                    onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Chamber Room & Building</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.chamber}
                    onChange={(e) => setProfileData({ ...profileData, chamber: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Visiting Hours</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.visitingHours}
                    onChange={(e) => setProfileData({ ...profileData, visitingHours: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Consultation Fee</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.fee}
                    onChange={(e) => setProfileData({ ...profileData, fee: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone / OPD Contact</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Bio & Practice Focus</label>
                <textarea
                  className="form-textarea"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary btn-lg">
                  <CheckCircle size={18} />
                  <span>Save Chamber & Profile Changes</span>
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
    </div>
  );
}
