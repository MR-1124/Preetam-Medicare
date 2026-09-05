import React, { useState, useEffect } from 'react';
import {
  Pill,
  CheckCircle2,
  Circle,
  Clock,
  Sun,
  Moon,
  Coffee,
  Flame,
  Award,
  AlertCircle
} from 'lucide-react';
import {
  getPrescriptionsByPatient,
  getPillTrackerMap,
  togglePillDose,
  getAdherenceStats
} from '../../services/storage';

export default function DailyPillTracker({ patientId, onToast }) {
  const prescriptions = getPrescriptionsByPatient(patientId);
  const activeRx = prescriptions.find((r) => r.status === 'Active') || prescriptions[0];
  const todayStr = new Date().toISOString().split('T')[0];

  const [trackerMap, setTrackerMap] = useState(() => getPillTrackerMap());
  const [adherence, setAdherence] = useState(() => getAdherenceStats(patientId));

  useEffect(() => {
    const handleUpdate = () => {
      setTrackerMap(getPillTrackerMap());
      setAdherence(getAdherenceStats(patientId));
    };
    window.addEventListener('medicare_data_updated', handleUpdate);
    return () => window.removeEventListener('medicare_data_updated', handleUpdate);
  }, [patientId]);

  if (!activeRx || !activeRx.medicines || activeRx.medicines.length === 0) {
    return null;
  }

  // Segment medicines into Morning / Afternoon / Night
  const morningDoses = [];
  const afternoonDoses = [];
  const nightDoses = [];

  activeRx.medicines.forEach((med, idx) => {
    const freq = (med.frequency || '').toLowerCase();
    const timing = (med.timing || '').toLowerCase();

    if (freq.includes('twice') || freq.includes('1-0-1') || freq.includes('morning') || freq.includes('three')) {
      morningDoses.push({ ...med, doseKey: `m_${idx}`, timeLabel: '08:00 AM' });
    }
    if (freq.includes('three') || freq.includes('lunch') || freq.includes('afternoon')) {
      afternoonDoses.push({ ...med, doseKey: `a_${idx}`, timeLabel: '01:30 PM' });
    }
    if (freq.includes('twice') || freq.includes('1-0-1') || freq.includes('night') || freq.includes('bedtime') || freq.includes('once daily at bedtime')) {
      nightDoses.push({ ...med, doseKey: `n_${idx}`, timeLabel: '09:30 PM' });
    }

    // Default catch-all
    if (morningDoses.length === 0 && nightDoses.length === 0) {
      morningDoses.push({ ...med, doseKey: `m_${idx}`, timeLabel: '09:00 AM' });
    }
  });

  const isDoseTaken = (doseKey) => {
    return trackerMap[`${patientId}_${todayStr}`]?.[doseKey]?.taken || false;
  };

  const getDoseTakenTime = (doseKey) => {
    return trackerMap[`${patientId}_${todayStr}`]?.[doseKey]?.time || null;
  };

  const handleToggle = (doseKey, medName) => {
    const currentlyTaken = isDoseTaken(doseKey);
    const nextState = !currentlyTaken;
    togglePillDose(patientId, todayStr, doseKey, nextState);

    if (nextState) {
      onToast(`Marked ${medName} as taken!`, 'success');
    } else {
      onToast(`Unmarked ${medName}`, 'info');
    }
  };

  return (
    <div className="card" style={{ marginBottom: '28px' }}>
      <div className="card-header" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: 'var(--secondary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Pill size={20} />
          </div>
          <div>
            <h3 className="card-title" style={{ color: '#0f766e' }}>
              Daily Medication Adherence Tracker
            </h3>
            <div className="card-subtitle">
              Interactive dose checklist prescribed by {activeRx.doctorName}
            </div>
          </div>
        </div>

        {/* Adherence Streak Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-xs)',
            border: '1px solid var(--border-color)'
          }}
        >
          <Flame size={16} color="#f59e0b" />
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {adherence.streak}-Day Streak
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 700 }}>
            • {adherence.rate}% Adherence
          </span>
        </div>
      </div>

      <div className="card-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          
          {/* MORNING BLOCK */}
          <div
            style={{
              background: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#0369a1' }}>
              <Sun size={18} color="#0284c7" />
              <span style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Morning Routine
              </span>
            </div>

            {morningDoses.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No morning doses scheduled</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {morningDoses.map((m) => {
                  const taken = isDoseTaken(m.doseKey);
                  const takenTime = getDoseTakenTime(m.doseKey);
                  return (
                    <div
                      key={m.doseKey}
                      onClick={() => handleToggle(m.doseKey, m.name)}
                      style={{
                        padding: '10px 12px',
                        background: taken ? 'var(--success-bg)' : '#ffffff',
                        border: `1.5px solid ${taken ? 'var(--success-border)' : 'var(--border-color)'}`,
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: taken ? 'var(--success-text)' : 'var(--text-main)' }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {m.dosage} • {m.timing}
                        </div>
                        {taken && takenTime && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--success-text)', fontWeight: 600, marginTop: '2px' }}>
                            ✓ Taken at {takenTime}
                          </div>
                        )}
                      </div>

                      <div style={{ color: taken ? 'var(--success)' : 'var(--slate-300)' }}>
                        {taken ? <CheckCircle2 size={22} fill="var(--success-bg)" /> : <Circle size={22} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AFTERNOON BLOCK */}
          <div
            style={{
              background: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#d97706' }}>
              <Coffee size={18} color="#d97706" />
              <span style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Afternoon Routine
              </span>
            </div>

            {afternoonDoses.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No afternoon doses scheduled</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {afternoonDoses.map((m) => {
                  const taken = isDoseTaken(m.doseKey);
                  const takenTime = getDoseTakenTime(m.doseKey);
                  return (
                    <div
                      key={m.doseKey}
                      onClick={() => handleToggle(m.doseKey, m.name)}
                      style={{
                        padding: '10px 12px',
                        background: taken ? 'var(--success-bg)' : '#ffffff',
                        border: `1.5px solid ${taken ? 'var(--success-border)' : 'var(--border-color)'}`,
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: taken ? 'var(--success-text)' : 'var(--text-main)' }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {m.dosage} • {m.timing}
                        </div>
                        {taken && takenTime && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--success-text)', fontWeight: 600, marginTop: '2px' }}>
                            ✓ Taken at {takenTime}
                          </div>
                        )}
                      </div>

                      <div style={{ color: taken ? 'var(--success)' : 'var(--slate-300)' }}>
                        {taken ? <CheckCircle2 size={22} fill="var(--success-bg)" /> : <Circle size={22} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* NIGHT BLOCK */}
          <div
            style={{
              background: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#4338ca' }}>
              <Moon size={18} color="#6366f1" />
              <span style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Bedtime / Night Routine
              </span>
            </div>

            {nightDoses.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No bedtime doses scheduled</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {nightDoses.map((m) => {
                  const taken = isDoseTaken(m.doseKey);
                  const takenTime = getDoseTakenTime(m.doseKey);
                  return (
                    <div
                      key={m.doseKey}
                      onClick={() => handleToggle(m.doseKey, m.name)}
                      style={{
                        padding: '10px 12px',
                        background: taken ? 'var(--success-bg)' : '#ffffff',
                        border: `1.5px solid ${taken ? 'var(--success-border)' : 'var(--border-color)'}`,
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: taken ? 'var(--success-text)' : 'var(--text-main)' }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {m.dosage} • {m.timing}
                        </div>
                        {taken && takenTime && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--success-text)', fontWeight: 600, marginTop: '2px' }}>
                            ✓ Taken at {takenTime}
                          </div>
                        )}
                      </div>

                      <div style={{ color: taken ? 'var(--success)' : 'var(--slate-300)' }}>
                        {taken ? <CheckCircle2 size={22} fill="var(--success-bg)" /> : <Circle size={22} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
