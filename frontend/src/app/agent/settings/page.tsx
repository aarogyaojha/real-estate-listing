'use client';

import { useEffect, useState } from 'react';
import { apiFetch, updateAgent } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AgentSettingsPage() {
  const { user } = useAuth();
  const [agent, setAgent] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    agencyName: '',
    bio: '',
    specialties: '',
    serviceArea: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.role === 'AGENT') {
      apiFetch<any[]>('/agents').then(agents => {
        const agentsList = Array.isArray(agents) ? agents : (agents as any).data ?? [];
        const myAgent = agentsList.find((a: any) => a.userId === user.userId);
        if (myAgent) {
          setAgent(myAgent);
          setForm({
            name: myAgent.name || '',
            agencyName: myAgent.agencyName || '',
            bio: myAgent.bio || '',
            specialties: myAgent.specialties || '',
            serviceArea: myAgent.serviceArea || '',
          });
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;
    setSaving(true);
    try {
      await updateAgent(agent.id, form);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;
  if (user?.role !== 'AGENT') return <div className="p-20 text-center text-muted-foreground">Unauthorized</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
      <p className="text-muted-foreground mb-8">Update your professional details shown on the platform.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agency">Agency Name</Label>
            <Input id="agency" value={form.agencyName} onChange={e => setForm({...form, agencyName: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Professional Bio</Label>
          <Textarea id="bio" rows={5} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Tell clients about your experience..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialties">Specialties (comma separated)</Label>
          <Input id="specialties" value={form.specialties} onChange={e => setForm({...form, specialties: e.target.value})} placeholder="Luxury Homes, Apartments, Rentals..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">Service Area</Label>
          <Input id="area" value={form.serviceArea} onChange={e => setForm({...form, serviceArea: e.target.value})} placeholder="Kathmandu, Lalitpur..." />
        </div>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? 'Saving Changes...' : 'Save Profile'}
        </Button>
      </form>
    </div>
  );
}
