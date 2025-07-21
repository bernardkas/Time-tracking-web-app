'use client';
import { acceptInvitation } from '@/actions/Model/invitation';
import { InvitationWithDetails } from '@/types/InvitationType';
import { UserWithDetails } from '@/types/UserType';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { Company } from '@prisma/client';
import {
  deleteCompanyFromEmployee,
  deleteEmployee,
} from '@/actions/Model/employee';

interface DashboardEmployeeProps {
  user: UserWithDetails;
  invitations: InvitationWithDetails[];
  company: Company[];
}

const DashboardEmployee = ({
  user,
  invitations,
  company,
}: DashboardEmployeeProps) => {
  const [acceptLoading, setAccepetLoading] = useState<boolean>(false);
  const [declineLoading, setDeclineLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (user?.profileCompleted === false) {
      router.push('/setup');
    }
  }, [user, router]);

  const handleAcceptInvitation = async (invitation: boolean) => {
    setAccepetLoading(true);
    acceptInvitation(invitation).then(res => {
      if (res?.success) {
        toast(res?.success, { type: 'success' });
        setAccepetLoading(false);
      }

      if (res?.error) {
        toast(res?.error, { type: 'error' });
        setAccepetLoading(false);
      }
    });
  };
  const handleDeclineInvitation = async (invitation: boolean) => {
    setDeclineLoading(true);
    acceptInvitation(invitation).then(res => {
      if (res?.success) {
        toast(res?.success, { type: 'success' });
        setDeclineLoading(false);
      }

      if (res?.error) {
        toast(res?.error, { type: 'error' });
        setDeclineLoading(false);
      }
    });
  };

  const deleteTheCompany = () => {
    setDeleteLoading(true);
    deleteCompanyFromEmployee().then(res => {
      if (res?.success) {
        toast(res?.success, { type: 'success' });
        setDeleteLoading(false);
      }

      if (res?.error) {
        toast(res?.error, { type: 'error' });
        setDeleteLoading(false);
      }
    });
  };

  return (
    <div className='min-h-screen bg-transparent p-6'>
      {/* Header */}
      <header className='bg-white shadow-md rounded-lg p-6 mb-6'>
        <h1 className='text-2xl font-semibold text-gray-800'>
          Welcome, {user.name}
        </h1>
        <p className='text-sm text-gray-600'>Role: {user.role}</p>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Invitations Section */}
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>
            Invitations
          </h2>
          {invitations?.length > 0 ? (
            invitations?.map(invitation => (
              <div
                key={invitation.id}
                className='flex flex-col items-center gap-2 justify-between flex-wrap bg-gray-100 p-4 rounded-lg mb-4'>
                <div>
                  <p className='font-medium text-gray-800'>
                    Invitation from: {invitation.company.name}
                  </p>
                </div>
                <div className='flex space-x-2'>
                  <Button
                    onClick={() => handleAcceptInvitation(true)}
                    className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'>
                    {acceptLoading ? <BeatLoader color='white' /> : 'Accept'}
                  </Button>
                  <Button
                    onClick={() => handleDeclineInvitation(false)}
                    className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'>
                    {declineLoading ? <BeatLoader color='white' /> : 'Decline'}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-600'>No pending invitations.</p>
          )}
        </div>

        {/* Company Connection Section */}
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>
            Connected Company
          </h2>
          {company.length > 0 ? (
            company.map(company => (
              <div className='bg-gray-100 p-4 rounded-lg flex flex-row gap-2'>
                <p className='font-medium text-gray-800'>
                  Company: {company.name}
                </p>
                <Button onClick={deleteTheCompany}>
                  {deleteLoading ? <BeatLoader color='white' /> : 'Delete'}
                </Button>
              </div>
            ))
          ) : (
            <p className='text-gray-600'>
              You are not connected to any company.
            </p>
          )}
        </div>
      </div>

      {/* Additional Information Section */}
      <div className='bg-white shadow-md rounded-lg p-6 mt-6'>
        <h2 className='text-lg font-semibold text-gray-800 mb-4'>
          Profile Information
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <p className='font-medium text-gray-800'>Name: {user.name}</p>
            <p className='text-sm text-gray-600'>Email: {user.email}</p>
          </div>
          <div>
            <p className='font-medium text-gray-800'>
              Profile Completed: {user.profileCompleted ? 'Yes' : 'No'}
            </p>
            <p className='text-sm text-gray-600'>Role: {user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEmployee;
