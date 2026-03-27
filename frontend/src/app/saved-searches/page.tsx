'use client';

import { useEffect, useState } from 'react';
import { fetchSavedSearches, deleteSavedSearch } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { SearchIcon, Trash2Icon, ArrowRightIcon } from 'lucide-react';

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadSearches = async () => {
    try {
      const data = await fetchSavedSearches();
      setSearches(data);
    } catch (error) {
      toast.error('Failed to load saved searches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSearches();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteSavedSearch(id);
      toast.success('Search deleted');
      setSearches(searches.filter(s => s.id !== id));
    } catch (error) {
      toast.error('Failed to delete search');
    }
  };

  const handleApply = (filtersJSON: string) => {
    const filters = JSON.parse(filtersJSON);
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    router.push(`/listings?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Saved Searches</h1>
        <p className="text-muted-foreground">Easily access your favorite search criteria.</p>
      </div>

      {searches.length === 0 ? (
        <Card className="border-dashed py-12 text-center">
          <CardContent className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <SearchIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium">No saved searches yet</p>
              <p className="text-sm text-muted-foreground">Save your filters on the listings page to see them here.</p>
            </div>
            <Button onClick={() => router.push('/listings')}>Browse Listings</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {searches.map((search) => {
            const filters = JSON.parse(search.filtersJSON);
            const filterCount = Object.values(filters).filter(v => v !== undefined && v !== null && v !== '').length;

            return (
              <Card key={search.id} className="group hover:border-primary/50 transition-all">
                <CardContent className="p-6 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {search.name}
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap pt-1">
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                        {filterCount} Filters
                      </Badge>
                      {filters.property_type && (
                        <Badge variant="outline" className="text-[10px] uppercase">{filters.property_type}</Badge>
                      )}
                      {filters.suburb && (
                        <Badge variant="outline" className="text-[10px] uppercase">{filters.suburb}</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(search.id)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="default" 
                      className="gap-2"
                      onClick={() => handleApply(search.filtersJSON)}
                    >
                      View Results
                      <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
