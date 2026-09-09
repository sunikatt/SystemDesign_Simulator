import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Code2, Database, Layers3, Lightbulb, ListChecks, XCircle } from 'lucide-react';
import { AuthControls } from '@/features/auth/AuthControls';
import { InteractiveQuiz } from '@/features/essentials/InteractiveQuiz';
import { PracticeWorkspace } from '@/features/practice/PracticeWorkspace';
import { getPracticeProblem, practiceProblems } from '@/lib/practice-problems';

export function generateStaticParams() {
  return practiceProblems.map((problem) => ({ slug: problem.slug }));
}

export default async function PracticeProblemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const problem = getPracticeProblem(slug);

  if (!problem) notFound();

  const currentIndex = practiceProblems.findIndex((item) => item.slug === problem.slug);
  const previous = practiceProblems[currentIndex - 1];
  const next = practiceProblems[currentIndex + 1];

  return (
    <main className="min-h-screen px-4 py-5 lg:px-6">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <nav className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-panel/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan">Practice Problem</p>
            <h1 className="mt-1 text-2xl font-black text-white">{problem.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <AuthControls />
            <Link href="/practice-problems" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" /> All problems
            </Link>
          </div>
        </nav>

        <PracticeWorkspace
          slug={problem.slug}
          title={problem.title}
          description={problem.description}
          components={problem.components}
          functionalRequirements={problem.requirements.functional}
          nonFunctionalRequirements={problem.requirements.nonFunctional}
          rubric={problem.rubric}
        />

        <section className="grid gap-5 lg:grid-cols-[0.72fr_0.28fr]">
          <div className="space-y-5">
            <Card eyebrow="Goal" title="What you need to design" icon={<Lightbulb className="h-5 w-5" />}>
              <p className="text-sm leading-7 text-slate-300">{problem.description}</p>
              {problem.simulatorHref && (
                <Link href={problem.simulatorHref} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-cyan-100">
                  Open live simulator <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </Card>

            <div className="grid gap-5 lg:grid-cols-2">
              <Card eyebrow="Requirements" title="Functional requirements" icon={<ListChecks className="h-5 w-5" />}>
                <BulletList items={problem.requirements.functional} />
              </Card>
              <Card eyebrow="Requirements" title="Non-functional requirements" icon={<ListChecks className="h-5 w-5" />}>
                <BulletList items={problem.requirements.nonFunctional} />
              </Card>
            </div>

            <Card eyebrow="Components" title="Building blocks to use" icon={<Layers3 className="h-5 w-5" />}>
              <div className="flex flex-wrap gap-2">
                {problem.components.map((component) => (
                  <span key={component} className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-sm text-cyan-100">{component}</span>
                ))}
              </div>
            </Card>

            <Card eyebrow="API design" title="Important endpoints" icon={<Code2 className="h-5 w-5" />}>
              <BulletList items={problem.apis} />
            </Card>

            <Card eyebrow="DB modelling" title="Tables, indexes, and cache keys" icon={<Database className="h-5 w-5" />}>
              <BulletList items={problem.dbSchema} />
            </Card>

            <Card eyebrow="Architecture" title="High-level flow" icon={<Layers3 className="h-5 w-5" />}>
              <div className="space-y-3">
                {problem.architecture.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">{item}</div>
                ))}
              </div>
            </Card>

            <div className="grid gap-5 lg:grid-cols-2">
              <Card eyebrow="Avoid" title="Common mistakes" icon={<XCircle className="h-5 w-5" />}>
                <BulletList items={problem.commonMistakes} tone="bad" />
              </Card>
              <Card eyebrow="Correct direction" title="Better solution" icon={<CheckCircle2 className="h-5 w-5" />}>
                <BulletList items={problem.correctSolution} />
              </Card>
            </div>

            <Card eyebrow="Scoring rubric" title="What a good answer must include" icon={<CheckCircle2 className="h-5 w-5" />}>
              <BulletList items={problem.rubric} />
            </Card>

            <Card eyebrow="Quiz" title="Check your understanding" icon={<Lightbulb className="h-5 w-5" />}>
              <InteractiveQuiz questions={problem.quiz} />
            </Card>
          </div>

          <aside className="space-y-5">
            <div className="glass rounded-3xl p-5">
              <p className="text-sm font-semibold text-cyan">You will learn</p>
              <ul className="mt-4 space-y-3">
                {problem.learningOutcomes.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-slate-300">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-3xl p-5">
              <p className="text-sm font-semibold text-cyan">Problem navigator</p>
              <div className="mt-4 max-h-[620px] space-y-2 overflow-y-auto pr-1">
                {practiceProblems.map((item) => (
                  <Link key={item.slug} href={`/practice-problems/${item.slug}`} className={`block rounded-2xl border px-3 py-2 text-sm ${item.slug === problem.slug ? 'border-cyan/50 bg-cyan/10 text-cyan-100' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10'}`}>
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="flex flex-col gap-3 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {previous && <Link href={`/practice-problems/${previous.slug}`} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"><ArrowLeft className="h-4 w-4" /> Previous: {previous.title}</Link>}
          </div>
          <div>
            {next && <Link href={`/practice-problems/${next.slug}`} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-cyan-100">Next: {next.title} <ArrowRight className="h-4 w-4" /></Link>}
          </div>
        </section>
      </div>
    </main>
  );
}

function BulletList({ items, tone = 'good' }: { items: string[]; tone?: 'good' | 'bad' }) {
  const Icon = tone === 'bad' ? XCircle : CheckCircle2;
  const color = tone === 'bad' ? 'text-rose-300' : 'text-emerald-300';
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-6 text-slate-300">
          <Icon className={`mt-1 h-4 w-4 shrink-0 ${color}`} /> {item}
        </li>
      ))}
    </ul>
  );
}

function Card({ eyebrow, title, icon, children }: { eyebrow: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="glass rounded-3xl p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan/15 text-cyan">{icon}</div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-black text-white">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}
