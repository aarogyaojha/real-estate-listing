import { useQuery } from '@tanstack/react-query';
import { fetchListing } from '@/lib/api';
import { useEffect } from 'react';

export function useListing(id: string) {
  const query = useQuery({
    queryKey: ['listing', id],
    queryFn: () => fetchListing(id),
    staleTime: 30000,
  });

  useEffect(() => {
    if (query.data && id) {
      try {
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const filtered = recentlyViewed.filter((item: string) => item !== id);
        const updated = [id, ...filtered].slice(0, 5);
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      } catch (e) {
        localStorage.setItem('recentlyViewed', JSON.stringify([id]));
      }
    }
  }, [id, query.data]);

  return query;
}
