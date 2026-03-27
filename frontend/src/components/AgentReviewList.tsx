import { Star, User } from 'lucide-react';

function formatRelative(date: Date) {
  const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    username: string;
  };
}

interface AgentReviewListProps {
  reviews: Review[];
}

export function AgentReviewList({ reviews }: AgentReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border rounded-lg border-dashed">
        No reviews yet. Be the first to leave one!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">{review.user.username}</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-3 h-3 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatRelative(new Date(review.createdAt))}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed pl-10">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
