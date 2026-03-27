'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface AgentReviewFormProps {
  agentId: string;
  onSuccess?: () => void;
}

export function AgentReviewForm({ agentId, onSuccess }: AgentReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="p-6 border rounded-lg bg-muted/20 text-center">
        <p className="text-muted-foreground text-sm mb-2">Please log in to leave a review.</p>
        <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>Login</Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await apiFetch(`/agents/${agentId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      setRating(0);
      setComment('');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-6 bg-card">
      <h3 className="font-bold text-lg">Leave a Review</h3>
      
      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star 
                className={`w-8 h-8 ${
                  s <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                }`} 
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Your Experience</Label>
        <Textarea 
          id="comment" 
          value={comment} 
          onChange={(e) => setComment(e.target.value)}
          placeholder="What was it like working with this agent?" 
          rows={3}
          required 
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading || rating === 0}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
