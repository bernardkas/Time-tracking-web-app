import { Company, Employee, Invitation, User } from '@prisma/client';

export interface InvitationWithDetails extends Invitation {
  company: Company;
}
