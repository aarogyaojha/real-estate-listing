'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminPanel } from '@/components/AdminPanel';
import { EnquiryForm } from '@/components/EnquiryForm';
import { MortgageCalculator } from '@/components/MortgageCalculator';
import { PriceHistoryTimeline } from '@/components/PriceHistoryTimeline';
import { SimilarListings } from '@/components/SimilarListings';
import { useListing } from '@/hooks/useListing';
import { useAuth } from '@/hooks/useAuth';

function formatNPR(price: number | string) {
  return `NPR ${Number(price).toLocaleString('en-IN')}`;
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useListing(id);
  const { user } = useAuth();

  const listing = data?.data || data;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-medium text-destructive">Listing not found</p>
        <Link href="/listings">
          <Button variant="outline" className="mt-4">← Back to listings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/listings">
          <Button variant="ghost" size="sm" className="mb-4">← Back to listings</Button>
        </Link>
        <h1 className="text-3xl font-bold">{listing.title}</h1>
        <p className="text-muted-foreground mt-1">
          {listing.suburb}, {listing.state} {listing.postcode}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-4xl font-bold text-primary">{formatNPR(listing.price)}</p>
        <Badge variant="outline">{listing.propertyType}</Badge>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Badge variant="outline" className="text-sm px-3 py-1">🛏 {listing.bedrooms} Bedrooms</Badge>
        <Badge variant="outline" className="text-sm px-3 py-1">🚿 {listing.bathrooms} Bathrooms</Badge>
        {listing.parkingSpaces > 0 && (
          <Badge variant="outline" className="text-sm px-3 py-1">🚗 {listing.parkingSpaces} Parking</Badge>
        )}
        {listing.landSizeSqm && (
          <Badge variant="outline" className="text-sm px-3 py-1">📐 Land: {listing.landSizeSqm} m²</Badge>
        )}
        {listing.floorSizeSqm && (
          <Badge variant="outline" className="text-sm px-3 py-1">🏢 Floor: {listing.floorSizeSqm} m²</Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
        </CardContent>
      </Card>

      {listing.agent && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Listed by</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <Link href={`/agents/${listing.agent.id}`} className="font-semibold hover:text-primary transition-colors">
                {listing.agent.name}
              </Link>
              <p className="text-muted-foreground text-sm">{listing.agent.agencyName}</p>
              {listing.agent.phone && (
                <p className="text-sm">📞 {listing.agent.phone}</p>
              )}
              <p className="text-sm text-muted-foreground">✉️ {listing.agent.email}</p>
            </CardContent>
          </Card>
          
          <EnquiryForm agentId={listing.agent.id} listingId={listing.id} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MortgageCalculator price={listing.price} />
        </div>
        <div className="lg:col-span-1">
          <PriceHistoryTimeline id={listing.id} currentPrice={listing.price} />
        </div>
      </div>

      {user?.role === 'ADMIN' && listing.status && (
        <AdminPanel listingId={listing.id} status={listing.status} internalNotes={listing.internalNotes} />
      )}

      <SimilarListings currentId={id} />
    </div>
  );
}
