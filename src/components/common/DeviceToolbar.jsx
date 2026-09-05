import React from 'react';
import { Laptop, Smartphone, RotateCcw, UserCheck, ShieldAlert } from 'lucide-react';
import { setSession, resetDatabase, getDoctors, getPatients } from '../../services/storage';

export default function DeviceToolbar({ viewMode, onViewModeChange, activeSession, onToast }) {
  const doctors = getDoctors();
  const patients = getPatients();

  const handleQuickLogin = (role, user) => {
    setSession(role, user);
    onToast(`Switched to ${role.toUpperCase()}: ${user.name}`, 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data (doctors, patients, prescriptions, appointments) to default?')) {
      resetDatabase();
      onToast('Hospital database reset to initial demo state', 'info');
    }
  };

  return (
    <div className="device-toolbar">
      <div className="device-toolbar-left">
        <span style={{ fontWeight: 700, letterSpacing: '0.02em', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          MediCare Demo Hub
        </span>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: '4px', background: '#020617', padding: '3px', borderRadius: '8px' }}>
          <button
            className={`view-toggle-btn ${viewMode === 'laptop' ? 'active' : ''}`}
            onClick={() => onViewModeChange('laptop')}
            title="Full Laptop / Desktop Browser View"
          >
            <Laptop size={14} />
            <span>Laptop View</span>
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'android' ? 'active' : ''}`}
            onClick={() => onViewModeChange('android')}
            title="Simulated Android Mobile App (412px x 870px)"
          >
            <Smartphone size={14} />
            <span>Android App</span>
          </button>
        </div>
      </div>

      <div className="device-toolbar-right">
        {/* Quick Demo Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
            Quick Persona:
          </span>
          <button
            className="demo-chip"
            onClick={() => handleQuickLogin('doctor', doctors[0])}
            title="Login as Dr. Preetam Sen (Cardiology)"
          >
            👨‍⚕️ Dr. Preetam Sen
          </button>
          <button
            className="demo-chip"
            onClick={() => handleQuickLogin('doctor', doctors[1])}
            title="Login as Dr. Sarah Jenkins (Pediatrics)"
          >
            👩‍⚕️ Dr. Sarah Jenkins
          </button>
          <button
            className="demo-chip"
            onClick={() => handleQuickLogin('patient', patients[0])}
            title="Login as Ananya Roy (Patient)"
          >
            🙋‍♀️ Ananya Roy
          </button>
          <button
            className="demo-chip"
            onClick={() => handleQuickLogin('patient', patients[1])}
            title="Login as Rahul Sharma (Patient)"
          >
            🙋‍♂️ Rahul Sharma
          </button>
        </div>

        <button
          className="demo-chip"
          onClick={handleResetData}
          title="Reset hospital database to initial demo state"
          style={{ marginLeft: '4px', borderColor: '#475569' }}
        >
          <RotateCcw size={12} />
          <span>Reset Data</span>
        </button>
      </div>
    </div>
  );
}
