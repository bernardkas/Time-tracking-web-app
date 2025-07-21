import React, { useRef, useState, useEffect } from 'react';
import { Input } from '../ui/input';

interface ColorInputProps {
  modelValue?: string;
  defaultColor?: string;
  onChange?: (color: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({
  modelValue = '',
  defaultColor = '',
  onChange,
}) => {
  const [color, setColor] = useState<string>(modelValue || defaultColor);
  const colorPickerRef = useRef<HTMLInputElement | null>(null);
  const [debouncedColor, setDebouncedColor] = useState<string>(color);

  const triggerColorPicker = () => {
    colorPickerRef.current?.click();
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedColor(color);
    }, 300); 

    return () => {
      clearTimeout(handler);
    };
  }, [color]);

  useEffect(() => {
    if (onChange && debouncedColor !== modelValue) {
      onChange(debouncedColor);
    }
  }, [debouncedColor, onChange, modelValue]);

  useEffect(() => {
    if (modelValue && modelValue !== color) {
      setColor(modelValue);
    }
  }, [modelValue]);

  return (
    <div className="color-input flex items-center gap-2 relative">
      <Input
        type="color"
        ref={colorPickerRef}
        value={color}
        className="hidden-input"
        onChange={(e) => setColor(e.target.value)}
      />
      <div
        className="color-preview w-8 h-8 rounded cursor-pointer border border-gray-300"
        onClick={triggerColorPicker}
        style={{ backgroundColor: color }}
      ></div>
      <Input
        type="text"
        value={color}
        className="color-value-input w-24 p-2 border border-gray-300 rounded text-black"
        onChange={(e) => setColor(e.target.value)}
        style={{ borderColor: color === '#ffffff' ? '#ccc' : color }}
      />
    </div>
  );
};

export default ColorInput;
