import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle, ArrowLeft, ArrowRight, Brain, CheckCircle2, Database, HelpCircle, Layers3, Lightbulb, Route } from 'lucide-react';
import { AuthControls } from '@/features/auth/AuthControls';
import { InteractiveQuiz } from '@/features/essentials/InteractiveQuiz';
import { getRealWorldExampleModule, realWorldExampleModules } from '@/lib/real-world-examples';

export function generateStaticParams() {
  return realWorldExampleModules.map((module) => ({ slug: module.slug }));
}

export default async function RealWorldExampleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const module = getRealWorldExampleModule(slug);

  if (!module) notFound();

  const currentIndex = realWorldExampleModules.findIndex((item) => item.slug === module.slug);
  const previous = realWorldExampleModules[currentIndex - 1];
  const next = realWorldExampleModules[currentIndex + 1];

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <nav className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-panel/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan">Real World System Design Blog</p>
            <h1 className="mt-1 text-2xl font-black text-white">{module.order}. {module.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <AuthControls />
            <Link href="/system-design-real-world-examples" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" /> All real-world systems
            </Link>
          </div>
        </nav>

        <section className="grid gap-5 lg:grid-cols-[0.72fr_0.28fr]">
          <div className="space-y-5">
            <Card title="Real-world story" eyebrow="Why this system matters" icon={<Lightbulb className="h-5 w-5" />}>
              <p className="text-sm leading-7 text-slate-300">{module.blogIntro}</p>
              <div className="mt-4 rounded-2xl border border-cyan/20 bg-cyan/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Where you see this in production</p>
                <p className="mt-2 text-sm leading-7 text-slate-200">{module.realWorldContext}</p>
              </div>
            </Card>

            <Card title="30-second takeaway" eyebrow="What to remember quickly" icon={<Brain className="h-5 w-5" />}>
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Best decision</p>
                  <p className="mt-2 text-sm leading-6 text-emerald-50">{module.decisions[0]?.decision}</p>
                </div>
                <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">Avoid this</p>
                  <p className="mt-2 text-sm leading-6 text-rose-50">{module.decisions[0]?.wrongDirection}</p>
                </div>
                <div className="rounded-2xl border border-cyan/20 bg-cyan/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Fallback mindset</p>
                  <p className="mt-2 text-sm leading-6 text-cyan-50">{module.failureScenarios[0]?.recovery}</p>
                </div>
              </div>
            </Card>

            <Card title="Functional and non-functional requirements" eyebrow="Start with the problem" icon={<CheckCircle2 className="h-5 w-5" />}>
              <div className="grid gap-3 md:grid-cols-2">
                {module.keyRequirements.map((requirement) => (
                  <div key={requirement} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-slate-300">
                    {requirement}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                In a real interview or production design, these requirements decide the rest of the architecture. If the traffic is read-heavy, cache/CDN matters. If correctness is strict, transactions and idempotency matter. If the system calls external providers, fallback and retries matter.
              </p>
            </Card>

            <Card title="High-level architecture" eyebrow="Real design flow" icon={<Layers3 className="h-5 w-5" />}>
              <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
                {module.architecture.map((step, index) => (
                  <div key={`${step}-${index}`} className="flex flex-col items-center gap-3 md:flex-row">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-semibold text-white">{step}</div>
                    {index < module.architecture.length - 1 && <ArrowRight className="h-4 w-4 rotate-90 text-cyan md:rotate-0" />}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="DB modelling and access patterns" eyebrow="Storage design" icon={<Database className="h-5 w-5" />}>
              <ul className="space-y-2">
                {module.dataModel.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-slate-300"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" /> {item}</li>
                ))}
              </ul>
              <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-400">
                Good DB modelling starts from access patterns: read by ID, list by owner, search by prefix, rank by score, expire by time, or reserve inventory. Pick indexes and storage after these access patterns are clear.
              </p>
            </Card>

            <Card title="Decision-based learning" eyebrow="Wrong direction → correction" icon={<Route className="h-5 w-5" />}>
              <div className="space-y-4">
                {module.decisions.map((item) => (
                  <div key={item.decision} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="font-bold text-white">Decision: {item.decision}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300"><strong className="text-cyan-100">Why:</strong> {item.why}</p>
                    <div className="mt-3 grid gap-3 lg:grid-cols-2">
                      <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm leading-6 text-rose-100">
                        <strong>Wrong direction:</strong> {item.wrongDirection}
                      </div>
                      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm leading-6 text-emerald-100">
                        <strong>Correction:</strong> {item.correction}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Scaling notes" eyebrow="What changes at production scale" icon={<CheckCircle2 className="h-5 w-5" />}>
              <ul className="grid gap-3 md:grid-cols-2">
                {module.scalingNotes.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-slate-300">• {item}</li>)}
              </ul>
            </Card>

            <Card title="Failure and fallback systems" eyebrow="How production survives" icon={<AlertTriangle className="h-5 w-5" />}>
              <div className="grid gap-4 lg:grid-cols-2">
                {module.failureScenarios.map((scenario) => (
                  <div key={scenario.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="font-bold text-white">{scenario.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-rose-100"><strong>Failure:</strong> {scenario.failure}</p>
                    <p className="mt-2 text-sm leading-6 text-emerald-100"><strong>Recovery:</strong> {scenario.recovery}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Quiz" eyebrow="Check your understanding" icon={<HelpCircle className="h-5 w-5" />}>
              <InteractiveQuiz questions={module.quiz} />
            </Card>
          </div>

          <aside className="space-y-5">
            <div className="glass rounded-3xl p-5">
              <p className="text-sm font-semibold text-cyan">How to read this blog</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>1. Understand the product story.</li>
                <li>2. Read requirements before architecture.</li>
                <li>3. Study the DB access patterns.</li>
                <li>4. Focus on decisions and corrections.</li>
                <li>5. Learn fallback behavior for failures.</li>
              </ul>
            </div>
            <div className="glass rounded-3xl p-5">
              <p className="text-sm font-semibold text-cyan">System navigator</p>
              <div className="mt-4 max-h-[620px] space-y-2 overflow-y-auto pr-1">
                {realWorldExampleModules.map((item) => (
                  <Link key={item.slug} href={`/system-design-real-world-examples/${item.slug}`} className={`block rounded-2xl border px-3 py-2 text-sm ${item.slug === module.slug ? 'border-cyan/50 bg-cyan/10 text-cyan-100' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10'}`}>
                    <span className="font-bold">{item.order}.</span> {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="flex flex-col gap-3 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {previous && <Link href={`/system-design-real-world-examples/${previous.slug}`} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"><ArrowLeft className="h-4 w-4" /> Previous: {previous.title}</Link>}
          </div>
          <div>
            {next && <Link href={`/system-design-real-world-examples/${next.slug}`} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-cyan-100">Next: {next.title} <ArrowRight className="h-4 w-4" /></Link>}
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ title, eyebrow, icon, children }: { title: string; eyebrow: string; icon: React.ReactNode; children: React.ReactNode }) {
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
