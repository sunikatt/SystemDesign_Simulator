import Link from 'next/link';
import { ArrowLeft, ArrowRight, Network } from 'lucide-react';
import { AuthControls } from '@/features/auth/AuthControls';
import { advancedModules } from '@/lib/advanced';

export default function AdvancedSystemDesignPage() {
  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <nav className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-panel/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand shadow-glow">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-white">System Design Advanced</div>
              <div className="text-xs text-slate-400">In-depth distributed systems theory</div>
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
            <p className="mb-5 inline-flex rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-sm text-cyan-200">Section 3 · Advanced depth</p>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-white md:text-7xl">
              Go deep into distributed systems trade-offs.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              These notes explain advanced concepts with detailed theory, mental models, diagrams, failure modes, interview prompts, and quizzes.
            </p>
          </div>
          <div className="glass rounded-[2rem] p-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-ink/80 p-5">
              <p className="text-sm text-slate-400">Advanced format</p>
              <h2 className="mt-1 text-2xl font-black text-white">Each topic includes</h2>
              <div className="mt-5 space-y-3">
                {['Core theory', 'Deep dives', 'Failure modes', 'Interview prompt', 'Key takeaways', 'Quiz'].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan/15 text-sm font-bold text-cyan">{index + 1}</div>
                    <div className="font-semibold text-white">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan">Advanced topics</p>
            <h2 className="mt-2 text-3xl font-black text-white">Distributed systems notes</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {advancedModules.map((module) => (
              <Link key={module.slug} href={`/system-design-advanced/${module.slug}`} className="group glass rounded-3xl p-5 transition hover:-translate-y-1 hover:border-cyan/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan/15 text-sm font-black text-cyan">{module.order}</div>
                <h3 className="mt-5 text-xl font-black text-white">{module.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{module.summary}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan group-hover:text-cyan-100">
                  Read advanced notes <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
