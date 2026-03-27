'use client';

import { useEffect, useState } from 'react';
import { fetchSimilarListings } from '@/lib/api';
import { ListingCard } from './ListingCard';
import { Skeleton } from './ui/skeleton';

export function SimilarListings({ currentId }: { currentId: string }) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimilarListings(currentId)
      .then(data => {
        // Handle both wrapped {data: [...]} and raw [...] responses
        setListings(Array.isArray(data) ? data : (data as any).data || []);
      })
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [currentId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Similar Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (listings.length === 0) return null;

  return (
    <div className="space-y-4 pt-10 border-t">
      <h2 className="text-2xl font-bold">Similar Properties You Might Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map(l => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}
