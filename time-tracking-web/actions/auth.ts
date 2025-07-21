'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/db/db';
import { signIn, signOut } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from '@/lib/tokens';
import { getUserByEmail, getUserById } from '@/data/user';
import { sendPasswordEmail, sendVerificationEmail } from '@/lib/mail';
import { getVerificationTokenByToke } from '@/data/verificationToken';
import { getPasswordResetByToken } from '@/data/password-reset-token';
import { currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import {
  LoginSchema,
  NewPasswordSchema,
  RegisterSchema,
  ResetPasswordSchema,
  SettingSchema,
} from '@/schemas';
import { UserRole } from '@prisma/client';

// ! Don't touch anything here

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validetedFields = RegisterSchema.safeParse(values);

  if (!validetedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { name, email, password } = values;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'User already exist!' };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'Confirmation email sent!' };
};
export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validetedFields = LoginSchema.safeParse(values);

  if (!validetedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { email, password } = values;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist!' };
  }

  const isPasswordMatch = await bcrypt.compare(
    String(password),
    existingUser.password
  );

  if (!isPasswordMatch) {
    return { error: 'Password is wrong!' };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: 'Confirmation email send' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid Credentials' };
        default:
          return { error: 'Something went wrong!' };
      }
    }
    throw error;
  }

  revalidatePath('/');
};

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToke(token);

  if (!existingToken) {
    return { error: 'Token does not exist!' };
  }
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'Token has expired!' };
  }

  const exisitingUser = await getUserByEmail(existingToken.email);

  if (!exisitingUser) {
    return { error: 'Email does not exist!' };
  }

  await prisma.user.update({
    where: {
      id: exisitingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: 'Email verified!' };
};

export const reset = async (values: z.infer<typeof ResetPasswordSchema>) => {
  const validetedFields = ResetPasswordSchema.safeParse(values);

  if (!validetedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { email } = values;

  const exisitingUser = await getUserByEmail(email);

  if (!exisitingUser) {
    return { error: 'Email not found!' };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordEmail(passwordResetToken.email, passwordResetToken.token);

  return { success: 'Reset email sent!' };
};

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  const validetedFields = NewPasswordSchema.safeParse(values);

  if (!validetedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { password } = values;

  // @ts-ignore
  const existingToken = await getPasswordResetByToken(token);
  if (!existingToken) {
    return { error: 'Token does not exist!' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: 'Token has expired!' };
  }

  const exisitingUser = await getUserByEmail(existingToken.email);

  if (!exisitingUser) {
    return { error: 'Email does not exist!' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: exisitingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: 'Password updated!!' };
};

export const logout = async () => {
  await signOut({
    redirectTo: '/auth/sign-in',
  });

  revalidatePath('/');
};

export const settings = async (values: z.infer<typeof SettingSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const dbUser = await getUserById(user?.id);

  if (!dbUser) {
    return { error: 'Unauthorized' };
  }

  const validetedFields = SettingSchema.safeParse(values);

  if (!validetedFields.success) {
    return { error: 'Invalid fields' };
  }

  if (user?.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email already in use!' };
    }

    const verificationToken = await generateVerificationToken(values.email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: 'Verification email sent!' };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return { error: 'Incorrect password!' };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  const respond = await prisma.user.update({
    where: {
      id: dbUser?.id,
    },
    data: {
      name: values.name,
      email: values.email,
      password: values.newPassword,
      role: values.role,
    },
  });

  const company = await prisma.company.findFirst({
    where: {
      userId: respond?.id,
    },
  });

  if (respond?.role === 'COMPANY' && !company && values.companyName === '') {
    return { error: 'Company name is required' };
  }

  if (respond?.role === 'COMPANY') {
    await prisma.company.upsert({
      where: {
        id: company?.id || '',
      },
      update: {
        name: values.companyName,
      },
      create: {
        name: values.companyName,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
  }

  const employee = await prisma.employee.findFirst({
    where: {
      userId: respond?.id,
    },
  });

  if (respond?.role === 'EMPLOYEE') {
    await prisma.employee.upsert({
      where: { id: employee?.id || '' },
      update: {
        name: values.name,
      },
      create: {
        name: values.name,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
  }

  revalidatePath('/');
  return { success: 'Updated successful' };
};

export const remove = async (userId: string | undefined) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  await signOut();

  return redirect('/auth/sign-in');
};
