import { getEmployeeById } from '@/actions/Model/employee';
import EmployeeDetail from '@/components/company/employees/detail/EmployeeDetail';
import React from 'react';

interface EmployeeDetailPageProps {
  params: {
    slug: string;
  };
}

const EmployeeDetailPage = async ({ params }: EmployeeDetailPageProps) => {
  const employee = (await getEmployeeById(params.slug)) as any;
  return (
    <div>
      <EmployeeDetail employee={employee} />
    </div>
  );
};

export default EmployeeDetailPage;
