'use client';

import React, { useState, useRef, useEffect } from 'react';

interface MultiSelectProps {
  options: string[];
  limit: number;
  value?: string[]; // Allow external control of selected items
  onChange: (selected: string[]) => void;
  limitText?: string;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  limit,
  value = [], // Default to an empty array if no value is provided
  onChange,
  limitText,
  placeholder,
}) => {
  const [selected, setSelected] = useState<string[]>(value); // Initialize state with value
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const multiSelectRef = useRef<HTMLDivElement>(null);

  // Sync external value with internal state
  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (option: string) => {
    if (selected.includes(option)) {
      const newSelected = selected.filter(item => item !== option);
      setSelected(newSelected);
      onChange(newSelected);
    } else if (selected.length < limit) {
      const newSelected = [...selected, option];
      setSelected(newSelected);
      onChange(newSelected);
    }
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const handleRemove = (option: string) => {
    const newSelected = selected.filter(item => item !== option);
    setSelected(newSelected);
    onChange(newSelected);
  };

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown if clicked outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        multiSelectRef.current &&
        !multiSelectRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative' ref={multiSelectRef}>
      <div
        className='flex items-center flex-wrap gap-2 px-3 py-2 border rounded-md bg-white focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer'
        onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown when clicking on input
      >
        {selected.map(item => (
          <div
            key={item}
            className='flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-md cursor-pointer'>
            {item}
            <span
              className='w-4 h-4 cursor-pointer text-gray-600'
              onClick={e => {
                e.stopPropagation(); // Prevent dropdown from opening
                handleRemove(item);
              }}>
              ×
            </span>
          </div>
        ))}
        {selected.length < limit && (
          <input
            type='text'
            className='flex-1 outline-none bg-transparent'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={placeholder}
          />
        )}
      </div>

      {isDropdownOpen && (
        <div className='absolute left-0 right-0 mt-1 bg-white shadow-lg border rounded-md max-h-60 overflow-y-auto z-10'>
          <ul className='space-y-1'>
            {filteredOptions.map(option => (
              <li
                key={option}
                className='px-3 py-2 hover:bg-blue-50 cursor-pointer'
                onClick={() => handleSelect(option)} // Close dropdown on select
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selected.length >= limit && (
        <p className='text-sm text-slate-400 mt-1'>
          Maximum of {limit} {limitText} can be selected.
        </p>
      )}
    </div>
  );
};

export default MultiSelect;
