import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Boxes, Brain, Compass } from 'lucide-react';
import { AuthControls } from '@/features/auth/AuthControls';
import { realWorldExampleModules } from '@/lib/real-world-examples';

const difficultyOrder = ['Basic', 'Easy', 'Medium', 'Hard'] as const;

const decisionCheatsheet = [
  {
    title: 'Use Redis when',
    points: ['Reads are hot and repetitive', 'Latency target is very low', 'Data can be rebuilt from DB/events', 'Counters, sessions, rankings, or feeds need fast access'],
  },
  {
    title: 'Use a queue when',
    points: ['Work is slow or retryable', 'Traffic arrives in bursts', 'User response should stay fast', 'Emails, analytics, fanout, crawling, or transcoding can happen later'],
  },
  {
    title: 'Use search index when',
    points: ['Users search/filter text', 'Prefix/autocomplete is needed', 'Ranking matters', 'Database LIKE queries become slow'],
  },
  {
    title: 'Use object storage when',
    points: ['Data is large binary/text content', 'Files/videos/images need cheap durability', 'Downloads should go through CDN', 'Metadata and bytes should scale separately'],
  },
  {
    title: 'Use fallback systems when',
    points: ['External providers can fail', 'Cache can be stale but useful', 'Queue workers can lag', 'Graceful degradation is better than full outage'],
  },
  {
    title: 'Avoid this mistake',
    points: ['Do not pick tools before requirements', 'Do not cache source-of-truth only in Redis', 'Do not make slow work synchronous', 'Do not ignore idempotency for payments/orders'],
  },
];

export default function RealWorldExamplesPage() {
  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <nav className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-panel/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand shadow-glow">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-white">System Design with Real World Examples</div>
              <div className="text-xs text-slate-400">Blog-style real systems + decisions + quizzes</div>
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
            <p className="mb-5 inline-flex rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-sm text-cyan-200">Section 2 · Real product examples</p>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-white md:text-7xl">
              Read real-world system design blogs with decision-based learning.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Each blog explains a real product system, the requirements, the architecture, the database model, and most importantly the decisions: why this design is correct, what wrong direction beginners take, and how to correct it.
            </p>
          </div>
          <div className="glass rounded-[2rem] p-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-ink/80 p-5">
              <p className="text-sm text-slate-400">Learning format</p>
              <h2 className="mt-1 text-2xl font-black text-white">Every example includes</h2>
              <div className="mt-5 space-y-3">
                {['Real product story', 'Requirements', 'Architecture', 'DB modelling', 'Decision corrections', 'Failure fallback + quiz'].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan/15 text-sm font-bold text-cyan">{index + 1}</div>
                    <div className="font-semibold text-white">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-cyan/20 bg-cyan/10 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan/15 text-cyan">
            <Compass className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan">Decision-based learning</p>
          <h2 className="mt-2 text-3xl font-black text-white">Learn why a design decision is correct</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ['1. Product story', 'Understand where the system appears in real companies and what users expect from it.'],
              ['2. Requirements', 'Separate user-visible features from scale, latency, availability, durability, security, and cost needs.'],
              ['3. Storage choices', 'Learn why teams choose SQL, NoSQL, search indexes, object storage, Redis, queues, or streams.'],
              ['4. Wrong direction', 'See common beginner mistakes like caching source-of-truth data, synchronous slow work, or ignoring idempotency.'],
              ['5. Correction', 'Each blog explains the safer production decision and the reason behind it.'],
              ['6. Fallback systems', 'Learn graceful degradation: stale cache, provider fallback, retries, DLQ, circuit breakers, and runbooks.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <h3 className="font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-3xl p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan/15 text-cyan">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan">Quick decision cheat sheet</p>
              <h2 className="mt-1 text-3xl font-black text-white">Grab the useful rules fast</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {decisionCheatsheet.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <h3 className="font-bold text-white">{item.title}</h3>
                <ul className="mt-3 space-y-2">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-2 text-sm leading-6 text-slate-300">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" /> {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan/15 text-cyan">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan">Learning roadmap</p>
              <h2 className="mt-1 text-3xl font-black text-white">Start easy, then move to harder systems</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {difficultyOrder.map((difficulty) => {
              const systems = realWorldExampleModules.filter((module) => module.difficulty === difficulty);
              return (
                <a key={difficulty} href={`#${difficulty.toLowerCase()}`} className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:-translate-y-1 hover:border-cyan/40">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-black text-white">{difficulty}</h3>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-cyan">{systems.length}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {difficulty === 'Basic' && 'Small systems to build confidence with APIs, storage, and cache.'}
                    {difficulty === 'Easy' && 'Core backend systems with practical production decisions.'}
                    {difficulty === 'Medium' && 'Multi-component product systems with correctness and scale.'}
                    {difficulty === 'Hard' && 'Large-scale distributed systems with serious trade-offs.'}
                  </p>
                </a>
              );
            })}
          </div>
        </section>

        <section className="pb-12">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan">Examples</p>
            <h2 className="mt-2 text-3xl font-black text-white">25 real-world system design blogs</h2>
          </div>
          <div className="space-y-10">
            {difficultyOrder.map((difficulty) => {
              const systems = realWorldExampleModules.filter((module) => module.difficulty === difficulty);
              return (
                <div key={difficulty} id={difficulty.toLowerCase()} className="scroll-mt-8">
                  <div className="mb-4 flex items-end justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-black text-white">{difficulty}</h3>
                      <p className="mt-1 text-sm text-slate-400">Decision-based blogs for {difficulty.toLowerCase()} level systems.</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-cyan">{systems.length} systems</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {systems.map((module) => (
                      <Link key={module.slug} href={`/system-design-real-world-examples/${module.slug}`} className="group glass rounded-3xl p-5 transition hover:-translate-y-1 hover:border-cyan/40">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan/15 text-sm font-black text-cyan">{module.order}</div>
                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300">{module.difficulty}</span>
                        </div>
                        <h3 className="mt-5 text-xl font-black text-white">{module.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{module.summary}</p>
                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan group-hover:text-cyan-100">
                          Read blog <ArrowRight className="h-4 w-4" />
                        </div>
                      </Link>
                    ))}
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
