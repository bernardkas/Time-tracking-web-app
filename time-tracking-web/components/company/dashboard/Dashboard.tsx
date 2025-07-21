'use client';
import React, { useEffect, useState } from 'react';
import Title from '@/components/ui-reusable/title';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Company, User } from '@prisma/client';
import { InvitationWithDetails } from '@/types/InvitationType';
import { EmployeeWithDetails } from '@/types/EmployeeType';

interface DashboardOverviewProps {
  user: User;
  invitationByCompany: InvitationWithDetails[];
  company: Company[];
  employee: EmployeeWithDetails[];
}

const DashboardOverview = ({
  user,
  invitationByCompany,
  company,
  employee,
}: DashboardOverviewProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (user.profileCompleted === false) {
      router.push('/setup');
    }
  }, [user, router]);

  useEffect(() => {
    if (invitationByCompany || company || employee) {
      setLoading(false);
    }
  }, [invitationByCompany, company, employee]);

  const activeEmployees = employee?.filter(
    employee => employee.isOnline === true
  ).length;

  return (
    <div className='space-y-5 mx-3'>
      <div className='flex flex-row justify-between items-center mt-5'>
        <Title>Dashboard</Title>
      </div>
      <div className='grid gap-4  md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Employees
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'>
              <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
            </svg>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className='h-10 w-full' />
            ) : (
              <div className='text-2xl font-bold'>{employee?.length}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Online Employees
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'>
              <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
            </svg>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className='h-10 w-full' />
            ) : (
              <div className='text-2xl font-bold'>{activeEmployees}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pending Invitations
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'>
              <rect width='20' height='14' x='2' y='5' rx='2' />
              <path d='M2 10h20' />
            </svg>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className='h-10 w-full' />
            ) : (
              <div className='text-2xl font-bold'>
                {invitationByCompany?.length}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Pending Invitations Employees</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className='h-10 w-full' />
            ) : invitationByCompany?.length > 0 ? (
              invitationByCompany?.map(employee => (
                <div className='flex flex-col gap-2' key={employee.id}>
                  <p className='font-medium text-gray-800'>{employee.email}</p>
                </div>
              ))
            ) : (
              <p>No data</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
