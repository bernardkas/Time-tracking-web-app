import { z } from 'zod';

export const InvitationSchema = z.object({
  uuid: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().min(1, 'Email is required'),
});
