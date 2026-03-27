import { useQuery } from '@tanstack/react-query';
import { fetchListing } from '@/lib/api';

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => fetchListing(id),
    staleTime: 30000,
  });
}
