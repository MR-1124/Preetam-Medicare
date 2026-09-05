import React from 'react';
import { Printer, Download, X, Stethoscope, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

export default function PrescriptionSlipModal({ prescription, onClose }) {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '850px', maxHeight: '92vh' }}
      >
        {/* Modal Toolbar (hidden during print) */}
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Stethoscope size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                Official Medical Prescription
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Ref ID: {prescription.rxNumber} • Issued {prescription.date}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handlePrint}
              title="Print official prescription or save as PDF"
            >
              <Printer size={15} />
              <span>Print / Save as PDF</span>
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              title="Close viewer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: The Authentic Hospital Prescription Sheet */}
        <div className="modal-body" style={{ background: '#f8fafc', padding: '24px' }}>
          <div className="prescription-slip" id="printable-prescription">
            {/* Background Rx Watermark */}
            <div className="rx-watermark">Rx</div>

            {/* Hospital Header */}
            <div className="rx-header">
              <div className="rx-hospital-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Logo size="sm" showTagline={false} />
                  <div>
                    <div className="rx-hospital-name">MediCare Central Super Specialty Hospital</div>
                    <div className="rx-hospital-sub">
                      Accredited Tertiary Healthcare & Research Center • License: NABH-WB-2024-881
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.74rem', color: '#64748b' }}>
                  <div>Emergency: 1066 / +91 33 2345-6789</div>
                  <div>OPD Desk: opd@medicare.org</div>
                  <div>Salt Lake Sector 5, Kolkata - 700091</div>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="rx-doctor-info">
                <div>
                  <div className="rx-doctor-name">{prescription.doctorName}</div>
                  <div className="rx-doctor-degrees">{prescription.doctorTitle}</div>
                  <div className="rx-doctor-details">
                    Department of {prescription.department || 'Clinical Medicine'} • Medical Reg: <strong>{prescription.doctorReg}</strong>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-success" style={{ marginBottom: '4px' }}>
                    <ShieldCheck size={12} />
                    <span>Verified Physician</span>
                  </span>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Consultation: OPD Chamber 304
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Details Bar */}
            <div className="rx-patient-bar">
              <div className="rx-patient-item">
                <span className="rx-patient-label">Patient Name</span>
                <span className="rx-patient-val">{prescription.patientName}</span>
              </div>
              <div className="rx-patient-item">
                <span className="rx-patient-label">Age / Gender</span>
                <span className="rx-patient-val">{prescription.patientAge} Yrs / {prescription.patientGender}</span>
              </div>
              <div className="rx-patient-item">
                <span className="rx-patient-label">Patient UHID</span>
                <span className="rx-patient-val" style={{ fontFamily: 'var(--font-mono)' }}>{prescription.patientId}</span>
              </div>
              <div className="rx-patient-item">
                <span className="rx-patient-label">Date of Consultation</span>
                <span className="rx-patient-val">{prescription.date}</span>
              </div>
              {prescription.vitalsAtConsult && (
                <div className="rx-patient-item" style={{ gridColumn: 'span 2' }}>
                  <span className="rx-patient-label">Recorded Vitals</span>
                  <span className="rx-patient-val" style={{ color: '#0369a1' }}>{prescription.vitalsAtConsult}</span>
                </div>
              )}
            </div>

            {/* Clinical Diagnosis */}
            <div className="rx-diagnosis-box">
              <div className="rx-diagnosis-title">Clinical Diagnosis & Findings:</div>
              <div className="rx-diagnosis-text">{prescription.diagnosis}</div>
              {prescription.symptoms && (
                <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>
                  <strong>Reported Symptoms:</strong> {prescription.symptoms}
                </div>
              )}
            </div>

            {/* Structured Medication Table */}
            <div className="rx-table-container">
              <div className="rx-symbol-row">
                <span className="rx-symbol">℞</span>
                <span className="rx-symbol-tagline">Medication Schedule & Dosage Plan</span>
              </div>

              <table className="rx-table">
                <thead>
                  <tr>
                    <th style={{ width: '38%' }}>Medicine Name & Form</th>
                    <th style={{ width: '18%' }}>Dosage</th>
                    <th style={{ width: '22%' }}>Frequency & Timing</th>
                    <th style={{ width: '22%' }}>Duration & Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescription.medicines?.map((med, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="rx-med-name">
                          {idx + 1}. {med.name} {med.strength ? `(${med.strength})` : ''}
                        </div>
                        <div className="rx-med-form">Form: {med.form || 'Tablet'}</div>
                      </td>
                      <td>
                        <strong>{med.dosage || '1 unit'}</strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{med.frequency}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{med.timing || 'After food'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0369a1' }}>{med.duration}</div>
                        {med.instructions && (
                          <div className="rx-med-instructions">"{med.instructions}"</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Advice & Lifestyle Guidance */}
            {prescription.generalAdvice && (
              <div className="rx-advice-section">
                <div className="rx-advice-title">General Advice & Precautions:</div>
                {Array.isArray(prescription.generalAdvice) ? (
                  <ul className="rx-advice-list">
                    {prescription.generalAdvice.map((adv, i) => (
                      <li key={i}>{adv}</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: '0.84rem', color: '#334155' }}>
                    {prescription.generalAdvice}
                  </div>
                )}
                {prescription.nextVisitDate && (
                  <div style={{ marginTop: '10px', fontSize: '0.84rem', fontWeight: 700, color: '#0369a1' }}>
                    📅 Recommended Follow-up / Review: {prescription.nextVisitDate}
                  </div>
                )}
              </div>
            )}

            {/* Official Signature & Verification Stamp */}
            <div className="rx-footer-block">
              <div className="rx-qr-mock">
                <div className="rx-qr-code">
                  <div className="rx-qr-pattern" />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>Digital Verification Stamp</div>
                  <div>Scan at hospital pharmacy</div>
                  <div>Ref: {prescription.rxNumber}</div>
                </div>
              </div>

              <div className="rx-signature-box">
                <div className="rx-sig-stamp">{prescription.doctorName}</div>
                <div className="rx-sig-line" />
                <div className="rx-sig-name">{prescription.doctorName}</div>
                <div className="rx-sig-sub">Attending Physician • MediCare Central</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
