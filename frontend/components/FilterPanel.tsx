'use client';

import { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ListingFilters } from '@/lib/api';

interface FilterPanelProps {
  filters: ListingFilters;
  onFilterChange: (filters: Partial<ListingFilters>) => void;
}

const PROPERTY_TYPES = ['HOUSE', 'APARTMENT', 'TOWNHOUSE', 'LAND', 'COMMERCIAL'];

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const handleClear = useCallback(() => {
    onFilterChange({
      suburb: undefined,
      price_min: undefined,
      price_max: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      property_type: undefined,
      keyword: undefined,
    });
  }, [onFilterChange]);

  return (
    <div className="space-y-5 rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Filters</h2>
        <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs h-7">Clear all</Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="suburb">Suburb</Label>
        <Input
          id="suburb"
          placeholder="e.g. Kathmandu"
          value={filters.suburb || ''}
          onChange={e => onFilterChange({ suburb: e.target.value || undefined })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="keyword">Keyword</Label>
        <Input
          id="keyword"
          placeholder="Search..."
          value={filters.keyword || ''}
          onChange={e => onFilterChange({ keyword: e.target.value || undefined })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="price_min">Min Price (NPR)</Label>
          <Input
            id="price_min"
            type="number"
            placeholder="0"
            value={filters.price_min || ''}
            onChange={e => onFilterChange({ price_min: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price_max">Max Price (NPR)</Label>
          <Input
            id="price_max"
            type="number"
            placeholder="Any"
            value={filters.price_max || ''}
            onChange={e => onFilterChange({ price_max: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Property Type</Label>
        <Select
          value={filters.property_type || 'ALL'}
          onValueChange={v => onFilterChange({ property_type: v === 'ALL' ? undefined : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Any type</SelectItem>
            {PROPERTY_TYPES.map(t => (
              <SelectItem key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Select
            value={filters.bedrooms ? String(filters.bedrooms) : 'ANY'}
            onValueChange={v => onFilterChange({ bedrooms: v === 'ANY' ? undefined : Number(v) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ANY">Any</SelectItem>
              {[1, 2, 3, 4, 5].map(n => (
                <SelectItem key={n} value={String(n)}>{n}+</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Bathrooms</Label>
          <Select
            value={filters.bathrooms ? String(filters.bathrooms) : 'ANY'}
            onValueChange={v => onFilterChange({ bathrooms: v === 'ANY' ? undefined : Number(v) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ANY">Any</SelectItem>
              {[1, 2, 3, 4].map(n => (
                <SelectItem key={n} value={String(n)}>{n}+</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
