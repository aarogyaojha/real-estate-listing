'use client';

import { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ListingFilters } from '@/lib/api';

interface FilterPanelProps {
  filters: ListingFilters;
  onFilterChange: (filters: Partial<ListingFilters>) => void;
  suburbs?: string[];
  priceRange?: { min: number; max: number };
}

const PROPERTY_TYPES = ['HOUSE', 'APARTMENT', 'TOWNHOUSE', 'LAND', 'COMMERCIAL'];
const BED_OPTIONS = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4+', value: 4 },
];
const BATH_OPTIONS = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4+', value: 4 },
];

function formatNPR(n: number) {
  if (n >= 10000000) return `NPR ${(n / 10000000).toFixed(0)}Cr`;
  if (n >= 100000) return `NPR ${(n / 100000).toFixed(0)}L`;
  return `NPR ${n.toLocaleString('en-IN')}`;
}

export function FilterPanel({
  filters,
  onFilterChange,
  suburbs = ['Bhaktapur', 'Kathmandu', 'Lalitpur', 'Patan', 'Pokhara'],
  priceRange = { min: 5000000, max: 50000000 },
}: FilterPanelProps) {
  const [priceSlider, setPriceSlider] = useState([
    filters.price_min ?? priceRange.min,
    filters.price_max ?? priceRange.max,
  ]);

  const handleClear = useCallback(() => {
    setPriceSlider([priceRange.min, priceRange.max]);
    onFilterChange({
      suburb: undefined,
      suburbs: undefined,
      price_min: undefined,
      price_max: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      property_type: undefined,
      keyword: undefined,
    });
  }, [onFilterChange, priceRange]);

  function toggleSuburb(s: string) {
    const current = filters.suburbs ? filters.suburbs.split(',').filter(Boolean) : [];
    const next = current.includes(s) ? current.filter(x => x !== s) : [...current, s];
    onFilterChange({ suburbs: next.length ? next.join(',') : undefined, suburb: undefined });
  }

  const selectedSuburbs = filters.suburbs ? filters.suburbs.split(',').filter(Boolean) : [];

  return (
    <div className="space-y-5 rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Filters</h2>
        <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs h-7">Clear all</Button>
      </div>

      {/* Suburb multi-select */}
      <div className="space-y-2">
        <Label>Suburb</Label>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(suburbs) && suburbs.map(s => (
            <button
              key={s}
              onClick={() => toggleSuburb(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                selectedSuburbs.includes(s)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:border-primary text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Keyword */}
      <div className="space-y-2">
        <Label htmlFor="keyword">Keyword</Label>
        <Input
          id="keyword"
          placeholder="Search..."
          value={filters.keyword || ''}
          onChange={e => onFilterChange({ keyword: e.target.value || undefined })}
        />
      </div>

      {/* Price range slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Price Range</Label>
          <span className="text-xs text-muted-foreground">
            {formatNPR(priceSlider[0])} – {formatNPR(priceSlider[1])}
          </span>
        </div>
        <Slider
          min={priceRange.min}
          max={priceRange.max}
          step={100000}
          value={priceSlider}
          onValueChange={(v: any) => setPriceSlider(v)}
          onValueCommitted={(v: any) => onFilterChange({ price_min: v[0] > priceRange.min ? v[0] : undefined, price_max: v[1] < priceRange.max ? v[1] : undefined })}
          className="mt-1"
        />
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <Label>Property Type</Label>
        <select
          className="w-full border rounded-md px-3 py-2 bg-background text-sm"
          value={filters.property_type || 'ALL'}
          onChange={e => onFilterChange({ property_type: e.target.value === 'ALL' ? undefined : e.target.value })}
        >
          <option value="ALL">Any type</option>
          {PROPERTY_TYPES.map(t => (
            <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
          ))}
        </select>
      </div>

      {/* Bedrooms pills */}
      <div className="space-y-2">
        <Label>Bedrooms</Label>
        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange({ bedrooms: undefined })}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${!filters.bedrooms ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary'}`}
          >
            Any
          </button>
          {BED_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onFilterChange({ bedrooms: filters.bedrooms === value ? undefined : value })}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${filters.bedrooms === value ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms pills */}
      <div className="space-y-2">
        <Label>Bathrooms</Label>
        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange({ bathrooms: undefined })}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${!filters.bathrooms ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary'}`}
          >
            Any
          </button>
          {BATH_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onFilterChange({ bathrooms: filters.bathrooms === value ? undefined : value })}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${filters.bathrooms === value ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
