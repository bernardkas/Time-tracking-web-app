import { z } from 'zod';

export const SetupSchema = z.object({
  uuid: z.string().optional(),
  name: z.string().optional(),
  emoloyeeName: z.string().optional(),
  role: z.enum(['COMPANY', 'EMPLOYEE']),
  password: z
    .string()
    .min(1, {
      message: 'Password is required',
    })
    .min(6, 'Password must be more than 6 characters'),
});
