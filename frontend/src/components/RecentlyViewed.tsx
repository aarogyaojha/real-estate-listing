'use client';

import { useEffect, useState } from 'react';
import { fetchListing } from '@/lib/api';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import { ClockIcon } from 'lucide-react';

export function RecentlyViewed() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentlyViewed = async () => {
      const ids = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      if (ids.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch details for these IDs
        const details = await Promise.all(
          ids.map((id: string) => fetchListing(id).catch(() => null))
        );
        setItems(details.filter(item => item !== null));
      } catch (error) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecentlyViewed();
  }, []);

  if (loading) return <Skeleton className="h-40 w-full rounded-xl" />;
  if (items.length === 0) return null;

  return (
    <Card className="bg-muted/20 border-muted/50">
      <CardContent className="p-4 space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
          <ClockIcon className="h-3.5 w-3.5" />
          Recently Viewed
        </h3>
        <div className="space-y-3">
          {items.map((listing) => (
            <Link 
              key={listing.id} 
              href={`/listings/${listing.id}`}
              className="group block"
            >
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-md bg-muted overflow-hidden flex-shrink-0">
                  {/* Placeholder for small thumbnail if we had images */}
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                    RE
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                    {listing.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {listing.suburb}, {listing.state}
                  </p>
                  <p className="text-[11px] font-bold text-foreground mt-0.5">
                    NPR {Number(listing.price).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
