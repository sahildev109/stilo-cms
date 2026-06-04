# CMS Assignment

Full-stack CMS with post versioning, visual diff, and full-text search.

## Live URLs

- Frontend: https://cms-assignment.vercel.app
- Backend API: https://cms-assignment.up.railway.app/api

## Seeded Credentials

| Name       | Email                 | Password     |
|------------|-----------------------|--------------|
| Alice Chen | alice@example.com     | Password123! |
| Bob Tanaka | bob@example.com       | Password123! |

## Local Setup

### Prerequisites

- Node.js 20+, PostgreSQL 15+

### Backend

```bash
cd backend
cp .env.example .env # fill in DATABASE_URL
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env # set VITE_API_URL=http://localhost:8080/api
npm install
npm run dev
```

## Features

- JWT authentication (register / login / refresh / logout)
- Rich text editing with BlockNote (JSON storage)
- Immutable post version history
- Block-level visual diff between any two versions
- PostgreSQL full-text search with highlighted snippets
- Version restore (creates new version, preserves history)
