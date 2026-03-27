'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchAgent, fetchAgentReviews } from '@/lib/api';
import { ListingCard } from '@/components/ListingCard';
import { AgentReviewForm } from '@/components/AgentReviewForm';
import { AgentReviewList } from '@/components/AgentReviewList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MapPin, Briefcase, Mail, Phone } from 'lucide-react';

export default function AgentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshReviews = () => {
    fetchAgentReviews(id).then(setReviews);
  };

  useEffect(() => {
    Promise.all([
      fetchAgent(id),
      fetchAgentReviews(id)
    ]).then(([agentData, reviewData]: [any, any]) => {
      const a = agentData.data || agentData;
      const r = Array.isArray(reviewData) ? reviewData : (reviewData.data || []);
      setData(a);
      setReviews(r);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="container mx-auto p-8"><Skeleton className="h-[400px] w-full" /></div>;
  if (!data) return <div className="text-center py-20">Agent not found</div>;

  const { agent, listings } = data;

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <div className="aspect-square bg-muted flex items-center justify-center text-7xl font-bold text-muted-foreground/20">
              {agent.name.charAt(0)}
            </div>
            <CardContent className="p-6 space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{agent.name}</h1>
                <p className="text-muted-foreground">{agent.agencyName}</p>
              </div>

              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-bold">{agent.avgRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({agent.reviewCount} reviews)</span>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" /> {agent.email}
                </div>
                {agent.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4" /> {agent.phone}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About {agent.name.split(' ')[0]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {agent.bio || `${agent.name} is a dedicated real estate professional at ${agent.agencyName}, committed to providing exceptional service to buyers and sellers alike.`}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Briefcase className="w-4 h-4" /> Specialties
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {agent.specialties?.map((s: string) => <Badge key={s} variant="outline">{s}</Badge>) || <span className="text-sm text-muted-foreground italic">None listed</span>}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="w-4 h-4" /> Service Areas
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {agent.suburbCoverage?.map((s: string) => <Badge key={s} variant="outline">{s}</Badge>) || <span className="text-sm text-muted-foreground italic">Statewide</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Live Listings</h2>
            {listings.data.length === 0 ? (
              <p className="py-10 text-center text-muted-foreground border rounded-lg bg-muted/20">No active listings at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listings.data.map((l: any) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <AgentReviewList reviews={reviews} />
        </div>
        <div className="md:col-span-1">
          <AgentReviewForm agentId={agent.id} onSuccess={refreshReviews} />
        </div>
      </div>
    </div>
  );
}
