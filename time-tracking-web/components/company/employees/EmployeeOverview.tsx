'use client';
import { DataTable } from '@/components/ui-reusable/datatable/datatable';
import Title from '@/components/ui-reusable/title';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { columns } from './datatable/columns';
import ModalWrapper from '@/components/ui-reusable/modal-wrapper';
import InvitationForm from './InvitationForm';
import { Employee, Invitation } from '@prisma/client';
import { InvitationWithDetails } from '@/types/InvitationType';
import { deleteEmployee } from '@/actions/Model/employee';
import { toast } from 'react-toastify';
import { deleteInvitation } from '@/actions/Model/invitation';
import { BeatLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';

interface EmployeeOverviewProps {
  employees: Employee[];
  invitations: InvitationWithDetails[];
}

const EmployeeOverview = ({
  employees,
  invitations,
}: EmployeeOverviewProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const goToDetail = (data: any) => {
    router.push(`/employees/${data?.uuid}`);
  };

  const handleDeleteInvitation = (id: string) => {
    setLoading(true);
    deleteInvitation(id).then(res => {
      if (res?.success) {
        setLoading(false);
        toast(res?.success, { type: 'success' });
      }
      setLoading(false);
    });
  };

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <div className='space-y-10'>
        <div className='flex flex-row justify-between items-center mt-5'>
          <Title>Employees</Title>
          <ModalWrapper
            isOpen={open}
            setIsOpen={setOpen}
            buttonText='Add Employee'
            dialogName='Add Employee'
            dialogDescription='Add Employee'>
            <InvitationForm onClose={handleClose} />
          </ModalWrapper>
        </div>
        <div className='border-2'></div>
        <div className='space-y-5'>
          <div>
            {employees?.length === 0 && invitations?.length === 0 ? (
              <div>
                <h3>No employees found</h3>
              </div>
            ) : (
              <div className='space-y-5'>
                {invitations?.length > 0 && (
                  <div className='space-y-5'>
                    <h1 className='font-bold text-lg'>Invitations</h1>
                    <ul className='space-y-3'>
                      {invitations.map(invitation => (
                        <li
                          key={invitation.id}
                          className='p-4 border rounded-lg flex justify-between items-center'>
                          <div>
                            <p>
                              <span className='font-medium'>Email:</span>{' '}
                              {invitation.email}
                            </p>
                            <p>
                              <span className='font-medium'>Status:</span>{' '}
                              PENDING
                            </p>
                          </div>
                          <Button
                            variant='destructive'
                            onClick={() =>
                              handleDeleteInvitation(invitation.id)
                            }>
                            {loading ? <BeatLoader color='white' /> : 'Delete'}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {employees?.length > 0 && (
                  <div>
                    <DataTable
                      key={employees?.length}
                      columns={columns}
                      data={employees}
                      onRowClick={goToDetail}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOverview;
