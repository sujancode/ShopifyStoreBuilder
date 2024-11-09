'use client';

import * as Flags from 'country-flag-icons/react/3x2';
import { Input } from '@/components/ui/input';
import { getCountryData } from '../utils/countries';

interface PhoneInputProps {
  countryCode: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PhoneInput({ countryCode, value, onChange, disabled }: PhoneInputProps) {
  const country = getCountryData().find(c => c.code === countryCode);

  // Get the flag component dynamically
  const getFlagComponent = (code: string) => {
    const Flag = (Flags as Record<string, React.ComponentType<{ className?: string }>>)[code];
    return Flag ? <Flag className="w-5 h-4" /> : null;
  };

  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md w-[100px]">
        {country && getFlagComponent(country.code)}
        <span className="text-sm font-medium">
          {country?.dialCode || '+1'}
        </span>
      </div>
      <Input
        type="tel"
        placeholder="Phone number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="flex-1"
      />
    </div>
  );
}