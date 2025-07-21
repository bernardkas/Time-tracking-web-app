'use server';
import { auth } from '@/auth';
import { getUserByEmail, getUserById } from '@/data/user';
import prisma from '@/db/db';
import { InvitationSchema } from '@/schemas/InvitationSchema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);
// ? COMPANY ROLE
export const sendInvitation = async (
  values: z.infer<typeof InvitationSchema>
) => {
  const validetedFields = InvitationSchema.safeParse(values);

  if (!validetedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { name, email } = values;
  const currentUser = await auth();

  if (!currentUser) {
    redirect('/auth/sign-in');
  }

  const user = await getUserById(currentUser.user.id);

  const invitedUser = await getUserByEmail(email);

  const existingCompany = await prisma.company.findUnique({
    where: { userId: currentUser.user.id },
  });

  if (!existingCompany) {
    return { error: 'Company not found' };
  }

  const existingInvitation = await prisma.invitation.findUnique({
    where: { email },
  });

  if (existingInvitation) {
    return { error: 'Invitation already sent.' };
  }

  const existingEmployee = await prisma.employee.findFirst({
    where: {
      companyId: existingCompany.id,
      userId: invitedUser?.id, // Check using userId
    },
  });

  console.log('existingEmployee', existingEmployee);

  if (existingEmployee?.status === 'ACCEPTED') {
    return { error: 'This user is already part of the team.' };
  }

  if (existingEmployee && existingEmployee.status === 'DECLINED') {
    await prisma.employee.update({
      where: { id: existingEmployee.id },
      data: { status: 'DECLINED' },
    });
  }

  const employeeCount = await prisma.employee.count({
    where: { companyId: existingCompany.id },
  });

  if (user?.subscriptionType === 'BASIC' && employeeCount >= 2) {
    return { error: 'BASIC subscription allows only 2 employees.' };
  }

  await prisma.invitation.create({
    data: {
      email,
      companyId: existingCompany?.id,
    },
  });

  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-in`; // Your login URL from environment variables
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? '',
    to: email,
    subject: `Invitation from ${existingCompany?.name}`,
    html: `
    <div style="background-color: #f9f9f9; padding: 40px; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="background-color: #4CAF50; color: white; text-align: center; padding: 20px;">
          <h1 style="margin: 0; font-size: 24px;">You're Invited to Join ${existingCompany.name}</h1>
        </div>
        <div style="padding: 20px; text-align: center;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Hello <strong>${name}</strong>,
          </p>
          <p style="font-size: 16px; color: #555; margin-bottom: 30px;">
            You have been invited to join <strong>${existingCompany.name}</strong>. Please use this email (<strong>${email}</strong>) to log in and accept the invitation.
          </p>
          <a href="${loginUrl}" style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; font-size: 16px; padding: 10px 20px; border-radius: 5px; margin: 20px 0;">
            Accept Invitation
          </a>
          <p style="font-size: 14px; color: #888; margin-top: 20px;">
            If you did not expect this invitation, please ignore this email.
          </p>
        </div>
        <div style="background-color: #f1f1f1; text-align: center; padding: 10px;">
          <p style="font-size: 12px; color: #aaa; margin: 0;">
            Best regards, <br />${existingCompany.name} Team
          </p>
        </div>
      </div>
    </div>
  `,
  });

  revalidatePath('/employees');
  return { success: `Invitation sent to the ${email}` };
};

// ? Employee ROLE DASHBOARD
export const getInvitations = async () => {
  const currentUser = await auth();

  if (!currentUser) {
    redirect('/auth/sign-in');
  }

  const userInvitations = await prisma.invitation.findMany({
    where: {
      email: currentUser.user.email ?? '',
    },
    include: {
      company: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return userInvitations;
};

export const getInvitationsByCompany = async () => {
  const currentUser = await auth();

  if (!currentUser) {
    redirect('/auth/sign-in');
  }

  const currentCompany = await prisma.company.findUnique({
    where: { userId: currentUser.user.id },
  });

  const userInvitations = await prisma.invitation.findMany({
    where: {
      companyId: currentCompany?.id ?? '',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return userInvitations;
};
// ? Employee ROLE
export const acceptInvitation = async (accept: boolean) => {
  const currentUser = await auth();

  if (!currentUser) {
    redirect('/auth/sign-in');
  }

  const user = await getUserById(currentUser?.user.id);

  const invitation = await prisma.invitation.findUnique({
    where: {
      email: currentUser.user.email ?? '',
    },
  });

  if (!invitation) {
    return { error: 'Invitation not found.' };
  }

  const newStatus = accept === true ? 'ACCEPTED' : 'DECLINED';

  // Find the corresponding employee
  const employee = await prisma.employee.findFirst({
    where: { userId: currentUser.user.id },
  });

  if (!employee) {
    return { error: 'No employee record found for this user.' };
  }

  if (user?.role === 'COMPANY') {
    return { error: 'You need to change the role to be an Employee!' };
  }

  // Update the employee status
  await prisma.employee.update({
    where: { id: employee.id },
    data: { status: newStatus, companyId: invitation.companyId },
  });

  const existingCompany = await prisma.company.findUnique({
    where: { id: invitation.companyId },
    include: {
      user: true,
    },
  });
  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-in`;
  if (accept === true) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? '',
      to: existingCompany?.user?.email ?? '',
      subject: `Accepted Invitation ${employee?.name}`,
      html: `
    <div style="background-color: #f9f9f9; padding: 40px; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="background-color: #4CAF50; color: white; text-align: center; padding: 20px;">
          <h1 style="margin: 0; font-size: 24px;">Accepted invitation ${employee.name}</h1>
        </div>
        <div style="padding: 20px; text-align: center;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Hello <strong>${existingCompany?.name}</strong>,
          </p>
          <p style="font-size: 16px; color: #555; margin-bottom: 30px;">
            This employee just accepted your invitation <strong>${employee.name}</strong>.
          </p>
          <a href="${loginUrl}" style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; font-size: 16px; padding: 10px 20px; border-radius: 5px; margin: 20px 0;">
            Login to view
          </a>
        </div>
      </div>
    </div>
  `,
    });
  }

  if (accept === false) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? '',
      to: existingCompany?.user?.email ?? '',
      subject: `Decline Invitation ${employee?.name}`,
      html: `
    <div style="background-color: #f9f9f9; padding: 40px; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="background-color: #4CAF50; color: white; text-align: center; padding: 20px;">
          <h1 style="margin: 0; font-size: 24px;">Decline invitation ${employee.name}</h1>
        </div>
        <div style="padding: 20px; text-align: center;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Hello <strong>${existingCompany?.name}</strong>,
          </p>
          <p style="font-size: 16px; color: #555; margin-bottom: 30px;">
            This employee just decline your invitation <strong>${employee.name}</strong>.
          </p>
          <a href="${loginUrl}" style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; font-size: 16px; padding: 10px 20px; border-radius: 5px; margin: 20px 0;">
            Login to view
          </a>
        </div>
      </div>
    </div>
  `,
    });
  }

  await prisma.invitation.delete({
    where: { id: invitation.id },
  });

  revalidatePath('/dashboard');
  return { success: `Invitation status updated to ${newStatus}` };
};

export const deleteInvitation = async (invitationId: string) => {
  const currentUser = await auth();

  if (!currentUser) {
    redirect('/auth/sign-in');
  }

  await prisma.invitation.delete({
    where: { id: invitationId },
  });

  revalidatePath('/employees');
  return { success: 'Invitation deleted successfully.' };
};
