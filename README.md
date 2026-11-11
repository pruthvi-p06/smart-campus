# SmartCampus – Campus Issue & Resource Management

SmartCampus provides separate student, staff and administrator workspaces for reporting, assigning and resolving campus issues, managing resources, and viewing operational information.

## Run the application

### Backend
1. Open a terminal in the `backend` folder.
2. Install dependencies with `npm install`.
3. Create `backend/.env` using `.env.example` as a reference. Set your MongoDB connection string, JWT secret, and frontend URL. Keep real credentials out of source control.
4. Start the API with `npm run dev`. The default API port is `5000`.

### Frontend
1. Open a second terminal in the project root.
2. Install dependencies with `npm install`.
3. Start Vite with `npm run dev`.
4. Open the local URL printed by Vite.

## Website account registration

All accounts are created through the website. The registration form supports Student, Staff and Administrator roles. Administrator registration is also available at `/admin/create-account`; administrators sign in at `/admin/login`. All roles use the same `POST /api/auth/register` endpoint and the same password hashing and duplicate-email validation. There are no seeded administrator credentials, command-line account creation scripts, setup keys, or first-admin bootstrap endpoints.

**Access-control warning:** because public administrator self-registration is enabled as requested, anyone who can reach the website can create an administrator account. This is suitable for a trusted classroom/demo environment, but not a public production deployment.

## Important configuration

- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: use a long, random secret in any deployed environment.
- `CLIENT_URL`: frontend origin allowed by backend CORS.
- `GEMINI_API_KEY`: optional; keep it on the backend only.

Do not commit `.env` files or share API keys.


## Final setup notes

- Student and Staff accounts are created through the website registration page.
- Admin accounts need the `ADMIN_INVITE_CODE` from `backend/.env` (entered on the *Create admin account* page). If it is empty, admin self-registration is disabled; use `node createAdmin.js` or ask an existing admin to create the account.
- Registration creates the account in MongoDB and signs the user in immediately.
- The project does not create default/demo accounts, sample issues, sample resources or sample notifications.
- `backend/seed.js` is intentionally a safe no-op; it does not erase or populate your database.
- Copy `backend/.env.example` to `backend/.env` and fill in `MONGO_URI`, a strong `JWT_SECRET` (16+ chars) and `ADMIN_INVITE_CODE`. The server refuses to start without MONGO_URI / JWT_SECRET. Never commit or share `.env`.
- Requires Node.js 18 or newer.
- The first run starts with empty dashboards until users submit issues or an administrator creates resources.
- Local frontend ports 5173 and 5174 are allowed by the backend CORS configuration.

### Run locally (Windows PowerShell)

Terminal 1:
```powershell
cd backend
npm install
npm run dev
```

Terminal 2 (project root):
```powershell
npm install
npm run dev
```

Open the Vite URL printed in Terminal 2.
