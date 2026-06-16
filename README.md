# Presbyterian Church of Vanuatu (PCV)

A web application for managing churches, pastors, events, news, and reports across the Presbyterian Church of Vanuatu.

**Development started:** Tuesday, 1 June 2026

## Features

### Public site
- **Home** — Hero, quick links, and latest media releases
- **Churches** — Interactive map (OpenStreetMap) with church directory cards
- **Pastors** — Searchable pastor directory with filters
- **Calendar** — Monthly event calendar with category and province filters
- **Events** — Upcoming events list
- **News** — Media releases with search
- **Church Programs** — Fellowship and education programs
- **Contact** — Contact form and office details
- **Global search** — Search churches, pastors, news, and events

### Staff portal (`/staff`)
- Secure login for administrators
- **Churches** — Add, edit, and delete churches with map location picker
- **Pastors** — Full CRUD with church assignment
- **Reports** — Upload and download PDF, Excel, and Word reports
- **News** — Create, publish, and manage media releases
- **Events** — Schedule and manage events

### Planned
- **Email** — Contact form and notification emails (not yet wired up)

## Getting started

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Staff login (demo)
| Field    | Value            |
|----------|------------------|
| Email    | `admin@pcv.vu`   |
| Password | `admin123`       |

## Scripts

| Command            | Description              |
|--------------------|--------------------------|
| `npm run dev`      | Start development server |
| `npm run build`    | Production build         |
| `npm run start`    | Start production server  |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed`  | Seed sample data         |

## Tech stack

- **Next.js 15** — App Router, Server Actions
- **TypeScript**
- **Tailwind CSS 4**
- **SQLite** + **Drizzle ORM**
- **Leaflet** — Church maps
- **bcryptjs** — Password hashing

## Data storage

| Path               | Purpose                    |
|--------------------|----------------------------|
| `data/pcv.db`      | SQLite database            |
| `uploads/reports/` | Uploaded report files      |

## Project structure

```
src/
├── app/           # Pages and API routes
│   ├── staff/     # Admin portal
│   └── api/       # Report downloads, etc.
├── components/    # UI components (map, nav, etc.)
└── lib/           # Database, auth, actions, utilities
```

## Repository

https://github.com/pnamak/pcv
