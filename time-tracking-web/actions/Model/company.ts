'use server';
import { auth } from '@/auth';
import prisma from '@/db/db';
import { redirect } from 'next/navigation';

export const getCompanyById = async () => {
  const user = await auth();

  if (!user) {
    redirect('/auth/sign-in');
  }

  const company = await prisma.company.findFirst({
    where: {
      userId: user?.user?.id,
    },
    include: {
      employees: true,
    },
  });

  return company;
};

export const getCompanyInvitations = async () => {
  const currentUser = await auth();

  if (!currentUser) {
    redirect('/auth/sign-in');
  }

  const currentCompany = await prisma.company.findUnique({
    where: { userId: currentUser.user.id },
  });

  const userInvitations = await prisma.invitation.findMany({
    where: {
      companyId: currentCompany?.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return userInvitations;
};

export const getCompanyEmployees = async () => {
  const currentUser = await auth();

  if (!currentUser) {
    redirect('/auth/sign-in');
  }

  const currentCompany = await prisma.company.findUnique({
    where: { userId: currentUser.user.id },
  });

  return prisma.employee.findMany({
    where: {
      companyId: currentCompany?.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};
