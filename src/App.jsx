import React, { useState, useEffect } from 'react';
import {
  initializeStorage,
  getSession,
  getViewMode,
  setViewMode
} from './services/storage';
import DeviceToolbar from './components/common/DeviceToolbar';
import Header from './components/common/Header';
import AuthLanding from './components/auth/AuthLanding';
import DoctorPortal from './components/doctor/DoctorPortal';
import PatientPortal from './components/patient/PatientPortal';
import ToastContainer from './components/common/Toast';
import './styles/index.css';
import './styles/components.css';
import './styles/print.css';

export default function App() {
  const [session, setSessionState] = useState(() => {
    initializeStorage();
    return getSession();
  });

  const [viewMode, setViewModeState] = useState(() => {
    const saved = getViewMode();
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return 'android';
    }
    return saved || 'laptop';
  });
  const [toasts, setToasts] = useState([]);

  // Toast dispatch helper
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync auth and viewmode events
  useEffect(() => {
    const handleAuthChange = () => {
      setSessionState(getSession());
    };
    const handleViewModeChange = () => {
      setViewModeState(getViewMode());
    };

    window.addEventListener('medicare_auth_changed', handleAuthChange);
    window.addEventListener('medicare_viewmode_changed', handleViewModeChange);

    return () => {
      window.removeEventListener('medicare_auth_changed', handleAuthChange);
      window.removeEventListener('medicare_viewmode_changed', handleViewModeChange);
    };
  }, []);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setViewModeState(mode);
  };

  // Render Inner Content
  const renderContent = () => {
    if (!session) {
      return <AuthLanding onToast={addToast} />;
    }

    if (session.role === 'doctor') {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header session={session} onToast={addToast} />
          <main className="app-main-content">
            <DoctorPortal doctor={session.user} onToast={addToast} />
          </main>
        </div>
      );
    }

    if (session.role === 'patient') {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header session={session} onToast={addToast} />
          <main className="app-main-content">
            <PatientPortal patient={session.user} onToast={addToast} />
          </main>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app-root">
      {/* Device Toolbar: Allows fast switching between Laptop & Android view, plus 1-click demo personas */}
      <DeviceToolbar
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        activeSession={session}
        onToast={addToast}
      />

      {/* Simulator Mode vs Desktop View */}
      {viewMode === 'android' ? (
        <div className="simulator-container">
          <div className="android-phone-frame">
            {/* Android Status Bar */}
            <div className="android-status-bar">
              <span>10:45</span>
              <div className="android-camera-punch" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem' }}>
                <span>5G</span>
                <span>📶</span>
                <span>🔋 94%</span>
              </div>
            </div>

            {/* Android Screen Inner */}
            <div className="android-screen-content">
              {renderContent()}
            </div>
          </div>
        </div>
      ) : (
        <div className="desktop-view-container">
          {renderContent()}
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
