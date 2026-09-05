import React, { useState } from 'react';
import {
  Stethoscope,
  UserCheck,
  Shield,
  FileText,
  Calendar,
  HeartPulse,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  UserPlus
} from 'lucide-react';
import Logo from '../common/Logo';
import { getDoctors, getPatients, setSession, createAppointment, updatePatient } from '../../services/storage';

export default function AuthLanding({ onToast }) {
  const [activePortal, setActivePortal] = useState(null); // 'doctor' | 'patient' | null
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [phone, setPhone] = useState('');
  const [selectedDemoId, setSelectedDemoId] = useState('');

  const doctors = getDoctors();
  const patients = getPatients();

  // Open modal with specific role pre-selected
  const handleOpenPortal = (role) => {
    setActivePortal(role);
    setAuthTab('login');
    if (role === 'doctor') {
      setSelectedDemoId(doctors[0]?.id || '');
      setEmail(doctors[0]?.email || 'dr.preetam@medicare.org');
      setPassword('doctor123');
    } else {
      setSelectedDemoId(patients[0]?.id || '');
      setEmail(patients[0]?.email || 'ananya.roy@example.com');
      setPassword('patient123');
    }
  };

  const handleDemoSelect = (id) => {
    setSelectedDemoId(id);
    if (activePortal === 'doctor') {
      const doc = doctors.find((d) => d.id === id);
      if (doc) {
        setEmail(doc.email);
        setPassword('doctor123');
      }
    } else {
      const pat = patients.find((p) => p.id === id);
      if (pat) {
        setEmail(pat.email);
        setPassword('patient123');
      }
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (activePortal === 'doctor') {
      const doctor = doctors.find(
        (d) => d.email.toLowerCase() === email.trim().toLowerCase() || d.id === selectedDemoId
      ) || doctors[0];

      setSession('doctor', doctor);
      onToast(`Welcome, ${doctor.name}! Accessing Doctor Dashboard.`, 'success');
    } else {
      const patient = patients.find(
        (p) => p.email.toLowerCase() === email.trim().toLowerCase() || p.id === selectedDemoId
      ) || patients[0];

      setSession('patient', patient);
      onToast(`Welcome back, ${patient.name}! Accessing Patient Portal.`, 'success');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      onToast('Please enter your full name', 'warning');
      return;
    }

    if (activePortal === 'patient') {
      const newPatient = {
        id: `pat-${Date.now()}`,
        name: name.trim(),
        age: parseInt(age) || 30,
        gender: gender,
        bloodGroup: bloodGroup,
        phone: phone.trim() || '+91 98000-11223',
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        allergies: ['No known allergies documented'],
        chronicConditions: ['None reported'],
        idNumber: `MED-PAT-${Math.floor(5000 + Math.random() * 4000)}`,
        vitals: {
          bp: '120/80',
          bpStatus: 'normal',
          heartRate: 72,
          spo2: 98,
          temp: '98.6',
          weight: 65,
          height: 170,
          bmi: '22.5',
          bmiCategory: 'Normal',
          lastUpdated: new Date().toISOString().split('T')[0]
        },
        medicalHistory: [
          {
            date: new Date().toISOString().split('T')[0],
            condition: 'Initial Patient Registration',
            doctorName: 'MediCare System',
            department: 'Registration Desk',
            notes: 'New patient registered in MediCare Connect database.'
          }
        ]
      };

      updatePatient(newPatient);
      setSession('patient', newPatient);
      onToast(`Registration successful! Welcome to MediCare Connect, ${newPatient.name}.`, 'success');
    } else {
      // Doctor registration
      const newDoctor = {
        id: `doc-${Date.now()}`,
        name: `Dr. ${name.trim()}`,
        title: 'MBBS, MD',
        specialty: 'General Medicine',
        department: 'General Medicine',
        regNumber: `MC-WB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        hospital: 'MediCare Central Super Specialty Hospital',
        chamber: 'Room 105, OPD Block A',
        visitingHours: 'Mon - Fri: 10:00 AM - 03:00 PM',
        fee: '₹750',
        email: email.trim() || `dr.${name.toLowerCase().replace(/\s+/g, '')}@medicare.org`,
        phone: phone.trim() || '+91 98311-22334',
        bio: 'Consultant physician specializing in internal medicine and outpatient clinical management.'
      };

      setSession('doctor', newDoctor);
      onToast(`Medical credentials verified! Welcome, ${newDoctor.name}.`, 'success');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Hero Header */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0369a1 100%)',
          color: '#ffffff',
          padding: 'clamp(28px, 5vw, 52px) clamp(16px, 4vw, 24px) clamp(36px, 6vw, 64px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ maxWidth: '880px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', marginBottom: '16px' }}>
            <Logo size="lg" variant="white" />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              fontSize: 'clamp(0.7rem, 2vw, 0.78rem)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '14px',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <Shield size={14} color="#38bdf8" />
            <span>Integrated Clinical Platform</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '12px'
            }}
          >
            Digital Healthcare, Structured Prescriptions & Unified Records
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.88rem, 2vw, 1.05rem)',
              color: '#cbd5e1',
              maxWidth: '680px',
              margin: '0 auto 20px',
              lineHeight: 1.5
            }}
          >
            A modern hospital portal connecting medical doctors and patients with instant digital prescriptions,
            comprehensive medical history, appointment bookings, and printable clinical slips.
          </p>

          {/* Quick Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: '18px',
              maxWidth: '680px',
              margin: '0 auto'
            }}
          >
            <div>
              <div style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', fontWeight: 800, color: '#38bdf8' }}>4+ Depts</div>
              <div style={{ fontSize: 'clamp(0.62rem, 1.5vw, 0.72rem)', color: '#94a3b8', textTransform: 'uppercase' }}>Medicine, Cardio, Peds</div>
            </div>
            <div>
              <div style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', fontWeight: 800, color: '#2dd4bf' }}>100% Digital</div>
              <div style={{ fontSize: 'clamp(0.62rem, 1.5vw, 0.72rem)', color: '#94a3b8', textTransform: 'uppercase' }}>Prescriptions & Slips</div>
            </div>
            <div>
              <div style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', fontWeight: 800, color: '#fcd34d' }}>Instant Demo</div>
              <div style={{ fontSize: 'clamp(0.62rem, 1.5vw, 0.72rem)', color: '#94a3b8', textTransform: 'uppercase' }}>Preloaded Records</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Choice Section: Doctor Login vs Patient Login */}
      <section style={{ maxWidth: '1000px', margin: '-24px auto 40px', padding: '0 16px', width: '100%', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          {/* Card 1: Doctor Portal */}
          <div
            className="card card-interactive"
            onClick={() => handleOpenPortal('doctor')}
            style={{
              padding: '32px 28px',
              borderTop: '5px solid var(--primary)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#ffffff'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Stethoscope size={28} />
                </div>
                <span className="badge badge-primary">Medical Staff</span>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                Doctor Portal
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
                For licensed physicians, cardiologists, pediatricians, and clinical residents to conduct consultations and prescribe care.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--text-body)' }}>
                  <CheckCircle2 size={16} color="var(--primary)" />
                  <span>Search and inspect patient profiles & medical history</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--text-body)' }}>
                  <CheckCircle2 size={16} color="var(--primary)" />
                  <span>Compose digital prescriptions with dosage & instructions</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--primary)' }}>
                  <CheckCircle2 size={16} color="var(--primary)" />
                  <span>Manage OPD schedule and patient appointments</span>
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-block" style={{ marginTop: '10px' }}>
              <span>Doctor Login</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Card 2: Patient Portal */}
          <div
            className="card card-interactive"
            onClick={() => handleOpenPortal('patient')}
            style={{
              padding: '32px 28px',
              borderTop: '5px solid var(--secondary)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#ffffff'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: 'var(--secondary-light)',
                    color: 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <HeartPulse size={28} />
                </div>
                <span className="badge badge-secondary">Personal Health</span>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                Patient Portal
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
                For patients and families to securely access health history, view prescriptions, and schedule doctor visits.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--text-body)' }}>
                  <CheckCircle2 size={16} color="var(--secondary)" />
                  <span>Access digital prescriptions with exact pill schedules</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--secondary)"' }}>
                  <CheckCircle2 size={16} color="var(--secondary)" />
                  <span>Download and print clean official hospital Rx slips</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--secondary)' }}>
                  <CheckCircle2 size={16} color="var(--secondary)" />
                  <span>Book consultations with specialists & view past visits</span>
                </div>
              </div>
            </div>

            <button className="btn btn-secondary btn-block" style={{ marginTop: '10px' }}>
              <span>Patient Login</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </section>

      {/* Auth Modal (when either Doctor or Patient login is clicked) */}
      {activePortal && (
        <div className="modal-overlay" onClick={() => setActivePortal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    background: activePortal === 'doctor' ? 'var(--primary-light)' : 'var(--secondary-light)',
                    color: activePortal === 'doctor' ? 'var(--primary)' : 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {activePortal === 'doctor' ? <Stethoscope size={20} /> : <UserCheck size={20} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    {activePortal === 'doctor' ? 'Doctor Portal Authentication' : 'Patient Portal Authentication'}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    MediCare Central Hospital System
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActivePortal(null)}
                style={{ fontSize: '1.2rem', color: 'var(--text-muted)', padding: '4px 8px' }}
              >
                ✕
              </button>
            </div>

            {/* Auth Tab Switcher */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-surface-alt)' }}>
              <button
                onClick={() => setAuthTab('login')}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  borderBottom: authTab === 'login' ? `2.5px solid ${activePortal === 'doctor' ? 'var(--primary)' : 'var(--secondary)'}` : 'none',
                  color: authTab === 'login' ? 'var(--text-main)' : 'var(--text-muted)',
                  background: authTab === 'login' ? 'var(--bg-surface)' : 'transparent'
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthTab('register')}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  borderBottom: authTab === 'register' ? `2.5px solid ${activePortal === 'doctor' ? 'var(--primary)' : 'var(--secondary)'}` : 'none',
                  color: authTab === 'register' ? 'var(--text-main)' : 'var(--text-muted)',
                  background: authTab === 'register' ? 'var(--bg-surface)' : 'transparent'
                }}
              >
                {activePortal === 'doctor' ? 'New Doctor Registration' : 'New Patient Registration'}
              </button>
            </div>

            <div className="modal-body">
              {authTab === 'login' ? (
                <>
                  {/* Quick 1-Click Demo Profiles */}
                  <div style={{ marginBottom: '20px', padding: '12px', background: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Fast 1-Click Demo Profile:
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {activePortal === 'doctor' ? (
                        <>
                          <button
                            type="button"
                            className={`btn btn-sm ${selectedDemoId === doctors[0]?.id ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => handleDemoSelect(doctors[0]?.id)}
                          >
                            👨‍⚕️ Dr. Preetam Sen (Cardio)
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${selectedDemoId === doctors[1]?.id ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => handleDemoSelect(doctors[1]?.id)}
                          >
                            👩‍⚕️ Dr. Sarah Jenkins (Peds)
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={`btn btn-sm ${selectedDemoId === patients[0]?.id ? 'btn-secondary' : 'btn-outline'}`}
                            onClick={() => handleDemoSelect(patients[0]?.id)}
                          >
                            🙋‍♀️ Ananya Roy (28, B+)
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${selectedDemoId === patients[1]?.id ? 'btn-secondary' : 'btn-outline'}`}
                            onClick={() => handleDemoSelect(patients[1]?.id)}
                          >
                            🙋‍♂️ Rahul Sharma (42, O+)
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleLoginSubmit}>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <div className="input-with-icon">
                        <Mail size={16} />
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@medicare.org"
                          required
                          autoComplete="username"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Password</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Demo: any password</span>
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Lock size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={{ paddingLeft: '42px', paddingRight: '42px' }}
                          required
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: '12px', color: 'var(--text-muted)' }}
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`btn ${activePortal === 'doctor' ? 'btn-primary' : 'btn-secondary'} btn-block btn-lg`}
                      style={{ marginTop: '12px' }}
                    >
                      <span>Sign In to {activePortal === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}</span>
                      <ArrowRight size={18} />
                    </button>
                  </form>
                </>
              ) : (
                /* Registration Form */
                <form onSubmit={handleRegisterSubmit}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={activePortal === 'doctor' ? 'e.g. Preetam Sen' : 'e.g. Ananya Roy'}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Age</label>
                      <input
                        type="number"
                        className="form-control"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="28"
                        min="1"
                        max="120"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {activePortal === 'patient' && (
                    <div className="form-group">
                      <label className="form-label">Blood Group</label>
                      <select className="form-select" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98312-34567"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`btn ${activePortal === 'doctor' ? 'btn-primary' : 'btn-secondary'} btn-block btn-lg`}
                  >
                    <UserPlus size={18} />
                    <span>Create {activePortal === 'doctor' ? 'Doctor' : 'Patient'} Account & Enter</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
