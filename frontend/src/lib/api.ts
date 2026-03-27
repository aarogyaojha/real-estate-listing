const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw error;
  }

  return res.json();
}

export interface ListingFilters {
  suburb?: string;
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
