This repository contains a monorepo with frontend and backend in the same tree.

If you'd like to split them into two repositories (recommended for separate deploys on Render),
you can use the convenience PowerShell scripts in `scripts/`:

- `scripts/export_frontend.ps1` — exports the frontend to a sibling folder named `smart-campus-frontend`, copies only the frontend files, and initializes a git repo there.
- `scripts/export_backend.ps1` — exports the backend/server to a sibling folder named `smart-campus-backend` and initializes a git repo there.

Usage (PowerShell):

1. From the monorepo root run:

   pwsh ./scripts/export_frontend.ps1
   pwsh ./scripts/export_backend.ps1

2. Each script creates a new directory next to this repository (one level up). It will initialize a git repo and create an initial commit.

3. To publish to GitHub, `cd` into the exported folder and add your remote, then push:

   cd ../smart-campus-frontend
   git remote add origin https://github.com/<you>/<frontend-repo>.git
   git push -u origin main

   cd ../smart-campus-backend
   git remote add origin https://github.com/<you>/<backend-repo>.git
   git push -u origin main

Render deployment notes
- Deploy the backend (`smart-campus-backend`) as a Web Service on Render (Node). Provide environment variables: `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GMAIL_USER`, `GMAIL_PASS`, `ALLOWED_EMAIL_DOMAIN`.
- Deploy the frontend (`smart-campus-frontend`) as a Static Site on Render. Set `VITE_API_BASE` to your backend's URL and `VITE_GOOGLE_CLIENT_ID`.

Security note
- The export scripts are convenience tools for developer workflow. Review the exported folders before pushing to a remote. Remove any secrets from files (e.g., `.env`) before publishing.
