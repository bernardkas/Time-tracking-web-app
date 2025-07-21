'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui-reusable/datatable/datatable-column-header';
import { DataTableRowActions } from '@/components/ui-reusable/datatable/datatable-row-action';
import { Badge } from '@/components/ui/badge';
import { useFormattedDate } from '@/lib/use-formatted-date';
import { deleteEmployee } from '@/actions/Model/employee';
import { toast } from 'react-toastify';
import { Employee } from '@prisma/client';

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      // @ts-ignore
      const employeeName = row?.original?.name || 'No employee'; // Safely access the client object
      return <div>{employeeName}</div>;
    },
  },
  {
    accessorKey: 'isOnline',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Active' />
    ),
    cell: ({ row }) => {
      // @ts-ignore
      const isOnlineColors: Record<string, string> = {
        ONLINE: 'bg-green-500 hover:bg-green-600',
        PAUSED: 'bg-orange-500 hover:bg-orange-600',
        OFFLINE: 'bg-red-500 hover:bg-red-600',
      };

      // Default status and color
      const defaultStatus = 'N/A';
      const defaultColor = 'bg-gray-500 hover:bg-gray-600';

      // Extract status from row
      const isOnline = row?.original?.isOnline || defaultStatus;

      console.log('isOnline', isOnline);

      // Get the color based on the status, or use the default color if not found
      const badgeColor = isOnlineColors[isOnline] || defaultColor;

      return (
        <div>
          <Badge className={`px-4 py-2 rounded-md text-white ${badgeColor}`}>
            {isOnline}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      // @ts-ignore
      const statusColors: Record<string, string> = {
        ACCEPTED: 'bg-green-500 hover:bg-green-600',
        PENDING: 'bg-orange-500 hover:bg-orange-600',
        DECLINED: 'bg-red-500 hover:bg-red-600',
      };

      // Default status and color
      const defaultStatus = 'No Status';
      const defaultColor = 'bg-gray-500 hover:bg-gray-600';

      // Extract status from row
      const status = row?.original?.status || defaultStatus;

      // Get the color based on the status, or use the default color if not found
      const badgeColor = statusColors[status] || defaultColor;

      return (
        <div>
          <Badge className={badgeColor}>{status}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      // @ts-ignore

      // Extract status from row
      const createAt = row?.original?.createdAt || '';

      return <div>{useFormattedDate(createAt)}</div>;
    },
  },
  {
    id: 'actions',
    accessorKey: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Actions' />
    ),
    cell: ({ row }) => {
      const handleDelete = () => {
        deleteEmployee(row.original.id).then(res => {
          if (res?.success) {
            toast(res?.success, { type: 'success' });
          }

          if (res?.error) {
            toast(res?.error, { type: 'error' });
          }
        });
      };
      return <DataTableRowActions row={row} onDelete={handleDelete} />;
    },
  },
];
