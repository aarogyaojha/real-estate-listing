'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { toggleSaveListing, Listing } from '@/lib/api';
import { useAuthContext } from '@/context/auth.context';

interface ListingCardProps {
  listing: Listing;
  onToggle?: (id: string, isSaved: boolean) => void;
}

function formatNPR(price: number | string) {
  const n = Number(price);
  return `NPR ${n.toLocaleString('en-IN')}`;
}

const propTypeColors: Record<string, string> = {
  HOUSE: 'bg-blue-100 text-blue-800',
  APARTMENT: 'bg-purple-100 text-purple-800',
  TOWNHOUSE: 'bg-green-100 text-green-800',
  LAND: 'bg-yellow-100 text-yellow-800',
  COMMERCIAL: 'bg-orange-100 text-orange-800',
};

export function ListingCard({ listing, onToggle }: ListingCardProps) {
  const l = (listing as any).data || listing;
  const { user } = useAuthContext();
  const [isSaved, setIsSaved] = useState<boolean>(!!l.isSaved);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsSaved(!!l.isSaved);
  }, [l.isSaved]);

  const showHeart = user && user.role !== 'ADMIN';

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;

    // Optimistic Update
    const prevSaved = isSaved;
    const nextSaved = !prevSaved;
    setIsSaved(nextSaved);
    if (onToggle) onToggle(l.id, nextSaved);

    setSaving(true);
    try {
      const result = await toggleSaveListing(l.id);
      setIsSaved(result.isSaved);
    } catch {
      // Rollback on error
      setIsSaved(prevSaved);
      if (onToggle) onToggle(l.id, prevSaved);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Link href={`/listings/${l.id}`} className="group">
      <Card className="h-full hover:shadow-lg transition-all duration-200 group-hover:-translate-y-1 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {l.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${propTypeColors[l.propertyType] || 'bg-gray-100 text-gray-800'}`}>
                {l.propertyType}
              </span>
              {showHeart && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                  aria-label={isSaved ? 'Unsave listing' : 'Save listing'}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isSaved ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={2}
                    className={`w-5 h-5 transition-colors ${isSaved ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-400'}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-2xl font-bold text-primary">{formatNPR(l.price)}</p>
          <p className="text-sm text-muted-foreground mt-1">{l.suburb}, {l.state}</p>
        </CardContent>
        <CardFooter>
          <div className="flex gap-3 text-sm text-muted-foreground">
            <span>{l.bedrooms} bed</span>
            <span>{l.bathrooms} bath</span>
            {l.parkingSpaces > 0 && <span>{l.parkingSpaces} car</span>}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
