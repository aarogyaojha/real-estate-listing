'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createSavedSearch } from '@/lib/api';
import { toast } from 'sonner';
import { BookmarkIcon } from 'lucide-react';

export function SavedSearchButton({ filters }: { filters: any }) {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a name for your search');
      return;
    }

    setLoading(true);
    try {
      await createSavedSearch(name, JSON.stringify(filters));
      toast.success('Search saved successfully');
      setOpen(false);
      setName('');
    } catch (error) {
      toast.error('Failed to save search');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button variant="outline" size="sm" className="gap-2">
            <BookmarkIcon className="h-4 w-4" />
            Save Search
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Search</DialogTitle>
          <DialogDescription>
            Give your search a name so you can easily find it later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Search Name</label>
            <Input
              id="name"
              placeholder="e.g. Kathmandu 3BHK Budget"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Search'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
