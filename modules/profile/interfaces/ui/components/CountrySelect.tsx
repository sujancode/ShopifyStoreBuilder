'use client';

import * as Flags from 'country-flag-icons/react/3x2';
import { getCountryData } from '../utils/countries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CountrySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function CountrySelect({ value, onValueChange, disabled }: CountrySelectProps) {
  const countries = getCountryData();

  // Get the flag component dynamically
  const getFlagComponent = (countryCode: string) => {
    const Flag = (Flags as Record<string, React.ComponentType<{ className?: string }>>)[countryCode];
    return Flag ? <Flag className="w-5 h-4" /> : null;
  };

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue>
          {value && (
            <span className="flex items-center gap-2">
              {getFlagComponent(value)}
              <span>{countries.find(c => c.code === value)?.name}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <span className="flex items-center gap-2">
              {getFlagComponent(country.code)}
              <span>{country.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}