import { profile } from 'console';
import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});
export const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z
    .string()
    .min(1, {
      message: 'Password is required',
    })
    .min(6, 'Password must be more than 6 characters'),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});
export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(1, {
      message: 'Password is required',
    })
    .min(6, 'Password must be more than 6 characters'),
});

export const SettingSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    role: z.enum(['COMPANY', 'EMPLOYEE']),
    companyName: z.string().optional(),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    data => {
      if (data.password && !data.newPassword) {
        return false;
      }

      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: 'New password is required!',
      path: ['newPassword'],
    }
  );
