# SystemDesign Lab

Interactive system design simulator MVP.

## MVP

The first challenge is a URL Shortener architecture simulator. Users can read requirements, build a visual architecture, configure components, run a mathematical traffic simulation, discover bottlenecks, and receive educational feedback.

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

Open http://localhost:3000

## Tech

- Next.js
- TypeScript
- Tailwind CSS
- React Flow
- Zustand
- NextAuth
- Prisma + SQLite

## Notes

This MVP uses a frontend-only mathematical simulation engine. It does not deploy infrastructure or create cloud resources.
