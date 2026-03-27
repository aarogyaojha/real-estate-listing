'use client';

import { useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FilterPanel } from '@/components/FilterPanel';
import { ListingCard } from '@/components/ListingCard';
import { Pagination } from '@/components/Pagination';
import { useListings } from '@/hooks/useListings';
import { ListingFilters } from '@/lib/api';

function parseFilters(params: URLSearchParams): ListingFilters {
  const f: ListingFilters = {};
  if (params.get('suburb')) f.suburb = params.get('suburb')!;
  if (params.get('keyword')) f.keyword = params.get('keyword')!;
  if (params.get('price_min')) f.price_min = Number(params.get('price_min'));
  if (params.get('price_max')) f.price_max = Number(params.get('price_max'));
  if (params.get('bedrooms')) f.bedrooms = Number(params.get('bedrooms'));
  if (params.get('bathrooms')) f.bathrooms = Number(params.get('bathrooms'));
  if (params.get('property_type')) f.property_type = params.get('property_type')!;
  f.page = Number(params.get('page') || '1');
  f.limit = Number(params.get('limit') || '12');
  return f;
}

export default function ListingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams);
  const { data, isLoading, isError } = useListings(filters);

  const updateUrl = useCallback((newFilters: Partial<ListingFilters>) => {
    const merged = { ...filters, ...newFilters, page: 1 };
    const params = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
    });
    if (params.get('page') === '1') params.delete('page');
    router.push(`/listings?${params.toString()}`);
  }, [filters, router]);

  const setPage = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/listings?${params.toString()}`);
  }, [searchParams, router]);

  const listings = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 12, totalPages: 0 };

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <FilterPanel filters={filters} onFilterChange={updateUrl} />
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold">
            {isLoading ? 'Loading...' : `${meta.total} Properties Found`}
          </h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border overflow-hidden">
                <Skeleton className="h-36 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-destructive">
            <p>Failed to load listings. Please try again.</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-xl font-medium">No properties found</p>
            <p className="text-muted-foreground">Try adjusting your filters</p>
            <Button variant="outline" onClick={() => updateUrl({ suburb: undefined, keyword: undefined, price_min: undefined, price_max: undefined, bedrooms: undefined, bathrooms: undefined, property_type: undefined })}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings.map((listing: any) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
