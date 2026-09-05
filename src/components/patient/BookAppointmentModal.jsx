import React, { useState } from 'react';
import { Calendar, Clock, Stethoscope, User, CheckCircle2, X } from 'lucide-react';
import { getDoctors, createAppointment } from '../../services/storage';

export default function BookAppointmentModal({ patient, initialDoctorId, onClose, onToast, onAppointmentBooked }) {
  const doctors = getDoctors();
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorId || doctors[0]?.id || '');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:30 AM');
  const [type, setType] = useState('Follow-up Consultation');
  const [reason, setReason] = useState('');

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const handleBook = (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      onToast('Please mention the main reason for your visit', 'warning');
      return;
    }

    const newAppt = createAppointment({
      patientId: patient.id,
      patientName: patient.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      date: appointmentDate,
      time: timeSlot,
      type: type,
      reason: reason.trim(),
      notes: `Booked via Patient Portal. Fee: ${selectedDoctor.fee}`
    });

    onToast(`Appointment confirmed with ${selectedDoctor.name} on ${appointmentDate}!`, 'success');
    if (onAppointmentBooked) onAppointmentBooked(newAppt);
    onClose();
  };

  const timeSlots = [
    '09:30 AM',
    '10:30 AM',
    '11:15 AM',
    '12:00 PM',
    '02:30 PM',
    '03:45 PM',
    '04:30 PM'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'var(--secondary-light)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Schedule Doctor Appointment
              </h3>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                MediCare Central Super Specialty OPD
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleBook}>
            {/* Doctor Selection */}
            <div className="form-group">
              <label className="form-label">Select Consulting Specialist</label>
              <select
                className="form-select"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                required
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} - {doc.specialty} ({doc.fee})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Doctor Summary Card */}
            {selectedDoctor && (
              <div
                style={{
                  background: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <img
                  src={selectedDoctor.avatar}
                  alt={selectedDoctor.name}
                  style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.94rem' }}>
                    {selectedDoctor.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {selectedDoctor.title} • {selectedDoctor.specialty}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Chamber: {selectedDoctor.chamber} • Visiting: {selectedDoctor.visitingHours}
                  </div>
                </div>
              </div>
            )}

            {/* Date and Time Slot */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Preferred Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Available Time Slot</label>
                <select
                  className="form-select"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Consultation Category</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Follow-up Consultation">Follow-up Consultation</option>
                <option value="Regular Checkup">Routine Physical Checkup</option>
                <option value="Specialist Review">Specialist Diagnostic Review</option>
                <option value="Emergency Review">Symptom Flare-up / Urgent Review</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Symptoms or Reason for Consultation</label>
              <textarea
                className="form-textarea"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe current symptoms, duration, or previous medication status..."
                rows={3}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-secondary btn-lg">
                <CheckCircle2 size={18} />
                <span>Confirm & Reserve Appointment</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
