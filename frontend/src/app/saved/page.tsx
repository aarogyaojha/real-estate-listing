'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/auth.context';
import { fetchSavedListings } from '@/lib/api';
import { ListingCard } from '@/components/ListingCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SavedListingsPage() {
  const { user, isLoading } = useAuthContext();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchSavedListings()
      .then((data: any) => setListings(Array.isArray(data) ? data : data?.data ?? []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (isLoading || loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 rounded-xl border bg-card animate-pulse" />
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-xl font-medium">Sign in to see your saved properties</p>
        <Link href="/login"><Button>Login</Button></Link>
      </div>
    );
  }

  const handleToggle = (id: string, isSaved: boolean) => {
    if (!isSaved) {
      setListings(prev => prev.filter(l => l.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Saved Properties</h1>
        <Link href="/listings"><Button variant="outline" size="sm">← Browse all</Button></Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="text-xl font-medium">No saved properties yet</p>
          <p className="text-muted-foreground">Browse listings and click the ❤️ to save ones you like</p>
          <Link href="/listings"><Button>Browse Properties</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {listings.map((listing: any) => (
            <ListingCard key={listing.id} listing={listing} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
