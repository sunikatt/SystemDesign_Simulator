import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Layers3, Network } from 'lucide-react';
import { AuthControls } from '@/features/auth/AuthControls';
import { essentialsModules } from '@/lib/essentials';

export default function SystemDesignEssentialsPage() {
  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <nav className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-panel/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand shadow-glow">
              <Layers3 className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-white">SystemDesign Lab</div>
              <div className="text-xs text-slate-400">Track 1 · System Design Essentials</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AuthControls />
            <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
          </div>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-sm text-cyan-200">
              <BookOpen className="h-4 w-4" /> Foundation track with live examples
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-white md:text-7xl">
              Learn each system design essential with simple production examples.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Every module follows the same pattern: concept explanation, simple diagram, live mini example, production example, interview question, and a practice challenge. Start here before jumping into full system designs.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/system-design-essentials/${essentialsModules[0].slug}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-ink hover:bg-cyan-100">
                Start first module <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/practice-problems" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/10">
                Open practice problems
              </Link>
            </div>
          </div>

          <div className="glass rounded-[2rem] p-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-ink/80 p-5">
              <p className="text-sm text-slate-400">Essentials learning format</p>
              <h2 className="mt-1 text-2xl font-black text-white">Each module includes</h2>
              <div className="mt-5 space-y-3">
                {['Concept explanation', 'Simple diagram', 'Live mini example', 'Production example', 'Interview question', 'Practice challenge'].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan/15 text-sm font-bold text-cyan">{index + 1}</div>
                    <div className="font-semibold text-white">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan">Modules</p>
              <h2 className="mt-2 text-3xl font-black text-white">System Design Essentials curriculum</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-400">
              Simple examples first, production thinking next. After learning the essentials, apply them in the dedicated Practice Problems section.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {essentialsModules.map((module) => (
              <Link key={module.slug} href={`/system-design-essentials/${module.slug}`} className="group glass rounded-3xl p-5 transition hover:-translate-y-1 hover:border-cyan/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/20 text-sm font-black text-violet-100">{module.order}</div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300">{module.level}</span>
                </div>
                <h3 className="mt-5 text-xl font-black text-white">{module.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{module.summary}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan group-hover:text-cyan-100">
                  Learn module <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="pb-10">
          <div className="rounded-3xl border border-cyan/20 bg-cyan/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan/15 text-cyan">
                <Network className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">How this connects to live product labs</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  After learning a concept, apply it inside a real scenario. For example, learn API Gateway, load balancing, caching, database indexes, queues, and capacity estimation — then use them in hands-on practice problems.
                </p>
                <Link href="/practice-problems" className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-cyan-100">
                  Open practice problems <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
