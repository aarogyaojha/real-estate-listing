'use client';

import { useEffect, useState } from 'react';
import { fetchPriceHistory } from '@/lib/api';
import { Skeleton } from './ui/skeleton';

function formatNPR(price: number | string) {
  const n = Number(price);
  return `NPR ${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function PriceHistoryTimeline({ id, currentPrice }: { id: string; currentPrice: number | string }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPriceHistory(id)
      .then(data => {
        setHistory(Array.isArray(data) ? data : (data as any).data || []);
      })
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Skeleton className="h-32 w-full rounded-xl" />;
  
  // Only show if there's actual history (at least one previous price)
  if (history.length === 0) return null;

  return (
    <div className="bg-muted/30 rounded-xl p-5 border border-muted/50 space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><rect width="18" height="8" x="3" y="8" rx="2"/></svg>
        Price History
      </h3>
      
      <div className="relative pl-4 border-l border-primary/20 space-y-6">
        {/* Current Price (Top of timeline) */}
        <div className="relative">
          <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-base font-bold text-foreground">{formatNPR(currentPrice)}</p>
              <p className="text-[10px] font-medium text-primary uppercase">Current List Price</p>
            </div>
          </div>
        </div>
        
        {/* Historical Prices */}
        {history.map((item) => (
          <div key={item.id} className="relative">
            <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-muted-foreground/30 ring-4 ring-background" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">{formatNPR(item.price)}</p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Changed on {new Date(item.changedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
