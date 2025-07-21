'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [locale, setLocale] = useState<string | null>(null); // Initialize as null to avoid mismatch during initial render

  useEffect(() => {
    // Load saved locale from localStorage on mount
    const savedLocale = localStorage.getItem('locale') || 'de'; // Default to 'de' if nothing is saved
    setLocale(savedLocale);
  }, []);

  const changeLanguage = (newLocale: string) => {
    // Save the selected locale to localStorage
    localStorage.setItem('locale', newLocale);
    // Set a cookie for the server
    document.cookie = `locale=${newLocale}; path=/`;
    setLocale(newLocale);
    // Reload the page to apply the new locale
    router.refresh();
  };

  // Prevent rendering the select until locale is loaded
  if (locale === null) return null;

  return (
    <select
      value={locale}
      onChange={(e) => changeLanguage(e.target.value)}
      className="p-2 border rounded bg-slate-900 text-white"
    >
      <option value="en">EN</option>
      <option value="de">DE</option>
    </select>
  );
}
