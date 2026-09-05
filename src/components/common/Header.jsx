import React from 'react';
import { LogOut, Stethoscope, User, Bell } from 'lucide-react';
import Logo from './Logo';
import { clearSession } from '../../services/storage';

export default function Header({ session, onToast, onOpenProfile }) {
  const isDoctor = session?.role === 'doctor';
  const user = session?.user;

  const handleLogout = () => {
    clearSession();
    onToast('Signed out successfully', 'info');
  };

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Logo size="sm" showTagline={false} />
        <div style={{ height: '24px', width: '1px', background: 'var(--border-color)', display: 'inline-block' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
          <span style={{ fontWeight: 600 }}>MediCare Central</span>
          <span style={{ opacity: 0.6 }}>• OPD Live</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* User Badge */}
        <div
          onClick={onOpenProfile}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '5px 10px',
            background: 'var(--bg-surface-alt)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer'
          }}
          title="Click to view profile"
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100'}
            alt={user?.name || 'User'}
            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
              {user?.name}
            </span>
            <span style={{ fontSize: '0.68rem', color: isDoctor ? 'var(--primary)' : 'var(--secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              {isDoctor ? 'Doctor / Specialist' : 'Patient'}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleLogout}
          title="Sign out of current account"
          style={{ padding: '6px 10px', color: 'var(--danger)' }}
        >
          <LogOut size={16} />
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Exit</span>
        </button>
      </div>
    </header>
  );
}
