import React, { useState } from 'react';
import {
  FileCheck2,
  FileText,
  Printer,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Microscope,
  Calendar,
  X
} from 'lucide-react';
import { getLabReportsByPatient, createLabReport } from '../../services/storage';

export default function LabReportsHub({ patient, isDoctor = false, doctor = null, onToast }) {
  const [reports, setReports] = useState(() => getLabReportsByPatient(patient.id));
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New report form state (for doctor)
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Biochemistry');
  const [newDepartment, setNewDepartment] = useState('Clinical Biochemistry');
  const [newSummary, setNewSummary] = useState('');
  const [parameters, setParameters] = useState([
    { name: '', result: '', unit: '', refRange: '', status: 'Normal' }
  ]);

  const filteredReports = reports.filter((r) => {
    if (filterCategory === 'All') return true;
    return r.category === filterCategory;
  });

  const handleAddParam = () => {
    setParameters([
      ...parameters,
      { name: '', result: '', unit: '', refRange: '', status: 'Normal' }
    ]);
  };

  const handleParamChange = (index, field, value) => {
    const updated = [...parameters];
    updated[index][field] = value;
    setParameters(updated);
  };

  const handleCreateReport = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onToast('Please provide a test title', 'warning');
      return;
    }

    const validParams = parameters.filter((p) => p.name.trim().length > 0);
    const report = createLabReport({
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor?.id || 'doc-1',
      doctorName: doctor?.name || 'Dr. Preetam Sen',
      department: newDepartment,
      testTitle: newTitle.trim(),
      category: newCategory,
      summary: newSummary.trim() || 'All recorded test indices reviewed and clinically documented.',
      parameters: validParams.length > 0 ? validParams : [
        { name: newTitle.trim(), result: 'Normal', unit: '--', refRange: 'Within biological limits', status: 'Normal' }
      ],
      pathologist: 'Dr. Amitabha Das, MD (Pathology)'
    });

    setReports(getLabReportsByPatient(patient.id));
    setShowAddModal(false);
    onToast(`Diagnostic report created: ${report.testTitle}`, 'success');
  };

  return (
    <div className="lab-reports-hub">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Microscope size={22} color="var(--primary)" />
            <span>Diagnostic Pathology & Radiology Reports</span>
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Verified hospital lab tests with reference ranges, abnormal indices, and printable slips
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-surface-alt)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
            {['All', 'Pathology', 'Biochemistry', 'Radiology'].map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${filterCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {isDoctor && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
              <Plus size={15} />
              <span>Record New Lab Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Report Cards List */}
      {filteredReports.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No diagnostic reports found in this category for {patient.name}.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredReports.map((report) => {
            const hasAbnormal = report.parameters?.some(
              (p) => p.status === 'Elevated' || p.status === 'Low'
            );

            return (
              <div key={report.id} className="card">
                <div className="card-header" style={{ background: 'var(--bg-surface-alt)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                        {report.testTitle}
                      </h3>
                      <span className="badge badge-neutral">{report.category}</span>
                      {hasAbnormal ? (
                        <span className="badge badge-warning">Review Flagged</span>
                      ) : (
                        <span className="badge badge-success">Normal Range</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                      Sample Ref: <strong>{report.reportNumber}</strong> • Date: {report.date} • Dept: {report.department}
                    </div>
                  </div>

                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setSelectedReport(report)}
                    title="View and print official pathology sheet"
                  >
                    <Printer size={14} />
                    <span>View Official Report</span>
                  </button>
                </div>

                <div className="card-body">
                  {/* Summary note */}
                  {report.summary && (
                    <div
                      style={{
                        fontSize: '0.84rem',
                        color: 'var(--text-body)',
                        marginBottom: '14px',
                        padding: '10px 14px',
                        background: '#f8fafc',
                        borderRadius: 'var(--radius-sm)',
                        borderLeft: '3px solid var(--primary)'
                      }}
                    >
                      <strong>Clinical Summary:</strong> {report.summary}
                    </div>
                  )}

                  {/* Parameters Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-surface-alt)', borderBottom: '1.5px solid var(--border-color)', textAlign: 'left' }}>
                        <th style={{ padding: '8px 12px' }}>Test Parameter</th>
                        <th style={{ padding: '8px 12px' }}>Result</th>
                        <th style={{ padding: '8px 12px' }}>Unit</th>
                        <th style={{ padding: '8px 12px' }}>Biological Reference Interval</th>
                        <th style={{ padding: '8px 12px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.parameters?.map((p, pIdx) => {
                        const isAbnormal = p.status === 'Elevated' || p.status === 'Low';
                        return (
                          <tr key={pIdx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-main)' }}>
                              {p.name}
                            </td>
                            <td style={{ padding: '10px 12px', fontWeight: 700, color: isAbnormal ? 'var(--danger)' : 'var(--text-main)' }}>
                              {p.result}
                            </td>
                            <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>
                              {p.unit}
                            </td>
                            <td style={{ padding: '10px 12px', color: 'var(--text-body)' }}>
                              {p.refRange}
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <span
                                className={`badge ${
                                  p.status === 'Normal'
                                    ? 'badge-success'
                                    : p.status === 'Elevated'
                                    ? 'badge-danger'
                                    : 'badge-warning'
                                }`}
                                style={{ fontSize: '0.68rem' }}
                              >
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Official Lab Report Print Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
            <div className="modal-header no-print">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Microscope size={20} color="var(--primary)" />
                <span style={{ fontWeight: 800 }}>MediCare Central Diagnostic Laboratory</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={15} />
                  <span>Print Report Slip</span>
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelectedReport(null)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="modal-body" style={{ padding: '28px', background: '#ffffff' }}>
              {/* Lab Header */}
              <div style={{ borderBottom: '2.5px solid #0284c7', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0369a1', margin: 0 }}>
                      MediCare Central Super Specialty Hospital
                    </h2>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      Department of Laboratory Medicine & Diagnostics • NABL Accredited Lab: MC-DL-2024-991
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.74rem', color: '#64748b' }}>
                    <div>Report Ref: <strong>{selectedReport.reportNumber}</strong></div>
                    <div>Collection Date: {selectedReport.date}</div>
                  </div>
                </div>
              </div>

              {/* Patient Meta Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  background: '#f8fafc',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.82rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Patient Name</div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{selectedReport.patientName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>UHID</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>{patient.idNumber}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Referring Consultant</div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{selectedReport.doctorName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Test Discipline</div>
                  <div style={{ fontWeight: 700, color: '#0284c7' }}>{selectedReport.department}</div>
                </div>
              </div>

              {/* Investigation Title */}
              <div style={{ background: '#f0f9ff', padding: '10px 14px', borderLeft: '4px solid #0284c7', marginBottom: '20px' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Investigation: {selectedReport.testTitle}
                </div>
              </div>

              {/* Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '24px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderTop: '1px solid #cbd5e1', borderBottom: '2px solid #94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px' }}>Parameter Analyzed</th>
                    <th style={{ padding: '10px 12px' }}>Observed Result</th>
                    <th style={{ padding: '10px 12px' }}>Unit</th>
                    <th style={{ padding: '10px 12px' }}>Biological Reference Interval</th>
                    <th style={{ padding: '10px 12px' }}>Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReport.parameters?.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 800, color: p.status !== 'Normal' ? '#dc2626' : '#0f172a' }}>
                        {p.result}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#64748b' }}>{p.unit}</td>
                      <td style={{ padding: '10px 12px', color: '#334155' }}>{p.refRange}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontWeight: 700, color: p.status === 'Normal' ? '#059669' : '#dc2626' }}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Impressions */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '24px', fontSize: '0.84rem' }}>
                <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Pathological Impression:</div>
                <div style={{ color: '#334155', lineHeight: 1.5 }}>{selectedReport.summary}</div>
              </div>

              {/* Lab Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  <div>Electronic Report Generated via MediCare LIS v2.4</div>
                  <div>Report verified with automated delta checks</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontStyle: 'italic', fontWeight: 700, color: '#0369a1' }}>{selectedReport.pathologist}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Senior Consultant Pathologist</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Lab Report Modal (Doctor) */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Record Diagnostic Lab Report</h3>
              <button onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleCreateReport}>
                <div className="form-group">
                  <label className="form-label">Investigation / Test Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Glycated Hemoglobin (HbA1c) / Renal Panel"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                      <option value="Pathology">Pathology (Hematology)</option>
                      <option value="Biochemistry">Biochemistry</option>
                      <option value="Radiology">Radiology & Imaging</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lab Department</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                    />
                  </div>
                </div>

                {/* Parameters */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>Test Parameters & Readings</span>
                    <button type="button" className="btn btn-outline btn-sm" onClick={handleAddParam}>
                      + Add Parameter
                    </button>
                  </div>

                  {parameters.map((p, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name (e.g. Hb)"
                        value={p.name}
                        onChange={(e) => handleParamChange(i, 'name', e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Result"
                        value={p.result}
                        onChange={(e) => handleParamChange(i, 'result', e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Unit"
                        value={p.unit}
                        onChange={(e) => handleParamChange(i, 'unit', e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ref Range"
                        value={p.refRange}
                        onChange={(e) => handleParamChange(i, 'refRange', e.target.value)}
                      />
                      <select
                        className="form-select"
                        value={p.status}
                        onChange={(e) => handleParamChange(i, 'status', e.target.value)}
                      >
                        <option value="Normal">Normal</option>
                        <option value="Elevated">Elevated</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label className="form-label">Clinical Impression / Pathologist Summary</label>
                  <textarea
                    className="form-textarea"
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    placeholder="Summary of findings and clinical significance..."
                    rows={2}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <CheckCircle2 size={16} />
                    <span>Save Lab Report</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
