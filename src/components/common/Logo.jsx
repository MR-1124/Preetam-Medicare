import React from 'react';

export default function Logo({ size = 'md', variant = 'color', showTagline = true, className = '' }) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';
  const iconSize = isSmall ? 28 : isLarge ? 48 : 38;

  return (
    <div className={`medicare-logo ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: isSmall ? '8px' : '12px', userSelect: 'none' }}>
      <div
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: isSmall ? '8px' : isLarge ? '14px' : '11px',
          background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
          flexShrink: 0
        }}
      >
        <svg
          width={iconSize * 0.65}
          height={iconSize * 0.65}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Medical Cross Body */}
          <rect x="9" y="3" width="6" height="18" rx="2" fill="white" />
          <rect x="3" y="9" width="18" height="6" rx="2" fill="white" />
          {/* ECG Pulse Line through center */}
          <path
            d="M4 12H8L10 8L14 16L16 12H20"
            stroke="#0284c7"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Care Node Indicator */}
          <circle cx="12" cy="12" r="1.8" fill="#0d9488" />
        </svg>
      </div>
      <div>
        <div
          style={{
            fontSize: isSmall ? '1.05rem' : isLarge ? '1.55rem' : '1.25rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            color: variant === 'white' ? '#ffffff' : '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <span>MediCare</span>
          <span style={{ color: '#0284c7' }}>Connect</span>
        </div>
        {showTagline && (
          <div
            style={{
              fontSize: isSmall ? '0.65rem' : isLarge ? '0.82rem' : '0.72rem',
              fontWeight: 600,
              color: variant === 'white' ? '#cbd5e1' : '#64748b',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginTop: '2px'
            }}
          >
            Clinical Healthcare Portal
          </div>
        )}
      </div>
    </div>
  );
}
