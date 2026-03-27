'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/auth.context';
import { createListing, fetchAgentsSimple } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PROPERTY_TYPES = ['HOUSE', 'APARTMENT', 'TOWNHOUSE', 'LAND', 'COMMERCIAL'];

export default function NewListingPage() {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();
  const [agents, setAgents] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '', description: '', price: '', suburb: '', state: 'Bagmati',
    postcode: '', propertyType: 'HOUSE', bedrooms: '1', bathrooms: '1',
    parkingSpaces: '0', landSizeSqm: '', floorSizeSqm: '', agentId: '', internalNotes: '',
  });

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN' && user?.role !== 'AGENT') {
      router.replace('/listings');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchAgentsSimple().then(data => {
      const agentsList = Array.isArray(data) ? data : (data as any).data ?? [];
      setAgents(agentsList);
      
      // Auto-assign if user is Agent
      if (user?.role === 'AGENT') {
        const myAgent = agentsList.find((a: any) => a.userId === user.userId);
        if (myAgent) {
          setForm(prev => ({ ...prev, agentId: myAgent.id }));
        }
      }
    }).catch(() => {});
  }, [user]);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createListing({
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        parkingSpaces: Number(form.parkingSpaces),
        landSizeSqm: form.landSizeSqm ? Number(form.landSizeSqm) : undefined,
        floorSizeSqm: form.floorSizeSqm ? Number(form.floorSizeSqm) : undefined,
        internalNotes: form.internalNotes || undefined,
      });
      router.push('/listings');
    } catch (err: any) {
      setError(err?.message || 'Failed to create listing.');
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) return null;
  if (user?.role !== 'ADMIN' && user?.role !== 'AGENT') return null;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Add New Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Title', field: 'title', placeholder: 'e.g. Spacious house in Kathmandu' },
          { label: 'Suburb', field: 'suburb', placeholder: 'e.g. Kathmandu' },
          { label: 'State', field: 'state', placeholder: 'e.g. Bagmati' },
          { label: 'Postcode', field: 'postcode', placeholder: '44600' },
          { label: 'Price (NPR)', field: 'price', placeholder: '15000000', type: 'number' },
          { label: 'Bedrooms', field: 'bedrooms', placeholder: '3', type: 'number' },
          { label: 'Bathrooms', field: 'bathrooms', placeholder: '2', type: 'number' },
          { label: 'Parking Spaces', field: 'parkingSpaces', placeholder: '1', type: 'number' },
          { label: 'Land Size (sqm)', field: 'landSizeSqm', placeholder: '250', type: 'number' },
          { label: 'Floor Size (sqm)', field: 'floorSizeSqm', placeholder: '120', type: 'number' },
        ].map(({ label, field, placeholder, type }) => (
          <div key={field} className="space-y-1">
            <Label htmlFor={field}>{label}</Label>
            <Input id={field} type={type || 'text'} placeholder={placeholder} value={(form as any)[field]} onChange={e => update(field, e.target.value)} required={['title','suburb','state','postcode','price','bedrooms','bathrooms'].includes(field)} />
          </div>
        ))}

        <div className="space-y-1">
          <Label>Property Type</Label>
          <select className="w-full border rounded-md px-3 py-2 bg-background text-sm" value={form.propertyType} onChange={e => update('propertyType', e.target.value)}>
            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {user?.role === 'ADMIN' ? (
          <div className="space-y-1">
            <Label>Agent</Label>
            <select className="w-full border rounded-md px-3 py-2 bg-background text-sm" value={form.agentId} onChange={e => update('agentId', e.target.value)} required>
              <option value="">Select an agent</option>
              {agents.map((a: any) => <option key={a.id} value={a.id}>{a.name} — {a.agencyName}</option>)}
            </select>
          </div>
        ) : (
          <div className="space-y-1 opacity-60">
            <Label>Agent (Auto-assigned)</Label>
            <Input value={user?.username || ''} disabled />
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="description">Description</Label>
          <textarea id="description" rows={4} className="w-full border rounded-md px-3 py-2 bg-background text-sm resize-none" placeholder="Describe the property..." value={form.description} onChange={e => update('description', e.target.value)} required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="internalNotes">Internal Notes (admin only)</Label>
          <textarea id="internalNotes" rows={2} className="w-full border rounded-md px-3 py-2 bg-background text-sm resize-none" placeholder="Optional internal notes..." value={form.internalNotes} onChange={e => update('internalNotes', e.target.value)} />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Creating...' : 'Create Listing'}
        </Button>
      </form>
    </div>
  );
}
