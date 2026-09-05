import React, { useState, useEffect } from 'react';
import {
  FilePlus,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Printer,
  AlertTriangle,
  Info
} from 'lucide-react';
import { CLINICAL_PRESETS } from '../../services/mockData';
import { getPatients, createPrescription, checkDrugAllergyConflict } from '../../services/storage';

export default function PrescriptionStudio({ doctor, initialPatientId, onPrescriptionIssued, onToast }) {
  const patients = getPatients();
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId || (patients[0]?.id || ''));
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [advice, setAdvice] = useState('');
  const [nextVisitDate, setNextVisitDate] = useState('');
  const [vitalsAtConsult, setVitalsAtConsult] = useState('');
  const [overrideAccepted, setOverrideAccepted] = useState(false);

  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: '',
      strength: '',
      form: 'Tablet',
      dosage: '1 tablet',
      frequency: 'Twice daily',
      duration: '5 days',
      timing: 'After meals',
      instructions: ''
    }
  ]);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  // Update vitals preview when patient changes
  useEffect(() => {
    if (selectedPatient?.vitals) {
      setVitalsAtConsult(
        `BP: ${selectedPatient.vitals.bp} mmHg | HR: ${selectedPatient.vitals.heartRate} bpm | SpO2: ${selectedPatient.vitals.spo2}% | Temp: ${selectedPatient.vitals.temp}°F`
      );
    }
  }, [selectedPatientId]);

  // Handle Preset Selection
  const handleApplyPreset = (e) => {
    const presetIndex = e.target.value;
    if (presetIndex === '') return;
    const preset = CLINICAL_PRESETS[parseInt(presetIndex)];
    if (preset) {
      setDiagnosis(preset.diagnosis);
      setAdvice(preset.advice);
      setMedicines(
        preset.medicines.map((m, idx) => ({
          id: Date.now() + idx,
          ...m
        }))
      );
      onToast(`Applied clinical preset: ${preset.name}`, 'info');
    }
  };

  // Medication Row operations
  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      {
        id: Date.now(),
        name: '',
        strength: '',
        form: 'Tablet',
        dosage: '1 tablet',
        frequency: 'Twice daily',
        duration: '5 days',
        timing: 'After meals',
        instructions: ''
      }
    ]);
  };

  const handleRemoveMedicine = (id) => {
    if (medicines.length === 1) {
      onToast('Prescription must contain at least one medication', 'warning');
      return;
    }
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  const handleUpdateMedicine = (id, field, value) => {
    setMedicines(
      medicines.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  // Real-time contraindication detection against patient allergies
  const allergyWarnings = medicines
    .map((med, idx) => {
      if (!med.name.trim()) return null;
      const conflict = checkDrugAllergyConflict(selectedPatient?.allergies || [], med.name);
      return conflict ? { ...conflict, medIndex: idx, medName: med.name } : null;
    })
    .filter(Boolean);

  // Issue Prescription
  const handleIssuePrescription = (e) => {
    e.preventDefault();

    if (!selectedPatient) {
      onToast('Please select a valid patient', 'danger');
      return;
    }
    if (!diagnosis.trim()) {
      onToast('Please provide a clinical diagnosis', 'warning');
      return;
    }

    const validMeds = medicines.filter((m) => m.name.trim().length > 0);
    if (validMeds.length === 0) {
      onToast('Please add at least one medication name', 'warning');
      return;
    }

    // Drug Allergy Clinical Safety Guard
    if (allergyWarnings.length > 0 && !overrideAccepted) {
      onToast(
        `Critical Safety Warning: ${allergyWarnings[0].medName} is contraindicated for ${selectedPatient.name} due to ${allergyWarnings[0].allergyName} allergy. Acknowledge physician override to proceed.`,
        'danger'
      );
      return;
    }

    const newRx = createPrescription({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientAge: selectedPatient.age,
      patientGender: selectedPatient.gender,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorTitle: doctor.title,
      doctorReg: doctor.regNumber,
      department: doctor.department,
      diagnosis: diagnosis.trim(),
      symptoms: symptoms.trim() || 'Not specified',
      vitalsAtConsult: vitalsAtConsult,
      medicines: validMeds,
      generalAdvice: advice.trim() ? [advice.trim()] : ['Follow prescribed dosage. Drink plenty of water.'],
      nextVisitDate: nextVisitDate || 'As needed'
    });

    onToast(`Digital prescription issued for ${selectedPatient.name}!`, 'success');
    if (onPrescriptionIssued) {
      onPrescriptionIssued(newRx);
    }
  };

  return (
    <div className="prescription-composer">
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FilePlus size={20} />
            </div>
            <div>
              <h2 className="card-title">Digital Prescription Studio (Rx Composer)</h2>
              <div className="card-subtitle">
                Compose, validate, and issue official verified hospital prescriptions
              </div>
            </div>
          </div>

          {/* Clinical Presets dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--primary)" />
            <select
              className="form-select"
              style={{ fontSize: '0.82rem', padding: '6px 12px', minHeight: '36px', background: '#ffffff' }}
              onChange={handleApplyPreset}
              defaultValue=""
            >
              <option value="" disabled>⚡ Quick Clinical Presets</option>
              {CLINICAL_PRESETS.map((p, idx) => (
                <option key={idx} value={idx}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="card-body">
          <form onSubmit={handleIssuePrescription}>
            {/* Top Row: Patient Selection & Patient Allergies Callout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Target Patient</label>
                <select
                  className="form-select"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  required
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age} Yrs, {p.gender}) - {p.idNumber} - Blood: {p.bloodGroup}
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Allergy Warning Box (crucial security/medical check) */}
              {selectedPatient && (
                <div
                  style={{
                    background: selectedPatient.allergies?.length ? 'var(--danger-bg)' : 'var(--bg-surface-alt)',
                    border: `1.5px solid ${selectedPatient.allergies?.length ? 'var(--danger-border)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: selectedPatient.allergies?.length ? 'var(--danger-text)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                    <AlertTriangle size={14} />
                    <span>Allergies & Contraindications:</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                    {selectedPatient.allergies?.join(', ') || 'None recorded'}
                  </div>
                </div>
              )}
            </div>

            {/* Diagnosis & Symptoms */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '22px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  Clinical Diagnosis <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Bronchial Spasm with Allergic Tracheobronchitis"
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  Chief Complaints / Symptoms <span className="form-label-optional">(Optional)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Nighttime cough, chest tightness, throat irritation"
                />
              </div>
            </div>

            {/* Medicines List Composer */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'Times New Roman', fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--primary)' }}>℞</span>
                  Prescribed Medicines ({medicines.length})
                </h3>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleAddMedicine}
                >
                  <Plus size={15} />
                  <span>Add Another Medication</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {medicines.map((med, idx) => {
                  const conflict = allergyWarnings.find((w) => w.medIndex === idx);
                  return (
                    <div
                      key={med.id}
                      style={{
                        background: conflict ? '#fef2f2' : 'var(--bg-surface-alt)',
                        border: conflict ? '2px solid #ef4444' : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: conflict ? '#dc2626' : 'var(--primary)', textTransform: 'uppercase' }}>
                            Medicine #{idx + 1}
                          </span>
                          {conflict && (
                            <span className="badge badge-danger" style={{ fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <AlertTriangle size={12} />
                              <span>Contraindicated: Patient Allergic to {conflict.allergyName}!</span>
                            </span>
                          )}
                        </div>
                        {medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(med.id)}
                            style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                            title="Remove this medicine"
                          >
                            <Trash2 size={14} />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '10px' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Medicine Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={med.name}
                          onChange={(e) => handleUpdateMedicine(med.id, 'name', e.target.value)}
                          placeholder="e.g. Paracetamol / Montelukast"
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Strength</label>
                        <input
                          type="text"
                          className="form-control"
                          value={med.strength}
                          onChange={(e) => handleUpdateMedicine(med.id, 'strength', e.target.value)}
                          placeholder="e.g. 500 mg / 10 mg"
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Form</label>
                        <select
                          className="form-select"
                          value={med.form}
                          onChange={(e) => handleUpdateMedicine(med.id, 'form', e.target.value)}
                        >
                          <option value="Tablet">Tablet</option>
                          <option value="Capsule">Capsule</option>
                          <option value="Syrup">Syrup</option>
                          <option value="Inhaler / MDI">Inhaler / MDI</option>
                          <option value="Injection">Injection</option>
                          <option value="Nasal Spray">Nasal Spray</option>
                          <option value="Eye Drops">Eye Drops</option>
                          <option value="Ointment">Ointment</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Dosage</label>
                        <input
                          type="text"
                          className="form-control"
                          value={med.dosage}
                          onChange={(e) => handleUpdateMedicine(med.id, 'dosage', e.target.value)}
                          placeholder="e.g. 1 tab / 10 ml"
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Frequency</label>
                        <input
                          type="text"
                          className="form-control"
                          value={med.frequency}
                          onChange={(e) => handleUpdateMedicine(med.id, 'frequency', e.target.value)}
                          placeholder="e.g. Twice daily / 1-0-1"
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Duration</label>
                        <input
                          type="text"
                          className="form-control"
                          value={med.duration}
                          onChange={(e) => handleUpdateMedicine(med.id, 'duration', e.target.value)}
                          placeholder="e.g. 5 days / 1 month"
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Timing</label>
                        <select
                          className="form-select"
                          value={med.timing}
                          onChange={(e) => handleUpdateMedicine(med.id, 'timing', e.target.value)}
                        >
                          <option value="After meals">After meals</option>
                          <option value="Before meals">Before meals</option>
                          <option value="With food">With food</option>
                          <option value="At bedtime">At bedtime</option>
                          <option value="SOS (As needed)">SOS (As needed)</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Special Instructions</label>
                        <input
                          type="text"
                          className="form-control"
                          value={med.instructions}
                          onChange={(e) => handleUpdateMedicine(med.id, 'instructions', e.target.value)}
                          placeholder="e.g. Rinse mouth / Take with water"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

            {/* Advice & Next Visit */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">General Medical Advice & Lifestyle Precautions</label>
                <textarea
                  className="form-textarea"
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="e.g. Drink warm fluids, avoid allergen exposure, check blood pressure weekly..."
                  rows={3}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Recommended Follow-up Review Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={nextVisitDate}
                  onChange={(e) => setNextVisitDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Leave blank if follow-up is SOS (only when needed).
                </div>
              </div>
            </div>

            {/* Clinical Decision Support System (CDSS) Contraindication Warning Banner */}
            {allergyWarnings.length > 0 && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '2px solid #ef4444',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  marginBottom: '20px',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontWeight: 800, fontSize: '0.94rem' }}>
                  <AlertTriangle size={20} />
                  <span>CLINICAL DECISION SUPPORT: DRUG CONTRAINDICATION DETECTED</span>
                </div>
                <div style={{ fontSize: '0.86rem', color: '#991b1b', marginTop: '6px', lineHeight: 1.5 }}>
                  {allergyWarnings.map((w, idx) => (
                    <div key={idx} style={{ marginTop: '4px' }}>
                      ⚠️ <strong>{w.medName}</strong> matches patient's documented <strong>{w.allergyName}</strong> allergy. High clinical risk: <em>{w.reaction}</em>.
                    </div>
                  ))}
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer', background: '#ffffff', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #fecaca' }}>
                  <input
                    type="checkbox"
                    checked={overrideAccepted}
                    onChange={(e) => setOverrideAccepted(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#dc2626' }}
                  />
                  <span>Physician Clinical Override: I have reviewed patient allergy risks and assume clinical responsibility.</span>
                </label>
              </div>
            )}

            {/* Submit Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '18px' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
              >
                <CheckCircle2 size={18} />
                <span>Issue & Sign Digital Prescription</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
