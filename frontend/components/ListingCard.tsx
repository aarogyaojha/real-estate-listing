'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ListingCardProps {
  listing: {
    data?: any;
    id: string;
    title: string;
    price: number | string;
    suburb: string;
    state: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    parkingSpaces?: number;
  };
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

export function ListingCard({ listing }: ListingCardProps) {
  const l = listing.data || listing;

  return (
    <Link href={`/listings/${l.id}`} className="group">
      <Card className="h-full hover:shadow-lg transition-all duration-200 group-hover:-translate-y-1 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {l.title}
            </h3>
            <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${propTypeColors[l.propertyType] || 'bg-gray-100 text-gray-800'}`}>
              {l.propertyType}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-2xl font-bold text-primary">{formatNPR(l.price)}</p>
          <p className="text-sm text-muted-foreground mt-1">{l.suburb}, {l.state}</p>
        </CardContent>
        <CardFooter>
          <div className="flex gap-3 text-sm text-muted-foreground">
            <span>🛏 {l.bedrooms} bed</span>
            <span>🚿 {l.bathrooms} bath</span>
            {l.parkingSpaces > 0 && <span>🚗 {l.parkingSpaces}</span>}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
