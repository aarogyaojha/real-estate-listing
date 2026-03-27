import { useQuery } from '@tanstack/react-query';
import { fetchListings, ListingFilters } from '@/lib/api';

export function useListings(filters: ListingFilters = {}) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => fetchListings(filters),
    staleTime: 30000,
  });
}
