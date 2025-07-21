import {
  getCompanyEmployees,
  getCompanyInvitations,
} from '@/actions/Model/company';
import EmployeeOverview from '@/components/company/employees/EmployeeOverview';
import React from 'react';

const EmployeesPage = async () => {
  const employees = await getCompanyEmployees();
  const invitations = (await getCompanyInvitations()) as any;
  return (
    <div>
      <EmployeeOverview employees={employees} invitations={invitations} />
    </div>
  );
};

export default EmployeesPage;
