const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

let isRefreshing = false;
let refreshSubscribers: ((error: Error | null) => void)[] = [];

function onRefreshed(error: Error | null) {
  refreshSubscribers.forEach((cb) => cb(error));
  refreshSubscribers = [];
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (
    res.status === 401 && 
    !path.includes('/auth/login') && 
    !path.includes('/auth/refresh') && 
    !path.includes('/auth/register')
  ) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        
        if (!refreshRes.ok) {
          throw new Error('Session expired');
        }
        
        isRefreshing = false;
        onRefreshed(null);
      } catch (err) {
        isRefreshing = false;
        onRefreshed(err as Error);
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        throw err;
      }
    }

    // Wait for the refresh to complete
    await new Promise((resolve, reject) => {
      refreshSubscribers.push((err) => {
        if (err) reject(err);
        else resolve(null);
      });
    });

    // Retry original request
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw error;
  }

  const json = await res.json();
  // Unwrap { data: T } if it comes from our TransformInterceptor
  // But keep the whole object if it has pagination 'meta'
  if (json && typeof json === 'object' && 'data' in json && !('meta' in json)) {
    return json.data;
  }
  return json;
}

export interface ListingFilters {
  suburb?: string;
  suburbs?: string;
  price_min?: number;
  price_max?: number;
  bedrooms?: number;
  bathrooms?: number;
  property_type?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  suburb: string;
  state: string;
  postcode: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  landSizeSqm?: number;
  floorSizeSqm?: number;
  status: string;
  listedAt: string;
  agent?: Agent;
  internalNotes?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  agencyName: string;
  bio?: string;
  specialties: string[];
  suburbCoverage: string[];
  userId?: string;
}

export async function fetchListings(filters: ListingFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) params.set(k, String(v));
  });
  const qs = params.toString();
  return apiFetch<{ data: Listing[]; meta: any }>(`/listings${qs ? `?${qs}` : ''}`);
}

export async function fetchListing(id: string) {
  return apiFetch<Listing>(`/listings/${id}`);
}

export async function fetchAgents() {
  return apiFetch<Agent[]>('/agents');
}

export async function fetchAgent(id: string, params: Record<string, unknown> = {}) {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  return apiFetch<Agent>(`/agents/${id}${qs ? `?${qs}` : ''}`);
}

export async function fetchAgentReviews(agentId: string) {
  return apiFetch<unknown[]>(`/agents/${agentId}/reviews`);
}

export async function updateAgent(id: string, body: Record<string, unknown>) {
  return apiFetch<Agent>(`/agents/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
}

export async function fetchSimilarListings(id: string) {
  return apiFetch<Listing[]>(`/listings/${id}/similar`);
}

export async function updateListingStatus(id: string, status: string) {
  return apiFetch<Listing>(`/listings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function fetchPriceHistory(id: string) {
  return apiFetch<unknown[]>(`/listings/${id}/price-history`);
}

export async function createSavedSearch(name: string, filtersJSON: string) {
  return apiFetch<unknown>('/listings/saved-searches', {
    method: 'POST',
    body: JSON.stringify({ name, filtersJSON }),
  });
}

export async function fetchSavedSearches() {
  return apiFetch<unknown[]>('/listings/saved-searches');
}

export async function deleteSavedSearch(id: string) {
  return apiFetch<unknown>(`/listings/saved-searches/${id}`, {
    method: 'DELETE',
  });
}

export async function login(body: { username: string; password: string }) {
  return apiFetch<unknown>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function register(body: { username: string; password: string }) {
  return apiFetch<unknown>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function logout() {
  return apiFetch<unknown>('/auth/logout', { method: 'POST' });
}

export async function getMe() {
  return apiFetch<unknown>('/auth/me');
}

export async function toggleSaveListing(id: string) {
  return apiFetch<{ isSaved: boolean }>('/listings/save', { 
    method: 'POST', 
    body: JSON.stringify({ listingId: id }) 
  });
}

export async function fetchSavedListings() {
  return apiFetch<Listing[]>('/listings/saved');
}

export async function createAgent(body: Record<string, unknown>) {
  return apiFetch<Agent>('/agents', { method: 'POST', body: JSON.stringify(body) });
}

export async function createListing(body: Record<string, unknown>) {
  return apiFetch<Listing>('/listings', { method: 'POST', body: JSON.stringify(body) });
}

export async function fetchAgentsSimple() {
  return apiFetch<Agent[]>('/agents');
}

export async function fetchSuburbs() {
  return apiFetch<string[]>('/listings/suburbs');
}
