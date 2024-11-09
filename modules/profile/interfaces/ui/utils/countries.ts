interface Country {
  name: string;
  code: string;
  dialCode: string;
}

export function getCountryData(): Country[] {
  return [
    { name: 'United States', code: 'US', dialCode: '+1' },
    { name: 'United Kingdom', code: 'GB', dialCode: '+44' },
    { name: 'India', code: 'IN', dialCode: '+91' },
    { name: 'China', code: 'CN', dialCode: '+86' },
    { name: 'Japan', code: 'JP', dialCode: '+81' },
    { name: 'South Korea', code: 'KR', dialCode: '+82' },
    { name: 'Nepal', code: 'NP', dialCode: '+977' },
    { name: 'Australia', code: 'AU', dialCode: '+61' },
    { name: 'New Zealand', code: 'NZ', dialCode: '+64' },
    { name: 'Singapore', code: 'SG', dialCode: '+65' },
    { name: 'France', code: 'FR', dialCode: '+33' },
    { name: 'Germany', code: 'DE', dialCode: '+49' },
    { name: 'Italy', code: 'IT', dialCode: '+39' },
    { name: 'Spain', code: 'ES', dialCode: '+34' },
    { name: 'Russia', code: 'RU', dialCode: '+7' },
    { name: 'Brazil', code: 'BR', dialCode: '+55' },
    { name: 'Mexico', code: 'MX', dialCode: '+52' },
    { name: 'United Arab Emirates', code: 'AE', dialCode: '+971' },
    { name: 'Saudi Arabia', code: 'SA', dialCode: '+966' },
    { name: 'Egypt', code: 'EG', dialCode: '+20' },
  ];
}