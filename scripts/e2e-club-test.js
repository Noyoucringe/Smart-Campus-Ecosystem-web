#!/usr/bin/env node
(async function(){
  const API_BASE = process.env.API_BASE || 'http://localhost:3001';
  const TOKEN = process.env.TOKEN || process.env.CLUBS_TOKEN;
  if (!TOKEN) {
    console.warn('No TOKEN provided. This script requires a JWT in the TOKEN env var to call protected endpoints.');
    console.warn('Set TOKEN and rerun, e.g. (PowerShell): $env:TOKEN="<jwt>"; node scripts/e2e-club-test.js');
    process.exit(1);
  }

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` };

  try {
    console.log('Creating club...');
    const createRes = await fetch(`${API_BASE}/api/clubs`, { method: 'POST', headers, body: JSON.stringify({ name: 'E2E Test Club', description: 'Created by e2e script', category: 'Test', color: 'primary' }) });
    const created = await createRes.json();
    if (!createRes.ok) throw new Error(JSON.stringify(created));
    console.log('Created:', created);

    const id = created._id || created.id;
    console.log('Joining club id=', id);
    const joinRes = await fetch(`${API_BASE}/api/clubs/${id}/join`, { method: 'POST', headers });
    const joined = await joinRes.json();
    if (!joinRes.ok) throw new Error(JSON.stringify(joined));
    console.log('Joined:', joined);

    console.log('Done.');
  } catch (err) {
    console.error('E2E failed:', err);
    process.exitCode = 2;
  }
})();
