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
        <span style={{ fontWeight: 700, letterSpacing: '0.02em', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }} />
          <span>Demo Hub</span>
        </span>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: '3px', background: '#020617', padding: '2px', borderRadius: '6px', flexShrink: 0 }}>
          <button
            className={`view-toggle-btn ${viewMode === 'laptop' ? 'active' : ''}`}
            onClick={() => onViewModeChange('laptop')}
            title="Full Laptop / Desktop Browser View"
          >
            <Laptop size={13} />
            <span>Laptop</span>
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'android' ? 'active' : ''}`}
            onClick={() => onViewModeChange('android')}
            title="Simulated Android Mobile App (412px x 870px)"
          >
            <Smartphone size={13} />
            <span>Android</span>
          </button>
        </div>
      </div>

      <div className="device-toolbar-right">
        {/* Quick Demo Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          <button
            className="demo-chip"
            onClick={() => handleQuickLogin('doctor', doctors[0])}
            title="Login as Dr. Preetam Sen (Cardiology)"
          >
            👨‍⚕️ Dr. Preetam
          </button>
          <button
            className="demo-chip"
            onClick={() => handleQuickLogin('doctor', doctors[1])}
            title="Login as Dr. Sarah Jenkins (Pediatrics)"
          >
            👩‍⚕️ Dr. Sarah
          </button>
          <button
            className="demo-chip"
            onClick={() => handleQuickLogin('patient', patients[0])}
            title="Login as Ananya Roy (Patient)"
          >
            🙋‍♀️ Ananya
          </button>
          <button
            className="demo-chip"
            onClick={() => handleQuickLogin('patient', patients[1])}
            title="Login as Rahul Sharma (Patient)"
          >
            🙋‍♂️ Rahul
          </button>
        </div>

        <button
          className="demo-chip"
          onClick={handleResetData}
          title="Reset hospital database to initial demo state"
          style={{ marginLeft: '2px', borderColor: '#475569' }}
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
