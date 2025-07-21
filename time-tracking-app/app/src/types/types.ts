export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Employee {
  id: string;
  name: string;
  companyId?: string;
  companyName?: string;
  isOnline: boolean;
}

export interface Activity {
  mouseClicks: number;
  keyboardClicks: number;
  screenTime: number;
  screenshot: string | null;
}

export interface ActivityLog {
  id: string;
  createdAt: string;
  employeeId: string;
  mouseClicks: number;
  keyboardClicks: number;
  screenTime: number;
  screenshot: string | null;
}
