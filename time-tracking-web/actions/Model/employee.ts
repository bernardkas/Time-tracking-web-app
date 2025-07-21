'use server';

import { auth } from '@/auth';
import prisma from '@/db/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const getEmployeeById = async (uuid: string) => {
  const company = await prisma.employee.findFirst({
    where: {
      uuid: uuid,
    },
    include: {
      activityLogs: true,
      user: true,
    },
  });

  return company;
};

export const getEmployees = async () => {
  const currentUser = await auth();
  if (!currentUser) {
    redirect('/auth/sign-in');
  }

  const currentCompany = await prisma.company.findUnique({
    where: { userId: currentUser.user.id },
  });

  const employees = await prisma.employee.findMany({
    where: {
      companyId: currentCompany?.id,
    },
    include: {
      activityLogs: true,
      user: true,
    },
  });

  return employees;
};

// ? EMPLOYEE ROLE
export const getCompanyByEmployee = async () => {
  const currentUser = await auth();

  if (!currentUser) {
    redirect('/auth/sign-in');
  }

  const currentEmployee = await prisma.employee.findFirst({
    where: {
      userId: currentUser.user.id,
    },
  });

  if (!currentEmployee) {
    return { error: 'Employee not found.' };
  }

  if (currentEmployee?.status === 'DECLINED') {
    return { error: 'Employee declined invitation.' };
  }

  const company = await prisma.company.findMany({
    where: {
      id: currentEmployee?.companyId ?? '',
    },
  });

  return company;
};

export const deleteEmployee = async (employeeId: string) => {
  const currentUser = await auth();

  if (!currentUser) {
    throw new Error('Unauthorized');
  }

  // Fetch the company of the current user
  const currentCompany = await prisma.company.findUnique({
    where: {
      userId: currentUser.user.id,
    },
  });

  if (!currentCompany) {
    throw new Error('Company not found for the current user.');
  }

  // Check if the employee belongs to the company
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });

  if (!employee || employee.companyId !== currentCompany.id) {
    return { error: 'Employee not found or does not belong to this company.' };
  }

  // Remove the `companyId` to disassociate the employee
  await prisma.employee.update({
    where: { id: employeeId },
    data: {
      companyId: null,
    },
  });

  revalidatePath('/employees');
  return { success: 'Employee removed successfully.' };
};

export const deleteCompanyFromEmployee = async () => {
  const currentUser = await auth();

  if (!currentUser) {
    redirect('/auth/sign-in');
  }

  if (currentUser?.user.role !== 'EMPLOYEE') {
    return { error: 'Only employees can remove themselves from a company.' };
  }

  const employee = await prisma.employee.findUnique({
    where: { userId: currentUser.user?.id },
    select: { companyId: true, id: true },
  });

  if (!employee?.companyId) {
    return { error: 'You are not part of any company.' };
  }

  try {
    console.log('employee', employee);

    await prisma.activityLog.deleteMany({
      where: { employeeId: employee?.id },
    });

    await prisma.employee.update({
      where: { userId: currentUser.user?.id },
      data: { companyId: null },
    });

    revalidatePath('/dashboard'); // Refresh data on dashboard
    return { success: 'You have successfully left the company.' };
  } catch (error) {
    return { error: 'Failed to remove company. Try again later.' };
  }
};
