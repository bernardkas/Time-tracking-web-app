'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTableViewOptions } from './datatable-view-option';
import { useState } from 'react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [showArchived, setShowArchived] = useState(false);

  // const handleToggleArchived = (checked: boolean) => {
  //   setShowArchived(checked);

  //   const column = table.getColumn("deletedAt");

  //   if (column) {
  //     if (checked) {
  //       column.setFilterValue("archived");
  //     } else {
  //       column.setFilterValue("active");
  //     }
  //   } else {
  //     console.error("deletedAt column not found");
  //   }
  // };

  return (
    <div className='flex items-center justify-between text-black'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Filter name...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px] text-white'
        />
        {/* {table.getColumn('deletedAt') && (
          <div className="flex items-center space-x-2">
           <Switch
            checked={showArchived}
            onCheckedChange={handleToggleArchived}
            />
          <span className="text-gray-500 text-sm">{showArchived ? "Archived" : "Active"}</span>
        </div>
          )} */}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3 text-white'>
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
