import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, Layers3, PlayCircle, Signal } from 'lucide-react';
import { AuthControls } from '@/features/auth/AuthControls';
import { difficulties, difficultyDescriptions, difficultyStyles, practiceProblems, solveSteps } from '@/lib/practice-problems';

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
              <div className="text-xs text-slate-400">Hands-on system design labs, components, and solution guides</div>
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
              <PlayCircle className="h-4 w-4" /> Learn by solving
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-white md:text-7xl">
              Practice problems with components, APIs, DB design, and rubrics.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Each problem now includes the building blocks required to solve it: requirements, APIs, data model, architecture components, common mistakes, correct solution direction, scoring rubric, and quiz.
            </p>
          </div>
          <div className="glass rounded-[2rem] p-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-ink/80 p-5">
              <p className="text-sm text-slate-400">Practice format</p>
              <h2 className="mt-1 text-2xl font-black text-white">Each problem includes</h2>
              <div className="mt-5 space-y-3">
                {['Requirements', 'APIs + data model', 'Components to use', 'Common mistakes', 'Correct solution direction', 'Rubric + quiz'].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan/15 text-sm font-bold text-cyan">{index + 1}</div>
                    <div className="font-semibold text-white">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-cyan/20 bg-cyan/10 p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan/15 text-cyan">
              <Layers3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan">Problem solver kit</p>
              <h2 className="text-2xl font-black text-white">How every practice problem should be solved</h2>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {solveSteps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-cyan/15 text-sm font-black text-cyan">{index + 1}</div>
                <p className="text-sm font-semibold leading-6 text-white">{step}</p>
              </div>
            ))}
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
            <h2 className="mt-2 text-3xl font-black text-white">Hands-on labs and guided solution pages</h2>
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
                    {problems.map((problem) => (
                      <Link key={problem.slug} href={`/practice-problems/${problem.slug}`} className="group glass rounded-3xl p-5 transition hover:-translate-y-1 hover:border-cyan/40">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/20 text-sm font-black text-violet-100">Lab</div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300">{problem.status}</span>
                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${difficultyStyles[problem.difficulty]}`}>{problem.difficulty}</span>
                          </div>
                        </div>
                        <h3 className="mt-5 text-xl font-black text-white">{problem.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{problem.description}</p>
                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Components to use</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {problem.components.slice(0, 7).map((component) => (
                              <span key={component} className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs text-cyan-100">{component}</span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">You will learn</p>
                          <ul className="mt-2 space-y-1">
                            {problem.learningOutcomes.map((outcome) => (
                              <li key={outcome} className="flex gap-2 text-xs leading-5 text-slate-300">
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" /> {outcome}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan group-hover:text-cyan-100">
                          Open solution guide <ArrowRight className="h-4 w-4" />
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
