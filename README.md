# 🎓 CollegeHub – College Discovery & Decision Platform

A full-stack web application to search, compare, and save colleges across India.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (jsonwebtoken) |
| State | Zustand + SWR |
| Validation | Zod + React Hook Form |

---

## 📁 Project Structure

```
college-platform/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # DB schema
│   │   └── seed.ts             # 40 colleges seed data
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Auth + error handling
│   │   ├── routes/             # Express routers
│   │   ├── services/           # Business logic + DB queries
│   │   ├── utils/              # Prisma client singleton
│   │   └── index.ts            # Express app entry
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   │   ├── page.tsx        # College listing (home)
│   │   │   ├── colleges/[id]/  # College detail
│   │   │   ├── compare/        # Side-by-side compare
│   │   │   ├── auth/           # Login & Register
│   │   │   └── saved/          # Saved colleges
│   │   ├── components/         # Reusable UI components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Axios API client
│   │   ├── store/              # Zustand stores
│   │   └── types/              # Shared TypeScript types
│   ├── .env.local.example
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or cloud)

### Step 1 – Clone & Install

```bash
# Install root dependencies (concurrently)
npm install

# Install backend & frontend packages
npm run setup
```

### Step 2 – Backend Setup

```bash
cd backend

# Copy and fill environment variables
cp .env.example .env
# Edit .env → set DATABASE_URL and JWT_SECRET

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with 40 colleges + demo user
npm run db:seed
```

### Step 3 – Frontend Setup

```bash
cd frontend

# Copy and fill environment variables
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000 (default, no change needed for local)
```

### Step 4 – Run Dev Servers

From the root directory:
```bash
npm run dev
```

Or individually:
```bash
# Terminal 1 – Backend on port 5000
cd backend && npm run dev

# Terminal 2 – Frontend on port 3000
cd frontend && npm run dev
```

### Step 5 – Open the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Prisma Studio: `cd backend && npm run db:studio`

### Demo Login
- Email: `demo@college.com`
- Password: `password123`

---

## 🌐 API Reference

### Colleges
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/colleges` | List with filters, search, sort, pagination |
| GET | `/api/colleges/states` | All distinct states |
| GET | `/api/colleges/:id` | Single college with courses + reviews |

**Query params for GET /api/colleges:**
- `search` – search by name/location
- `state` – filter by state
- `minFees`, `maxFees` – fee range filter
- `sortBy` – `rating` | `fees_asc` | `fees_desc` | `name`
- `page`, `limit` – pagination

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user (auth required) |

### Saved Colleges (auth required)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/saved` | Get user's saved colleges |
| POST | `/api/saved` | Save a college `{ collegeId }` |
| DELETE | `/api/saved/:collegeId` | Remove saved college |

### Compare
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/compare` | Compare colleges `{ ids: string[] }` |

---

## ☁️ Deployment

### Database (Neon – Free PostgreSQL)
1. Go to https://neon.tech → Create project
2. Copy the connection string
3. Set `DATABASE_URL` in backend `.env`

### Backend (Render)
1. Push your code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your repo, set root directory to `backend`
4. Build command: `npm install && npm run build && npx prisma generate && npx prisma db push && npm run db:seed`
5. Start command: `npm start`
6. Add env vars: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `NODE_ENV=production`

### Frontend (Vercel)
1. Go to https://vercel.com → Import GitHub repo
2. Set root directory to `frontend`
3. Add env var: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
4. Deploy!

---

## 🔐 Authentication Flow

1. User submits login/register form
2. Backend validates, hashes password (bcrypt), creates JWT
3. Frontend stores `token` + `user` in `localStorage`
4. Axios interceptor attaches `Bearer <token>` to every request
5. Backend `authenticate` middleware verifies JWT on protected routes
6. On 401, frontend clears stored auth and redirects

## 🔄 Compare Feature

1. User clicks compare icon (⇄) on any college card
2. Zustand `compareStore` (persisted to localStorage) holds 2-3 colleges
3. Floating `CompareBar` appears at bottom with selected colleges
4. On `/compare` page, IDs are POSTed to `/api/compare`
5. Backend fetches full college data and returns ordered array
6. Table highlights the "best" value per row in green

---

## 🎨 Features
- ✅ 40 real Indian colleges with seed data
- ✅ Search + filter + sort + pagination
- ✅ College detail page with tabs (Overview, Courses, Placements, Reviews)
- ✅ Compare 2–3 colleges side by side with best-value highlighting
- ✅ JWT Auth (Register/Login)
- ✅ Save/unsave colleges (requires login)
- ✅ Floating compare bar
- ✅ Skeleton loaders + empty states
- ✅ Fully responsive (mobile-first)
- ✅ Toast notifications
