'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AddAgentForm } from '@/components/AddAgentForm';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    apiFetch<any[]>('/agents/stats').then(res => {
      setStats(Array.isArray(res) ? res : (res as any).data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchStats();
    }
  }, [user]);

  if (user?.role !== 'ADMIN') return <div className="p-20 text-center text-muted-foreground">Unauthorized Access</div>;

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform performance and agent activity.</p>
        </div>
        <AddAgentForm onSuccess={fetchStats} />
      </div>

      <Card className="border-primary/20 shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle>Agent Performance & Listing Stats</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent Name</TableHead>
                  <TableHead>Total Listings</TableHead>
                  <TableHead>Status Breakdown</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((s) => (
                  <TableRow key={s.agentId}>
                    <TableCell className="font-semibold">{s.agentName}</TableCell>
                    <TableCell>{s.totalListings}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {s.stats.map((st: any) => (
                          <Badge key={st.status} variant="outline" className="text-[10px] uppercase">
                            {st.status}: {st.count}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <button className="text-xs text-primary hover:underline" onClick={() => window.location.href = `/agents/${s.agentId}`}>View Profile</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
