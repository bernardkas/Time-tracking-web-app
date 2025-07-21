'use client';

import React, { useState } from 'react';
import { Employee, ActivityLog } from '@prisma/client';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TableHeader,
} from '@/components/ui/table';
import { format, isSameDay } from 'date-fns';
import { EmployeeWithDetails } from '@/types/EmployeeType';
import Title from '@/components/ui-reusable/title';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFormattedDate } from '@/lib/use-formatted-date';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ModalDetails from './ModalDetails';

interface EmployeeDetailProps {
  employee: EmployeeWithDetails;
}

const EmployeeDetail = ({ employee }: EmployeeDetailProps) => {
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Filter logs based on the selected date
  const filteredLogs = selectedDate
    ? employee.activityLogs.filter(log =>
        isSameDay(new Date(log.timestamp), selectedDate)
      )
    : employee.activityLogs;

  console.log('filteredLogs', filteredLogs);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleModalOpen = (log?: ActivityLog) => {
    setSelectedLog(log || null);
    setModalIsOpen(!modalIsOpen);
  };

  return (
    <div className='container mx-auto px-6 py-8 space-y-8'>
      {/* Page Title */}
      <Title>Employee Details</Title>

      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/employees'>Employees</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                {employee.name || 'No employee name'}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Employee Information & Activity */}
      <div className='flex flex-col  w-full gap-6'>
        {/* Employee Information Card */}
        <Card className='col-span-1'>
          <CardHeader>
            <h2 className='text-xl font-semibold'>Employee Information</h2>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center space-x-3'>
              <span className='font-medium text-gray-700'>Name:</span>
              <span className='text-gray-900'>{employee.name || 'N/A'}</span>
            </div>
            <div className='flex items-center space-x-3'>
              <span className='font-medium text-gray-700'>Email:</span>
              <span className='text-gray-900'>{employee?.user.email}</span>
            </div>
            <div className='flex items-center space-x-3'>
              <span>Active:</span>
              <span className='text-gray-900'>{employee?.isOnline}</span>
            </div>
            <div className='flex items-center space-x-3'>
              <span className='font-medium text-gray-700'>Status:</span>
              <span
                className={`px-3 py-1 rounded-full ${
                  employee.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : employee.status === 'ACCEPTED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                {employee.status}
              </span>
            </div>
            <div className='flex items-center space-x-3'>
              <span className='font-medium text-gray-700'>Joined On:</span>
              <span className='text-gray-900'>
                {useFormattedDate(employee.createdAt)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Activity Section */}
        <Card className='col-span-2'>
          <CardHeader>
            <h2 className='text-xl font-semibold'>Employee Activity Logs</h2>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='activityLogs' className='space-y-6'>
              <TabsList>
                <TabsTrigger value='activityLogs'>Activity Logs</TabsTrigger>
                <TabsTrigger value='statistics'>Statistics</TabsTrigger>
              </TabsList>

              {/* Activity Logs */}
              <TabsContent value='activityLogs'>
                {employee.activityLogs?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Mouse Clicks</TableHead>
                        <TableHead>Keyboard Clicks</TableHead>
                        <TableHead>Screen Time</TableHead>
                        <TableHead>Screenshot</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employee.activityLogs.map(log => (
                        <TableRow
                          onClick={() => handleModalOpen(log)}
                          key={log.id}>
                          <TableCell>
                            {format(new Date(log.timestamp), 'PPP')}
                          </TableCell>
                          <TableCell>{log.mouseClicks}</TableCell>
                          <TableCell>{log.keyboardClicks}</TableCell>
                          <TableCell>{log.screenTime} mins</TableCell>
                          <TableCell>
                            {log.screenshots ? (
                              <div>{log?.screenshots.length}</div>
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className='text-gray-500'>No activity logs found.</p>
                )}
              </TabsContent>

              {/* Statistics */}
              <TabsContent value='statistics'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <p>Total Mouse Clicks:</p>
                    <span className='font-medium'>
                      {employee.activityLogs?.reduce(
                        (acc, log) => acc + (log.mouseClicks ?? 0),
                        0
                      )}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span>Total Keyboard Clicks:</span>
                    <span className='font-medium'>
                      {employee.activityLogs?.reduce(
                        (acc, log) => acc + (log.keyboardClicks ?? 0),
                        0
                      )}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span>Total Screen Time:</span>
                    <span className='font-medium'>
                      {employee.activityLogs?.reduce(
                        (acc, log) => acc + (log.screenTime ?? 0),
                        0
                      )}{' '}
                      mins
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Detail Employee</DialogTitle>
          </DialogHeader>
          <ModalDetails log={selectedLog} />

          <DialogFooter>
            <Button onClick={() => setModalIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeDetail;
