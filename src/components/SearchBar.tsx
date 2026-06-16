'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CityOption {
  slug: string;
  name: string;
  stateSlug: string;
  stateAbbr: string;
}

interface Props {
  cities: CityOption[];
}

export default function SearchBar({ cities }: Props) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const resultsListId = useId();
  const router = useRouter();
  const normalizedQuery = query.trim().toLowerCase();

  const filtered =
    normalizedQuery.length > 0
      ? cities
          .filter((city) =>
            [city.name, city.stateAbbr].some((value) => value.toLowerCase().includes(normalizedQuery))
          )
          .slice(0, 8)
      : [];

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function navigateToCity(city: CityOption) {
    setShowDropdown(false);
    setQuery(city.name);
    router.push(`/${city.stateSlug}/${city.slug}`);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (filtered.length === 0) return;

    const selectedIndex = highlightIndex >= 0 ? highlightIndex : 0;
    navigateToCity(filtered[selectedIndex]);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightIndex((current) => Math.min(current + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === 'Escape') {
      setShowDropdown(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative mx-auto max-w-xl" style={{ zIndex: 50 }}>
      <form onSubmit={handleSubmit} className="flex rounded-xl bg-white p-2">
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setShowDropdown(true);
            setHighlightIndex(-1);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search city..."
          className="flex-1 rounded-l-lg px-4 py-3 text-base text-gray-900 outline-none"
          autoComplete="off"
          aria-label="Search city"
          aria-autocomplete="list"
          aria-controls={resultsListId}
          aria-expanded={showDropdown && filtered.length > 0}
          aria-activedescendant={highlightIndex >= 0 ? `${resultsListId}-option-${highlightIndex}` : undefined}
          role="combobox"
        />
        <button
          type="submit"
          className="whitespace-nowrap rounded-lg bg-accent px-6 py-3 font-bold text-navy-900 transition-colors hover:bg-yellow-600"
        >
          Search
        </button>
      </form>

      {showDropdown && filtered.length > 0 && (
        <ul
          id={resultsListId}
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
          role="listbox"
          aria-label="City search results"
        >
          {filtered.map((city, index) => (
            <li key={`${city.stateSlug}/${city.slug}`} id={`${resultsListId}-option-${index}`} role="option" aria-selected={index === highlightIndex}>
              <button
                type="button"
                onClick={() => navigateToCity(city)}
                className={`flex w-full items-center justify-between px-5 py-3 text-left text-gray-900 transition-colors hover:bg-navy-50 ${
                  index === highlightIndex ? 'bg-navy-50' : ''
                }`}
              >
                <span className="font-medium">{city.name}</span>
                <span className="text-sm text-gray-400">{city.stateAbbr}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {showDropdown && query.length > 0 && filtered.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-500 shadow-lg" role="status">
          No cities found for &ldquo;{query}&rdquo; — try searching by city or state abbreviation.
        </div>
      )}
    </div>
  );
}
