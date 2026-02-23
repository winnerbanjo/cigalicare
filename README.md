# CIGALI SaaS MVP Foundation

Production-grade MERN foundation for healthcare providers with clean architecture and role-based security.

## Monorepo Structure

- `/Users/oyekunle/Documents/cigali-app/backend` - Express + TypeScript + MongoDB API
- `/Users/oyekunle/Documents/cigali-app/frontend` - React + Vite + TypeScript + Tailwind UI

## Backend Highlights

- Layered architecture: `models -> services -> controllers -> routes`
- JWT authentication and auth middleware
- Role-based authorization middleware (`doctor`, `pharmacy`, `admin`)
- Patient ownership enforcement (provider-bound data access)
- Appointment CRUD with patient ownership checks
- Pharmacy inventory module foundation (add medication, track inventory, update stock)
- Provider public profile endpoint
- Centralized error handling and typed request user context

### Backend Setup

1. Copy `/Users/oyekunle/Documents/cigali-app/backend/.env.example` to `.env`
2. Install deps: `npm install`
3. Run dev server: `npm run dev`
4. API base: `http://localhost:5000/api/v1`

### Backend Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /providers/:id/public-profile`
- `POST /patients`
- `GET /patients`
- `GET /patients/:id`
- `PUT /patients/:id`
- `DELETE /patients/:id`
- `POST /appointments`
- `GET /appointments`
- `GET /appointments/:id`
- `PUT /appointments/:id`
- `DELETE /appointments/:id`
- `POST /medications`
- `GET /medications`
- `PUT /medications/:id`

## Frontend Highlights

- React Router with protected routes
- Zustand persisted auth/user store
- Axios instance with JWT interceptor
- Reusable UI components: Button, Input, Card, Modal, Table
- Pages: Login, Register, Dashboard, Patients, Appointments
- Apple/Google inspired clean SaaS layout (sidebar, top section, content canvas)

### Frontend Setup

1. Copy `/Users/oyekunle/Documents/cigali-app/frontend/.env.example` to `.env`
2. Install deps: `npm install`
3. Run app: `npm run dev`
4. Default app URL: `http://localhost:5173`

## Security Notes

- Passwords are hashed with bcrypt
- JWT secrets are environment-driven
- No hardcoded credentials or secrets in source
- Input shape and value checks in service layer
- Route-level auth + RBAC + ownership constraints
