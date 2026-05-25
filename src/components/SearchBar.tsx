'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CityOption {
  slug: string;
  name: string;
  state: string;
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
  const router = useRouter();
  const normalizedQuery = query.trim().toLowerCase();

  const filtered =
    normalizedQuery.length > 0
      ? cities
          .filter((city) =>
            [city.name, city.state, city.stateAbbr].some((value) =>
              value.toLowerCase().includes(normalizedQuery)
            )
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

    const selectedIndex = highlightIndex >= 0 ? Math.min(highlightIndex, filtered.length - 1) : 0;
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
      setHighlightIndex(-1);
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
          placeholder="Search city or state..."
          className="flex-1 rounded-l-lg px-4 py-3 text-base text-gray-900 outline-none"
          autoComplete="off"
          aria-label="Search by city or state"
        />
        <button
          type="submit"
          className="whitespace-nowrap rounded-lg bg-accent px-6 py-3 font-bold text-navy-900 transition-colors hover:bg-yellow-600"
        >
          Search
        </button>
      </form>

      {showDropdown && filtered.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg" role="listbox" aria-label="City search results">
          {filtered.map((city, index) => (
            <li key={`${city.stateSlug}/${city.slug}`}>
              <button
                type="button"
                onClick={() => navigateToCity(city)}
                role="option"
                aria-selected={index === highlightIndex}
                className={`flex w-full items-center justify-between px-5 py-3 text-left text-gray-900 transition-colors hover:bg-navy-50 ${
                  index === highlightIndex ? 'bg-navy-50' : ''
                }`}
              >
                <span className="font-medium">{city.name}</span>
                <span className="text-sm text-gray-400">{city.stateAbbr} · {city.state}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {showDropdown && query.length > 0 && filtered.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-500 shadow-lg">
          No cities found for &ldquo;{query}&rdquo; — try searching by city or state.
        </div>
      )}
    </div>
  );
}
