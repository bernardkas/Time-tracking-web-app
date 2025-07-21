import { getCompanyById } from '@/actions/Model/company';
import {
  getCompanyByEmployee,
  getEmployeeById,
  getEmployees,
} from '@/actions/Model/employee';
import {
  getInvitations,
  getInvitationsByCompany,
} from '@/actions/Model/invitation';
import { auth } from '@/auth';
import Dashboard from '@/components/company/dashboard/Dashboard';
import DashboardEmployee from '@/components/employee-role/DashboardEmployee';
import React from 'react';

const DashboardPage = async () => {
  const currentUser = (await auth()) as any;
  const invitation = (await getInvitations()) as any;
  const company = (await getCompanyByEmployee()) as any;
  const employee = (await getEmployees()) as any;
  const invitationByCompany = (await getInvitationsByCompany()) as any;

  return (
    <div className='w-full '>
      {currentUser?.user?.role === 'COMPANY' && (
        <Dashboard
          user={currentUser?.user}
          company={company}
          employee={employee}
          invitationByCompany={invitationByCompany}
        />
      )}
      {currentUser?.user?.role === 'EMPLOYEE' && (
        <DashboardEmployee
          user={currentUser?.user}
          invitations={invitation}
          company={company}
        />
      )}
    </div>
  );
};

export default DashboardPage;
