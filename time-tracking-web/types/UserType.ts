import { Company, Employee, Subscription, User } from '@prisma/client';

export interface UserWithDetails extends User {
  company: Company;
  employee: Employee;
  subscriptions: Subscription[];
}
