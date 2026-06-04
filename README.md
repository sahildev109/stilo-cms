# Stilo - CMS [ [Live](https://stilo-cms.vercel.app/) ]

Full-stack CMS with post versioning, visual diff, and full-text search.

Built with: **Node.js · Express · PostgreSQL (Neon) · React · TypeScript · Tailwind CSS**

## Table of Contents

- [Live URLs](#live-urls)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Seeded Credentials](#seeded-credentials)
- [Local Setup](#local-setup)
- [API Documentation](#api-documentation)
- [Author](#author)

## Live URLs

- Frontend: https://stilo-cms.vercel.app/
- Backend API: https://stilo-cms.onrender.com/api

## Tech Stack

| Layer | Choice & Reason |
| :--- | :--- |
| **Runtime** | Node.js 20 LTS - stable, async-first, broad ecosystem |
| **Framework** | Express 5 + express-async-errors - minimal, predictable |
| **ORM** | Sequelize 6 with sequelize-cli migrations |
| **Database** | PostgreSQL 15 (Neon) - native full-text search (tsvector), JSONB |
| **Auth** | JWT (access 15 min) + refresh token rotation (7 days, stored in DB) |
| **Rich Text** | BlockNote (Tiptap/ProseMirror core) - JSON-native, headless |
| **Diff Engine** | fast-diff on extracted plain text + node-level tree diff on JSON blocks |
| **Frontend** | React 18 + TypeScript + Vite, TailwindCSS, React Query, React Router v6 |
| **Deployment** | Render (Backend) + Neon (Postgres) + Vercel (Frontend) |

## Features

- JWT authentication (register / login / refresh / logout)
- Rich text editing with BlockNote (JSON storage)
- Immutable post version history
- Block-level visual diff between any two versions
- PostgreSQL full-text search with highlighted snippets
- Version restore (creates new version, preserves history)


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



## API Documentation

### Authentication (`/api/auth`)
| Method | Path | Description | Access |
|---|---|---|---|
| POST | `/register` | Hash password, create user, return tokens | Public |
| POST | `/login` | Verify credentials, issue access + refresh tokens | Public |
| POST | `/refresh` | Validate refresh token, rotate it, return new access token | Public |
| POST | `/logout` | Delete refresh token from DB | Public |

### Posts (`/api/posts`)
| Method | Path | Description | Access |
|---|---|---|---|
| GET | `/` | List all published posts | Public |
| GET | `/me` | List all posts (including drafts) for the logged-in user | Authenticated |
| GET | `/:slug` | Get a specific post by slug | Public (published) / Author (drafts) |
| POST | `/` | Create a new post | Authenticated |
| PUT | `/:id` | Update a post (creates a new version) | Authenticated + Author |
| PATCH| `/:id/status` | Toggle post status (draft/published) | Authenticated + Author |
| DELETE| `/:id` | Delete a post | Authenticated + Author |

### Post Versions (`/api/posts/:postId/versions`)
| Method | Path | Description | Access |
|---|---|---|---|
| GET | `/` | List all versions of a post | Authenticated + Author |
| GET | `/:versionId` | Get a specific version (includes full content JSON) | Authenticated + Author |
| POST | `/:versionId/restore` | Restore a historical version (creates a new version) | Authenticated + Author |

### Search (`/api/search`)
| Method | Path | Description | Access |
|---|---|---|---|
| GET | `/?q=<query>&page=1&limit=10` | Full-text search on published posts with highlighted snippets | Public |

---

## Author

## Built by **Sahil Salap** — a passionate full-stack developer with a love for clean architecture and scalable design. Always eager to learn new technologies and solve complex problems.
## Email: sahilsalap75@gmail.com
## Phone: 8850306843
## GitHub: [github.com/sahildev109](https://github.com/sahildev109)
## LinkedIn: [linkedin.com/in/sahilsalap](https://www.linkedin.com/in/sahilsalap)