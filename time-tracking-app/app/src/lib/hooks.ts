import { debounce } from 'lodash';
import React, { useCallback, useEffect, useReducer, useRef } from 'react';

interface ActivityState {
  mouseClicks: number;
  keyboardClicks: number;
  screenTime: number;
  screenshots: string[];
}

type ActivityAction =
  | { type: 'INCREMENT_MOUSE' }
  | { type: 'INCREMENT_KEYBOARD' }
  | { type: 'INCREMENT_SCREEN_TIME' }
  | { type: 'RESET' }
  | { type: 'ADD_SCREENSHOT'; payload: string }
  | { type: 'SET_FROM_API'; payload: Partial<ActivityState> };

const API_BASE = 'http://localhost:3000';

// Custom Hooks
export const useUserEmployee = () => {
  const [user, setUser] = React.useState<any>(null);
  const [employee, setEmployee] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const [userRes, employeeRes] = await Promise.all([
          fetch(`${API_BASE}/user`, { headers: { Authorization: token } }),
          fetch(`${API_BASE}/employee`, { headers: { Authorization: token } }),
        ]);

        const userData = await userRes.json();
        const employeeData = await employeeRes.json();

        if (userData.id) setUser(userData);
        if (employeeData.id) setEmployee(employeeData);
        if (!employeeData.companyId)
          setError('You need to connect with a company');
      } catch (err) {
        setError('Failed to fetch user data');
      }
    };

    fetchData();
  }, []);

  return { user, employee, error };
};

export const activityReducer = (
  state: ActivityState,
  action: ActivityAction
): ActivityState => {
  switch (action.type) {
    case 'INCREMENT_MOUSE':
      return { ...state, mouseClicks: state.mouseClicks + 1 };
    case 'INCREMENT_KEYBOARD':
      return { ...state, keyboardClicks: state.keyboardClicks + 1 };
    case 'INCREMENT_SCREEN_TIME':
      return { ...state, screenTime: state.screenTime + 1 };
    case 'RESET':
      return {
        mouseClicks: 0,
        keyboardClicks: 0,
        screenTime: 0,
        screenshots: [],
      };
    case 'SET_FROM_API':
      return { ...state, ...action.payload };
    case 'ADD_SCREENSHOT':
      return {
        ...state,
        screenshots: [...state.screenshots, action.payload].filter(Boolean),
      };
    default:
      return state;
  }
};

export const useActivityTracker = (
  employeeId: string | undefined,
  isOn: boolean
) => {
  const [activity, dispatch] = useReducer(activityReducer, {
    mouseClicks: 0,
    keyboardClicks: 0,
    screenTime: 0,
    screenshots: [],
  });

  const activityRef = useRef(activity);
  activityRef.current = activity;

  useEffect(() => {
    if (!employeeId) return;

    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const date = new Date().toISOString().split('T')[0];
        const res = await fetch(
          `${API_BASE}/activity?employeeId=${employeeId}&date=${date}`,
          {
            headers: { Authorization: token },
          }
        );

        if (!res.ok) throw new Error('Failed to fetch activity');

        const data = await res.json();

        let logDate = data[0]
          ? new Date(data[0].createdAt).toISOString().split('T')[0]
          : null;
        const currentDate = new Date().toISOString().split('T')[0];

        console.log('logDate in useEffect', logDate);
        console.log('currentDate in useEffect', currentDate);
        if (data.length > 0 && logDate === currentDate) {
          const activityData = data[0];

          dispatch({
            type: 'SET_FROM_API',
            payload: {
              mouseClicks: activityData.mouseClicks || 0,
              keyboardClicks: activityData.keyboardClicks || 0,
              screenTime: activityData.screenTime || 0,
              screenshots: activityData.screenshots || [],
            },
          });
        }
      } catch (error) {
        console.error('Error fetching activity:', error);
      }
    };

    fetchActivity();
  }, [employeeId]);

  const updateActivityLog = useCallback(
    debounce(async () => {
      if (!employeeId || !isOn) return;

      const token = localStorage.getItem('authToken');
      if (!token) return;

      const currentDate = new Date().toISOString().split('T')[0];
      const { mouseClicks, keyboardClicks, screenTime, screenshots } =
        activityRef.current;

      try {
        const res = await fetch(
          `${API_BASE}/activity?employeeId=${employeeId}`,
          { headers: { Authorization: token } }
        );

        if (!res) return;

        const existingLogs = await res.json();
        const currentLog = existingLogs.find((log: any) => {
          const logDate = new Date(log.createdAt).toISOString().split('T')[0];
          return logDate === currentDate;
        });
        const currentId = currentLog?.id;

        console.log('currentLog', currentLog);

        let logDate = currentLog
          ? new Date(currentLog.createdAt).toISOString().split('T')[0]
          : null;

        console.log('logDate', logDate);
        console.log('currentDate', currentDate);

        if (currentLog) {
          await fetch(`${API_BASE}/activity/${currentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({
              mouseClicks,
              keyboardClicks,
              screenTime,
              screenshots,
            }),
          });
        } else {
          const activityData = {
            employeeId,
            mouseClicks: 0,
            keyboardClicks: 0,
            screenTime: 0,
            screenshots: [],
          };

          const response = await fetch(`${API_BASE}/activity`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify(activityData),
          });

          const result = await response.json().catch(() => null);
          console.log('Server Response:', response.status, result);
        }
      } catch (err) {
        console.error('Activity sync failed:', err);
      }
    }, 100),
    [employeeId, isOn]
  );

  useEffect(() => {
    if (!isOn) return;

    const screenTimer = setInterval(
      () => dispatch({ type: 'INCREMENT_SCREEN_TIME' }),
      60000
    );

    return () => clearInterval(screenTimer);
  }, [isOn]);

  useEffect(() => {
    if (isOn) updateActivityLog();
  }, [activity, isOn, updateActivityLog]);

  return { activity, dispatch };
};
