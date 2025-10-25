const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3001';

async function handleRes(res: Response) {
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || res.statusText);
  }
  return res.json();
}

export async function fetchEvents() {
  const res = await fetch(`${API_BASE}/api/events`);
  return handleRes(res);
}

export async function fetchEvent(id: string | number) {
  const res = await fetch(`${API_BASE}/api/events/${id}`);
  return handleRes(res);
}

export async function createEvent(payload: any) {
  const res = await fetch(`${API_BASE}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

export async function registerEvent(id: string | number) {
  const res = await fetch(`${API_BASE}/api/events/${id}/register`, { method: 'POST' });
  return handleRes(res);
}

export async function fetchItems() {
  const res = await fetch(`${API_BASE}/api/lostfound`);
  return handleRes(res);
}

export async function createItem(payload: any) {
  const res = await fetch(`${API_BASE}/api/lostfound`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

export async function claimItem(id: string | number) {
  const res = await fetch(`${API_BASE}/api/lostfound/${id}/claim`, { method: 'POST' });
  return handleRes(res);
}

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Clubs
export async function fetchClubs() {
  const res = await fetch(`${API_BASE}/api/clubs`);
  return handleRes(res);
}

export async function createClub(payload: any) {
  const res = await fetch(`${API_BASE}/api/clubs`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(payload)
  });
  return handleRes(res);
}

export async function joinClub(id: string | number) {
  const res = await fetch(`${API_BASE}/api/clubs/${id}/join`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }
  });
  return handleRes(res);
}

export async function leaveClub(id: string | number) {
  const res = await fetch(`${API_BASE}/api/clubs/${id}/leave`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }
  });
  return handleRes(res);
}

export default {
  fetchEvents,
  fetchEvent,
  createEvent,
  registerEvent,
  fetchItems,
  createItem,
  claimItem,
};
