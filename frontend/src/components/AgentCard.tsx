import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    agencyName: string;
    avgRating: number;
    reviewCount: number;
    activeListingCount: number;
  };
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link href={`/agents/${agent.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden group">
        <div className="aspect-square bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground/20 group-hover:scale-105 transition-transform duration-300">
          {agent.name.charAt(0)}
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg leading-tight">{agent.name}</h3>
            <Badge variant="secondary" className="ml-2 shrink-0">
              {agent.activeListingCount} Listings
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{agent.agencyName}</p>
          <div className="flex items-center gap-1 text-sm pt-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold">{agent.avgRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({agent.reviewCount} reviews)</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
