'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AutocompleteProps {
  data: any[] | undefined; 
  placeholder?: string;
  searchPlaceholder?: string;
  multiple?: boolean;
  clearable?: boolean;
  onSelect?: (value: string | string[]) => void; 
  modelValue?: string | string[];
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  data = [],
  placeholder = 'Search...',
  searchPlaceholder = 'Search...',
  multiple = false,
  clearable = false,
  onSelect,
  modelValue = '',
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null); 
  const [selectedItems, setSelectedItems] = useState<string[]>([]); 

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
  }, [searchTerm, data]);

  useEffect(() => {
    if (modelValue) {
      if (multiple) {
        setSelectedItems(modelValue as string[]);
      } else {
        setSelectedItem(modelValue as string);
      }
    }
  }, [modelValue, multiple]);

  const handleSelectItem = (id: string) => {
    if (multiple) {
      if (selectedItems.includes(id)) {
        setSelectedItems((prev) => prev.filter((item) => item !== id));
      } else {
        setSelectedItems((prev) => [...prev, id]);
      }
      if (onSelect) onSelect(selectedItems); 
    } else {
      setSelectedItem(id);
      setOpen(false);
      if (onSelect) onSelect(id);
    }
  };

  const clearSelection = () => {
    setSelectedItem(null);
    setSelectedItems([]);
    if (onSelect) onSelect(multiple ? [] : []);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-black"
        >
          <span className="truncate">
            {multiple
              ? selectedItems.length > 0
                ? selectedItems.map((id) => data.find((item) => item.uuid === id)?.name).join(', ')
                : placeholder
              : data.find((item) => item.uuid === selectedItem)?.name || placeholder} 
          </span>
          <div className="flex items-center space-x-1">
            {clearable && (selectedItem || selectedItems.length > 0) && (
              <X className="w-4 h-4" onClick={clearSelection} />
            )}
            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder}
          />
          <CommandList>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <CommandItem
                  key={item.uuid}
                  onSelect={() => handleSelectItem(item.uuid)} 
                >
                  {item.name} 
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      multiple
                        ? selectedItems.includes(item.uuid) 
                          ? 'opacity-100'
                          : 'opacity-0'
                        : selectedItem === item.uuid 
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))
            ) : (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Autocomplete;
