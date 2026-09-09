import Link from 'next/link';
import { ArrowLeft, ArrowRight, ClipboardList, PlayCircle, Signal } from 'lucide-react';
import { AuthControls } from '@/features/auth/AuthControls';

type Difficulty = 'Beginner' | 'Core' | 'Intermediate' | 'Advanced';

type PracticeProblem = {
  title: string;
  difficulty: Difficulty;
  status: 'Live now' | 'Coming soon';
  description: string;
  href: string;
  topics: string[];
};

const practiceProblems: PracticeProblem[] = [
  {
    title: 'URL Shortener',
    difficulty: 'Beginner',
    status: 'Live now',
    description: 'Design the request path from clients to API Gateway, backend services, Redis cache, and PostgreSQL. Run the simulator, find bottlenecks, and improve the architecture.',
    href: '/challenges/url-shortener',
    topics: ['API Gateway', 'Load balancing', 'Caching', 'Database capacity', 'Scoring'],
  },
  {
    title: 'Rate Limiter',
    difficulty: 'Core',
    status: 'Coming soon',
    description: 'Design per-user, per-IP, and global limits using token bucket, sliding window counters, Redis, and clear 429 behavior.',
    href: '#',
    topics: ['Token bucket', 'Redis counters', 'Sliding window', 'Abuse prevention'],
  },
  {
    title: 'Twitter / X Feed',
    difficulty: 'Advanced',
    status: 'Coming soon',
    description: 'Design timelines, fanout-on-write/read, ranking, media metadata, celebrity accounts, caching, and feed freshness trade-offs.',
    href: '#',
    topics: ['Fanout', 'Ranking', 'Timeline cache', 'Hot users'],
  },
  {
    title: 'Notification Service',
    difficulty: 'Core',
    status: 'Coming soon',
    description: 'Design email, SMS, and push notification delivery with queues, workers, retries, templates, user preferences, and provider failover.',
    href: '#',
    topics: ['Queues', 'Workers', 'Retries', 'DLQ'],
  },
  {
    title: 'Ride Sharing Location',
    difficulty: 'Advanced',
    status: 'Coming soon',
    description: 'Design real-time driver location ingestion, geo-indexing, nearby driver search, map updates, and high-write streaming pipelines.',
    href: '#',
    topics: ['Geo indexing', 'Streams', 'WebSockets', 'High writes'],
  },
  {
    title: 'Distributed Cache',
    difficulty: 'Advanced',
    status: 'Coming soon',
    description: 'Design a Redis-like cache with consistent hashing, replication, eviction, hot key handling, failover, and cache consistency choices.',
    href: '#',
    topics: ['Consistent hashing', 'Eviction', 'Replication', 'Hot keys'],
  },
  {
    title: 'Search Autocomplete',
    difficulty: 'Intermediate',
    status: 'Coming soon',
    description: 'Design low-latency typeahead suggestions using tries, prefix indexes, ranking signals, caching, and near-real-time index updates.',
    href: '#',
    topics: ['Prefix index', 'Ranking', 'Caching', 'Index refresh'],
  },
  {
    title: 'Video Streaming Service',
    difficulty: 'Advanced',
    status: 'Coming soon',
    description: 'Design upload, transcoding, storage, CDN delivery, adaptive bitrate playback, metadata, recommendations, and global scale.',
    href: '#',
    topics: ['Transcoding', 'CDN', 'Object storage', 'ABR'],
  },
  {
    title: 'Messaging App / Chat',
    difficulty: 'Intermediate',
    status: 'Coming soon',
    description: 'Design one-to-one and group chat with WebSockets, message persistence, delivery acknowledgements, ordering, and offline sync.',
    href: '#',
    topics: ['WebSockets', 'Ordering', 'Presence', 'Offline sync'],
  },
  {
    title: 'Web Crawler',
    difficulty: 'Advanced',
    status: 'Coming soon',
    description: 'Design URL frontier, politeness rules, robots.txt handling, deduplication, distributed workers, parsing, and crawl freshness.',
    href: '#',
    topics: ['URL frontier', 'Deduplication', 'Workers', 'Politeness'],
  },
  {
    title: 'Code / Text Sharing like Pastebin',
    difficulty: 'Beginner',
    status: 'Coming soon',
    description: 'Design paste creation, custom or generated IDs, expiration, privacy settings, syntax-highlight metadata, and read-heavy access.',
    href: '#',
    topics: ['ID generation', 'TTL', 'Read-heavy', 'Abuse controls'],
  },
  {
    title: 'Concert Ticket Sale',
    difficulty: 'Advanced',
    status: 'Coming soon',
    description: 'Design high-demand ticket inventory, waiting rooms, fairness, reservations, payment flow, anti-bot controls, and oversell prevention.',
    href: '#',
    topics: ['Inventory locks', 'Waiting room', 'Payments', 'Anti-bot'],
  },
  {
    title: 'Distributed ID Generator',
    difficulty: 'Core',
    status: 'Coming soon',
    description: 'Design unique sortable IDs using Snowflake-style workers, timestamp bits, sequence numbers, clock drift handling, and availability trade-offs.',
    href: '#',
    topics: ['Snowflake', 'Clock drift', 'Sequences', 'Uniqueness'],
  },
  {
    title: 'Real-time Leaderboard',
    difficulty: 'Intermediate',
    status: 'Coming soon',
    description: 'Design score updates, top-K queries, rank lookup, Redis sorted sets, sharding, season resets, and real-time client updates.',
    href: '#',
    topics: ['Sorted sets', 'Top-K', 'Sharding', 'Real-time updates'],
  },
  {
    title: 'File Storage Service',
    difficulty: 'Intermediate',
    status: 'Coming soon',
    description: 'Design upload/download APIs, object storage, metadata database, permissions, resumable upload, deduplication, and sharing links.',
    href: '#',
    topics: ['Object storage', 'Metadata', 'Permissions', 'Resumable upload'],
  },
];

