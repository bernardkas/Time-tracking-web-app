import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import Navbar from './components/navbar/navbar';
import { debounce } from 'lodash';
import { useActivityTracker, useUserEmployee } from './lib/hooks';

declare global {
  interface Window {
    electron: any;
    electronAPI: {
      startListening: () => void;
      stopListening: () => void;
      onActivity: (callback: (event: any) => void) => void;
    };
  }
}

const API_BASE = 'http://localhost:3000';

function App() {
  const { user, employee, error } = useUserEmployee();
  const [isOn, setIsOn] = React.useState(false);
  const [pause, setPause] = useState(false);
  const { activity, dispatch } = useActivityTracker(employee?.id, isOn);

  const handleActivityEvent = useCallback(
    (event: any) => {
      if (!isOn || pause) {
        window.electron.stopListening();
        return;
      }

      if (event._raw.includes('MOUSE') && event.state === 'DOWN') {
        dispatch({ type: 'INCREMENT_MOUSE' });
      }

      if (event._raw.includes('KEYBOARD') && event.state === 'UP') {
        dispatch({ type: 'INCREMENT_KEYBOARD' });
      }
    },
    [isOn, dispatch, pause]
  );

  const handleScreenshot = useCallback(
    async (data: string[]) => {
      if (data.length === 0) {
        console.error('No Valid Screenshot Data Found:', data);
        return;
      }

      try {
        const uploadedUrls = await Promise.all(
          data.map(async (screenshot: any) => {
            const response = await fetch(
              'http://localhost:3000/upload-screenshot',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: screenshot.image }), // Send base64
              }
            );

            const result = await response.json();
            return result.url; // S3 URL
          })
        );

        uploadedUrls.forEach(url => {
          dispatch({ type: 'ADD_SCREENSHOT', payload: url });
        });
      } catch (error) {
        console.error('Screenshot Upload Failed:', error);
      }
    },
    [dispatch]
  );

  // Electron Listeners
  useEffect(() => {
    const debouncedHandler = debounce(handleActivityEvent, 100);

    if (isOn && !pause) {
      window.electron.onActivity(debouncedHandler);
      window.electron.onScreenshot(handleScreenshot);
      window.electron.startListening();
    }

    return () => {
      window.electron.stopListening();
      debouncedHandler.cancel();
    };
  }, [isOn, pause, handleActivityEvent]);

  useEffect(() => {
    const handleScreenshot = (data: { image: string }) => {
      dispatch({ type: 'ADD_SCREENSHOT', payload: data.image });
    };

    window.electron.onScreenshot(handleScreenshot);
    return () => {
      window.electron.stopListening();
    };
  }, []);

  const toggleSwitch = useCallback(async () => {
    if (!employee?.companyId) return;

    const newStatus = !isOn;
    setPause(false);
    setIsOn(newStatus);
    let isOnline;

    if (newStatus === true) {
      isOnline = 'ONLINE';
    } else {
      isOnline = 'OFFLINE';
    }

    try {
      const res = await fetch(`${API_BASE}/employee/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ isOnline: isOnline }),
      });

      if (!res.ok) throw new Error('Status update failed');
    } catch (err) {
      setIsOn(!newStatus);
      console.error('Toggle failed:', err);
    }
  }, [employee, isOn]);

  const companyStatus = useMemo(
    () => ({
      message: employee?.companyId
        ? `Connected to ${employee.company_name}`
        : 'Connect with a company',
      opacity: 0.6,
    }),
    [employee]
  );

  const togglePause = async () => {
    const newPauseState = !pause;
    console.log('newPauseState', newPauseState);
    setPause(newPauseState); // Toggle pause state

    let isOnline;

    if (newPauseState) {
      isOnline = 'PAUSED';
    } else {
      isOnline = 'ONLINE';
    }

    try {
      const res = await fetch(`${API_BASE}/employee/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ isOnline: isOnline }),
      });

      if (!res.ok) throw new Error('Pause toggle failed');
    } catch (err) {
      console.error('Pause/Resume toggle failed:', err);
      setPause(!newPauseState); // Revert pause state on failure
      setIsOn(!newPauseState); // Revert switch state on failure
    }
  };

  return (
    <div className='app'>
      <Navbar />
      <div className='container'>
        <div className='header'>
          {user && <div className='user'>Welcome, {user.name}</div>}
          <p style={companyStatus}>{companyStatus.message}</p>
        </div>
        <div className='content'>
          <h2>Start tracking</h2>
          <div className={`switch ${isOn ? 'on' : ''}`} onClick={toggleSwitch}>
            <div className='switch-knob' />
          </div>
          {error && <p className='error'>{error}</p>}
          {!user && <p className='error'>Please login to start tracking</p>}
          <p>Tracking {isOn ? 'Active' : 'Inactive'}</p>
          {isOn && (
            <button
              className={`pause-button ${pause ? 'paused' : ''}`}
              onClick={togglePause}>
              {pause ? 'Resume' : 'Pause'}
            </button>
          )}
        </div>

        <div className='info'>
          <p className='info-text'>
            <span className='info-span'>Note:</span> When you start this app, it
            will monitor your keyboard and mouse activity to help track your
            time and capture screenshots. Only the company you're connected to
            will have access to this information. If you'd like to stop
            tracking, you can click{' '}
            <span className='text-exit'>Switch Off</span> or{' '}
            <span className='text-exit'>Exit</span> at any time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
