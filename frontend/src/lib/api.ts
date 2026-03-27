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

export async function fetchListings(filters: ListingFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) params.set(k, String(v));
  });
  const qs = params.toString();
  return apiFetch<any>(`/listings${qs ? `?${qs}` : ''}`);
}

export async function fetchListing(id: string) {
  return apiFetch<any>(`/listings/${id}`);
}

export async function fetchAgents() {
  return apiFetch<any>('/agents');
}

export async function fetchAgent(id: string, params: Record<string, any> = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiFetch<any>(`/agents/${id}${qs ? `?${qs}` : ''}`);
}

export async function fetchAgentReviews(agentId: string) {
  return apiFetch<any[]>(`/agents/${agentId}/reviews`);
}

export async function updateAgent(id: string, body: Record<string, any>) {
  return apiFetch<any>(`/agents/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
}

export async function login(body: { username: string; password: string }) {
  return apiFetch<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function register(body: { username: string; password: string }) {
  return apiFetch<any>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function logout() {
  return apiFetch<any>('/auth/logout', { method: 'POST' });
}

export async function getMe() {
  return apiFetch<any>('/auth/me');
}

export async function toggleSaveListing(id: string) {
  return apiFetch<{ isSaved: boolean }>(`/listings/${id}/save`, { method: 'POST' });
}

export async function fetchSavedListings() {
  return apiFetch<any[]>('/listings/saved');
}

export async function createListing(body: Record<string, any>) {
  return apiFetch<any>('/listings', { method: 'POST', body: JSON.stringify(body) });
}

export async function fetchAgentsSimple() {
  return apiFetch<any[]>('/agents');
}

export async function fetchSuburbs() {
  return apiFetch<string[]>('/listings/suburbs');
}