const difficulties: Difficulty[] = ['Beginner', 'Core', 'Intermediate', 'Advanced'];

const difficultyStyles: Record<Difficulty, string> = {
  Beginner: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
  Core: 'border-cyan/30 bg-cyan/10 text-cyan-100',
  Intermediate: 'border-amber-400/30 bg-amber-500/10 text-amber-100',
  Advanced: 'border-rose-400/30 bg-rose-500/10 text-rose-100',
};

const difficultyDescriptions: Record<Difficulty, string> = {
  Beginner: 'Start here: clean requirements, APIs, basic storage, caching, and simple scale.',
  Core: 'Common interview building blocks: rate limits, queues, IDs, consistency, and reliability.',
  Intermediate: 'Multi-component systems with real-time reads/writes, ranking, permissions, and sharding concerns.',
  Advanced: 'Large-scale distributed systems with hot partitions, global scale, streaming, and hard correctness trade-offs.',
};

export default function PracticeProblemsPage() {
  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <nav className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-panel/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand shadow-glow">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-white">Practice Problems</div>
              <div className="text-xs text-slate-400">Hands-on system design labs and simulators</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AuthControls />
            <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
          </div>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-sm text-cyan-200">
              <PlayCircle className="h-4 w-4" /> Learn by doing
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-white md:text-7xl">
              Practice problems live here.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Keep the learning tracks clean and put product-specific hands-on labs in this section. Start with the live URL Shortener simulator, then move through beginner, core, intermediate, and advanced design problems.
            </p>
          </div>
          <div className="glass rounded-[2rem] p-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-ink/80 p-5">
              <p className="text-sm text-slate-400">Practice format</p>
              <h2 className="mt-1 text-2xl font-black text-white">Each problem should include</h2>
              <div className="mt-5 space-y-3">
                {['Requirements', 'Architecture canvas', 'Simulation or rubric', 'Bottleneck feedback', 'Improvement loop'].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan/15 text-sm font-bold text-cyan">{index + 1}</div>
                    <div className="font-semibold text-white">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan/15 text-cyan">
              <Signal className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan">Difficulty section</p>
              <h2 className="text-2xl font-black text-white">Pick problems by difficulty</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {difficulties.map((difficulty) => {
              const count = practiceProblems.filter((problem) => problem.difficulty === difficulty).length;
              return (
                <a key={difficulty} href={`#${difficulty.toLowerCase()}`} className={`rounded-3xl border p-4 transition hover:-translate-y-1 ${difficultyStyles[difficulty]}`}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-black">{difficulty}</h3>
                    <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs font-bold">{count} problems</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 opacity-90">{difficultyDescriptions[difficulty]}</p>
                </a>
              );
            })}
          </div>
        </section>

        <section className="pb-12">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan">Problem list</p>
            <h2 className="mt-2 text-3xl font-black text-white">Hands-on labs</h2>
          </div>

          <div className="space-y-10">
            {difficulties.map((difficulty) => {
              const problems = practiceProblems.filter((problem) => problem.difficulty === difficulty);
              return (
                <div key={difficulty} id={difficulty.toLowerCase()} className="scroll-mt-8">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-white">{difficulty} problems</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{difficultyDescriptions[difficulty]}</p>
                    </div>
                    <span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${difficultyStyles[difficulty]}`}>{problems.length} problems</span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {problems.map((problem) => {
                      const isLive = problem.href !== '#';
                      const content = (
                        <>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/20 text-sm font-black text-violet-100">Lab</div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300">{problem.status}</span>
                              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${difficultyStyles[problem.difficulty]}`}>{problem.difficulty}</span>
                            </div>
                          </div>
                          <h3 className="mt-5 text-xl font-black text-white">{problem.title}</h3>
                          <p className="mt-3 text-sm leading-6 text-slate-300">{problem.description}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {problem.topics.map((topic) => (
                              <span key={topic} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300">{topic}</span>
                            ))}
                          </div>
                          <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan group-hover:text-cyan-100">
                            {isLive ? 'Start problem' : 'Coming soon'} {isLive && <ArrowRight className="h-4 w-4" />}
                          </div>
                        </>
                      );

                      return isLive ? (
                        <Link key={problem.title} href={problem.href} className="group glass rounded-3xl p-5 transition hover:-translate-y-1 hover:border-cyan/40">
                          {content}
                        </Link>
                      ) : (
                        <div key={problem.title} className="glass rounded-3xl p-5 opacity-75">
                          {content}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
