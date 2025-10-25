# Smart Campus Ecosystem

The Smart Campus Ecosystem is a comprehensive web and mobile platform designed to digitally integrate students, faculty, and administrative staff under a unified system. It facilitates real-time communication, efficient management of academic and campus activities, and promotes a sustainable, technology-driven environment.

Key capabilities:
- Student module: view schedules, assignments, attendance, course materials and grades, submit feedback and requests.
- Faculty module: upload materials, manage attendance and grades, send announcements.
- Admin module: manage users, departments, resources, facility bookings and generate analytics reports.
- Extras: campus map, smart notice board, IoT integrations, JWT / Google Sign-In, MongoDB Atlas integration.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f4966a6a-6bfb-4f05-8aaf-e96c231e74f1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Firebase & Local setup (quick guide)

1. Create a Firebase project at https://console.firebase.google.com/ and add a Web App.
   - In Project settings → General → Your apps → Add app (</>) to register a Web app.
   - Copy the firebaseConfig object shown in the SDK setup and use the values below.

2. Frontend env
   - Copy `.env.sample` to `.env` in the repo root and fill the VITE_FIREBASE_* values from the firebaseConfig.
   - Set `VITE_API_BASE` to your backend URL (e.g. `http://localhost:3001`).

3. Enable Google sign-in
   - In Firebase Console → Authentication → Sign-in method → Enable Google provider.
   - Add `localhost` and your dev origin (e.g. `http://localhost:5173`) to Authorized domains.

4. Backend service account
   - In Firebase Console → Project settings → Service accounts → Generate new private key (JSON).
   - Save the JSON as `server/serviceAccount.json` (add it to `.gitignore`).
   - Copy `server/.env.sample` to `server/.env` and set `FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccount.json`.
   - Set `JWT_SECRET` and `MONGO_URI` as required.

5. Start servers
   - Frontend (repo root): `npm install` then `npm run dev`
   - Backend (server folder): `cd server`, `npm install` then `npm run dev`

6. Test
   - Open the frontend URL printed by Vite. Use "Sign in with Google" (popup). The app will POST the
	 Firebase ID token to `/api/auth/firebase-login` and the backend will verify the token and return a JWT.

Security notes
   - Do not commit `server/serviceAccount.json` or any real secrets. `.env.sample` files are safe to commit.
   - Keep `JWT_SECRET` strong and rotate keys for production.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f4966a6a-6bfb-4f05-8aaf-e96c231e74f1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
