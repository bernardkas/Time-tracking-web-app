import { ActivityLog, Company, Employee, User } from '@prisma/client';

export interface EmployeeWithDetails extends Employee {
  company: Company;
  user: User;
  activityLogs: ActivityLog[];
}
