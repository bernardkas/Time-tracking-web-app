'use server';
import { auth, signIn } from '@/auth';
import prisma from '@/db/db';
import { SetupSchema } from '@/schemas/SetupSchema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

export const createSetup = async (values: z.infer<typeof SetupSchema>) => {
  const validetedFields = SetupSchema.safeParse(values);

  if (!validetedFields.success) {
    return { error: 'Invalid fields' };
  }
  const currentUser = await auth();

  if (!currentUser) {
    redirect('/auth/signin');
  }

  const { name, role, password } = values;

  const hashedPassword = await bcrypt.hash(password, 10);

  if (role !== 'EMPLOYEE') {
    await prisma.company.create({
      data: {
        name,
        user: {
          connect: {
            id: currentUser?.user.id,
          },
        },
      },
    });
  }
  if (role === 'EMPLOYEE') {
    await prisma.employee.create({
      data: {
        name: currentUser?.user.name,
        user: {
          connect: {
            id: currentUser?.user.id,
          },
        },
      },
    });
  }

  await prisma.user.update({
    where: {
      id: currentUser?.user.id,
    },
    data: {
      profileCompleted: true,
      role,
      password: hashedPassword,
    },
  });

  redirect('/dashboard');
};
