import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { badgeVariants } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateListingStatus } from '@/lib/api';
import { toast } from 'sonner';

interface AdminPanelProps {
  listingId: string;
  status: string;
  internalNotes?: string | null;
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800 border-green-200',
  UNDER_CONTRACT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  SOLD: 'bg-red-100 text-red-800 border-red-200',
  WITHDRAWN: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statuses = ['ACTIVE', 'UNDER_CONTRACT', 'SOLD', 'WITHDRAWN'];

export function AdminPanel({ listingId, status: initialStatus, internalNotes }: AdminPanelProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string | null) => {
    if (!newStatus) return;
    setLoading(true);
    try {
      await updateListingStatus(listingId, newStatus);
      setStatus(newStatus);
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-amber-500 bg-amber-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-amber-700 uppercase tracking-wide flex items-center justify-between">
          <span>Admin Panel</span>
           <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[status] || 'bg-gray-100'}`}>
            {status}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">Manage Status</p>
          <Select value={status} onValueChange={handleStatusChange} disabled={loading}>
            <SelectTrigger className="w-full bg-white h-9 text-sm">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(s => (
                <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {internalNotes && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Internal Notes</p>
            <p className="text-sm text-amber-900 border-t border-amber-100 pt-2">{internalNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
