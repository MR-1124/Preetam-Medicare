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
      <div className="header-brand">
        <Logo size="sm" showTagline={false} />
        <div className="header-divider" />
        <div className="header-hospital-badge">
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
          <span style={{ fontWeight: 600 }}>MediCare Central</span>
          <span style={{ opacity: 0.6 }}>• OPD Live</span>
        </div>
      </div>

      <div className="header-actions">
        {/* User Badge */}
        <div
          className="header-user-badge"
          onClick={onOpenProfile}
          title="Click to view profile"
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100'}
            alt={user?.name || 'User'}
            className="header-user-avatar"
          />
          <div className="header-user-info">
            <span className="header-user-name">
              {user?.name}
            </span>
            <span
              className="header-user-role"
              style={{ color: isDoctor ? 'var(--primary)' : 'var(--secondary)' }}
            >
              {isDoctor ? 'Doctor' : 'Patient'}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          className="header-exit-btn"
          onClick={handleLogout}
          title="Sign out of current account"
        >
          <LogOut size={16} />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
}
