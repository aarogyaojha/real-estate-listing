'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AdminPanelProps {
  status: string;
  internalNotes?: string | null;
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800 border-green-200',
  UNDER_CONTRACT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  SOLD: 'bg-red-100 text-red-800 border-red-200',
  WITHDRAWN: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function AdminPanel({ status, internalNotes }: AdminPanelProps) {
  return (
    <Card className="border-l-4 border-l-amber-500 bg-amber-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
          🔒 Admin Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Status</p>
          <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.replace('_', ' ')}
          </span>
        </div>
        {internalNotes && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Internal Notes</p>
            <p className="text-sm text-amber-900">{internalNotes}</p>
          </div>
        )}
        {!internalNotes && (
          <p className="text-xs text-muted-foreground italic">No internal notes.</p>
        )}
      </CardContent>
    </Card>
  );
}
