# SystemDesign Lab

Interactive system design simulator MVP.

## Learning sections

The product is organized into four sections:

1. **System Design Essentials** - fundamentals like functional/non-functional requirements, frontend/backend APIs, API Gateway, load balancing, caching strategies, databases, replication, sharding, queues, rate limiting, consistency, observability, capacity estimation, latency, bottlenecks, and trade-offs.
2. **System Design with Real World Examples** - guided end-to-end product designs such as rate limiters, notification systems, file upload services, and news feeds.
3. **System Design Advanced** - distributed-system topics like sharding, replication, consistency, streams, multi-region routing, hot partitions, and disaster recovery.
4. **Practice Problems** - hands-on labs and simulators. Product-specific challenges such as the URL Shortener live here.

## MVP

The `/system-design-essentials` track contains module pages where each module includes concept explanation, simple diagram, live mini example, production example, interview question, and practice challenge.

The first live practice problem is a production-style URL Shortener architecture simulator. Users can read requirements, build a frontend-to-backend architecture, configure components, run a mathematical traffic simulation, discover bottlenecks, and receive educational feedback.

The URL Shortener flow focuses on frontend clients calling an API Gateway, the gateway routing/protecting/logging/rate-limiting public URL APIs, traffic being distributed across stateless backend URL service servers, Redis serving hot redirects, and PostgreSQL persisting URL mappings.

Authentication and progress tracking are scaffolded with NextAuth, Google/GitHub OAuth, Prisma, and SQLite for local development. Signed-in users get saved simulation runs, best score, challenge status, and a dashboard.

## Run the frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Fill GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET and/or GITHUB_ID/GITHUB_SECRET.
npm run db:push
npm run dev
```

Open http://localhost:3002

## Vercel deployment notes

This repo keeps the Next.js app inside `frontend/`. A root `vercel.json` is included so Vercel can install and build the frontend from the repo root.

Required environment variables on Vercel:

```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="https://your-vercel-domain.vercel.app"
NEXTAUTH_SECRET="generate-a-strong-secret"
```

OAuth variables are optional unless login is needed:

```bash
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_ID="..."
GITHUB_SECRET="..."
```

For sharing with other people, SQLite on Vercel is okay only for a demo without durable saved progress. For reliable auth/progress persistence, switch Prisma to a hosted database such as Postgres/Neon/Supabase before launch.

## Tech

- Next.js
- TypeScript
- Tailwind CSS
- React Flow
- Zustand
- NextAuth
- Prisma + SQLite

## Notes

This MVP uses a frontend-only mathematical simulation engine. It does not deploy infrastructure or create cloud resources yet; the simulator teaches production architecture decisions and trade-offs before real provisioning is added.
