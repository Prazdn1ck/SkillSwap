# ⚡ SkillSwap

A platform for skill exchange between users.
Users specify what they know (e.g. Python) and what they want to learn (e.g. JavaScript),
and can find each other and send contact requests.

## Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB + Mongoose

---

## ▶️ Quick Start

### Prerequisites
1. **Node.js 18+** — https://nodejs.org
2. **MongoDB** (pick one):
   - **Local**: install from https://www.mongodb.com/docs/manual/installation/ and run `mongod`
   - **Cloud (easier)**: create a free cluster at https://cloud.mongodb.com, copy the connection URI, and paste it into `backend/.env`

### Run the project

```bash
# From the skill-exchange/ root folder:
./start.sh
```

That's it. The script installs deps and starts both servers.

Then open: **http://localhost:5173**

---

## Manual start (if you prefer)

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

---

## Configure MongoDB (optional)

Edit `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillswap   ← local
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/skillswap  ← Atlas
JWT_SECRET=skillswap_secret_key_change_in_production
```

---

## Project structure

```
skill-exchange/
├── start.sh                  ← run this to start everything
├── backend/
│   ├── .env                  ← config (port, mongo URI, JWT secret)
│   └── src/
│       ├── index.ts          ← Express app entry point
│       ├── models/
│       │   ├── User.ts       ← User schema
│       │   └── Request.ts    ← Request schema (pending/accepted/rejected)
│       ├── middleware/
│       │   └── auth.ts       ← JWT verification
│       └── routes/
│           ├── auth.ts       ← POST /register, POST /login
│           ├── users.ts      ← GET /users, GET /users/:id, PUT /users/profile
│           └── requests.ts   ← POST /requests, GET /requests, PUT /requests/:id
└── frontend/
    └── src/
        ├── api/client.ts         ← All API calls (Axios)
        ├── context/AuthContext.tsx ← Global auth state
        ├── components/
        │   ├── Navbar.tsx
        │   ├── UserCard.tsx
        │   └── styles.ts
        └── pages/
            ├── LoginPage.tsx
            ├── RegisterPage.tsx
            ├── ProfilePage.tsx
            ├── UsersPage.tsx     ← Filter + Send Request modal
            └── RequestsPage.tsx  ← Accept / Reject incoming requests
```
