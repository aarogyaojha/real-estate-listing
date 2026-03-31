'use client';

import { useEffect, useState } from 'react';
import { apiFetch, Listing, Agent } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { ListingCard } from '@/components/ListingCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AgentPortal() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'AGENT') {
      // Find all agents first to find the one matching the current user's userId
      // In a real app, this information should be part of the User object in AuthContext
      apiFetch<Agent[]>('/agents').then(agents => {
        const agentsList = Array.isArray(agents) ? agents : (agents as unknown as { data: Agent[] }).data ?? [];
        const myAgent = agentsList.find((a: Agent) => a.userId === user.userId);
        if (myAgent) {
          apiFetch<{ listings: { data: Listing[] } | Listing[] }>(`/agents/${myAgent.id}`).then(res => {
            const data = Array.isArray(res.listings) ? res.listings : res.listings?.data || [];
            setListings(data);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      }).catch(() => setLoading(false));
    }
  }, [user]);

  if (user?.role !== 'AGENT') return <div className="p-20 text-center text-muted-foreground">Unauthorized Access</div>;

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Agent Portal</h1>
          <p className="text-muted-foreground">Manage your properties and leads.</p>
        </div>
        <Link href="/listings/new">
          <Button size="lg">+ New Listing</Button>
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">My Listings</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full" />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="py-20 text-center border rounded-xl border-dashed bg-muted/20">
            <p className="text-muted-foreground">You haven&apos;t added any listings yet.</p>
            <Link href="/listings/new" className="text-primary hover:underline mt-2 inline-block">Create your first listing</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(l => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
