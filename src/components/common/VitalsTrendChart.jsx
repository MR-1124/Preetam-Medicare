import React, { useState } from 'react';
import { Activity, Heart, TrendingDown, TrendingUp, Info } from 'lucide-react';

export default function VitalsTrendChart({ vitalsHistory = [], patientName = 'Patient' }) {
  const [metric, setMetric] = useState('bp'); // 'bp' | 'hr' | 'glucose'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!vitalsHistory || vitalsHistory.length === 0) {
    return (
      <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No historical vitals records available for trending.
      </div>
    );
  }

  // Chart dimensions
  const width = 640;
  const height = 240;
  const padding = { top: 30, right: 30, bottom: 40, left: 45 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Data ranges & computations based on selected metric
  let yMin, yMax, unit, title;

  if (metric === 'bp') {
    yMin = 50;
    yMax = 160;
    unit = 'mmHg';
    title = 'Blood Pressure Trajectory (Systolic / Diastolic)';
  } else if (metric === 'hr') {
    yMin = 50;
    yMax = 110;
    unit = 'bpm';
    title = 'Resting Heart Rate (Pulse)';
  } else {
    yMin = 70;
    yMax = 180;
    unit = 'mg/dL';
    title = 'Fasting Blood Glucose Trajectory';
  }

  const getX = (index) => padding.left + (index / (vitalsHistory.length - 1)) * innerWidth;
  const getY = (val) => padding.top + innerHeight - ((val - yMin) / (yMax - yMin)) * innerHeight;

  // Generate SVG path strings
  const getLinePath = (getValue) => {
    return vitalsHistory
      .map((d, i) => {
        const x = getX(i);
        const y = getY(getValue(d));
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  const systolicPath = metric === 'bp' ? getLinePath((d) => d.systolic) : '';
  const diastolicPath = metric === 'bp' ? getLinePath((d) => d.diastolic) : '';
  const singlePath =
    metric === 'hr'
      ? getLinePath((d) => d.heartRate)
      : metric === 'glucose'
      ? getLinePath((d) => d.glucose)
      : '';

  // Trend analysis summary
  const first = vitalsHistory[0];
  const last = vitalsHistory[vitalsHistory.length - 1];
  let deltaText = '';
  let isImproved = false;

  if (metric === 'bp' && first && last) {
    const diff = last.systolic - first.systolic;
    deltaText = diff < 0 ? `${Math.abs(diff)} mmHg reduction in systolic BP` : `${diff} mmHg change`;
    isImproved = diff <= 0;
  } else if (metric === 'glucose' && first && last) {
    const diff = last.glucose - first.glucose;
    deltaText = diff < 0 ? `${Math.abs(diff)} mg/dL decrease in fasting glucose` : `${diff} mg/dL change`;
    isImproved = diff <= 0;
  } else if (metric === 'hr' && first && last) {
    deltaText = `Stable average around ${last.heartRate} bpm`;
    isImproved = true;
  }

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 className="card-title">
            <Activity size={18} color="var(--primary)" />
            <span>6-Month Clinical Vitals Trends</span>
          </h3>
          <div className="card-subtitle">{title}</div>
        </div>

        {/* Metric Selector Buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className={`btn btn-sm ${metric === 'bp' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMetric('bp')}
          >
            Blood Pressure
          </button>
          <button
            className={`btn btn-sm ${metric === 'hr' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMetric('hr')}
          >
            Heart Rate
          </button>
          <button
            className={`btn btn-sm ${metric === 'glucose' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMetric('glucose')}
          >
            Blood Glucose
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Trend Summary Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'var(--bg-surface-alt)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '16px',
            fontSize: '0.84rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isImproved ? (
              <TrendingDown size={18} color="var(--success)" />
            ) : (
              <TrendingUp size={18} color="var(--warning)" />
            )}
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Clinical Trajectory:</span>
            <span style={{ color: 'var(--text-body)' }}>{deltaText}</span>
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Recorded over {vitalsHistory.length} clinic consultations
          </div>
        </div>

        {/* Responsive SVG Chart */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', height: 'auto', minWidth: '460px', display: 'block' }}
          >
            {/* Background Normal Reference Corridor for BP (Systolic 90-120, Diastolic 60-80) */}
            {metric === 'bp' && (
              <>
                <rect
                  x={padding.left}
                  y={getY(120)}
                  width={innerWidth}
                  height={getY(90) - getY(120)}
                  fill="rgba(16, 185, 129, 0.08)"
                />
                <rect
                  x={padding.left}
                  y={getY(80)}
                  width={innerWidth}
                  height={getY(60) - getY(80)}
                  fill="rgba(14, 165, 233, 0.08)"
                />
              </>
            )}

            {/* Grid horizontal guidelines */}
            {[yMin, (yMin + yMax) / 2, yMax].map((val, idx) => {
              const y = getY(val);
              return (
                <g key={idx}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="var(--border-color)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="var(--text-muted)"
                    fontFamily="var(--font-main)"
                  >
                    {Math.round(val)}
                  </text>
                </g>
              );
            })}

            {/* X Axis Dates */}
            {vitalsHistory.map((d, i) => {
              const x = getX(i);
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1={height - padding.bottom}
                    x2={x}
                    y2={height - padding.bottom + 5}
                    stroke="var(--slate-300)"
                  />
                  <text
                    x={x}
                    y={height - padding.bottom + 18}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--text-muted)"
                    fontFamily="var(--font-main)"
                  >
                    {d.date.slice(5)}
                  </text>
                </g>
              );
            })}

            {/* BP Metric Lines */}
            {metric === 'bp' && (
              <>
                {/* Systolic Line (Red/Primary Dark) */}
                <path
                  d={systolicPath}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Diastolic Line (Blue/Primary) */}
                <path
                  d={diastolicPath}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {vitalsHistory.map((d, i) => (
                  <g
                    key={i}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={getX(i)}
                      cy={getY(d.systolic)}
                      r={hoveredIndex === i ? 6 : 4}
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <circle
                      cx={getX(i)}
                      cy={getY(d.diastolic)}
                      r={hoveredIndex === i ? 6 : 4}
                      fill="#0284c7"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                ))}
              </>
            )}

            {/* Single Metric Line (HR or Glucose) */}
            {metric !== 'bp' && (
              <>
                <path
                  d={singlePath}
                  fill="none"
                  stroke={metric === 'hr' ? '#0d9488' : '#f59e0b'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {vitalsHistory.map((d, i) => {
                  const val = metric === 'hr' ? d.heartRate : d.glucose;
                  return (
                    <circle
                      key={i}
                      cx={getX(i)}
                      cy={getY(val)}
                      r={hoveredIndex === i ? 6 : 4}
                      fill={metric === 'hr' ? '#0d9488' : '#f59e0b'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{ cursor: 'pointer' }}
                    />
                  );
                })}
              </>
            )}
          </svg>
        </div>

        {/* Chart Legend */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '12px', fontSize: '0.8rem' }}>
          {metric === 'bp' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 12, height: 3, background: '#ef4444', display: 'inline-block' }} />
                <span>Systolic (Target &lt; 120)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 12, height: 3, background: '#0284c7', display: 'inline-block' }} />
                <span>Diastolic (Target &lt; 80)</span>
              </div>
            </>
          ) : metric === 'hr' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 12, height: 3, background: '#0d9488', display: 'inline-block' }} />
              <span>Resting Heart Rate (bpm)</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 12, height: 3, background: '#f59e0b', display: 'inline-block' }} />
              <span>Fasting Blood Glucose (mg/dL)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
