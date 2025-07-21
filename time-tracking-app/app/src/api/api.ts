import { ActivityLog, Employee, User } from '../types/types';

const API_BASE = 'http://localhost:3000';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    const response = await fetch(`${API_BASE}/user`, {
      headers: getAuthHeader(),
    });
    return handleResponse<User>(response);
  },
};

export const employeeService = {
  getCurrentEmployee: async (): Promise<Employee> => {
    const response = await fetch(`${API_BASE}/employee`, {
      headers: getAuthHeader(),
    });
    const data = await handleResponse<Employee[]>(response);
    return data[0];
  },

  updateOnlineStatus: async (
    id: string,
    isOnline: boolean
  ): Promise<Employee> => {
    const response = await fetch(`${API_BASE}/employee/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isOnline }),
    });
    return handleResponse<Employee>(response);
  },
};

export const activityService = {
  createLog: async (log: Partial<ActivityLog>): Promise<ActivityLog> => {
    const response = await fetch(`${API_BASE}/activity`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(log),
    });
    return handleResponse<ActivityLog>(response);
  },

  updateLog: async (
    id: string,
    updates: Partial<ActivityLog>
  ): Promise<ActivityLog> => {
    const response = await fetch(`${API_BASE}/activity/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return handleResponse<ActivityLog>(response);
  },

  getTodaysLog: async (employeeId: string): Promise<ActivityLog | null> => {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `${API_BASE}/activity?employeeId=${employeeId}&createdAt=${today}`,
      { headers: getAuthHeader() }
    );
    const logs = await handleResponse<ActivityLog[]>(response);
    return logs[0] || null;
  },
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
};
