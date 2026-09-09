import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, Lightbulb, Network } from 'lucide-react';
import { AuthControls } from '@/features/auth/AuthControls';
import { InteractiveQuiz } from '@/features/essentials/InteractiveQuiz';
import { advancedModules, getAdvancedModule } from '@/lib/advanced';

export function generateStaticParams() {
  return advancedModules.map((module) => ({ slug: module.slug }));
}

export default async function AdvancedTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const module = getAdvancedModule(slug);

  if (!module) notFound();

  const currentIndex = advancedModules.findIndex((item) => item.slug === module.slug);
  const previous = advancedModules[currentIndex - 1];
  const next = advancedModules[currentIndex + 1];

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <nav className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-panel/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan">Advanced System Design</p>
            <h1 className="mt-1 text-2xl font-black text-white">{module.order}. {module.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <AuthControls />
            <Link href="/system-design-advanced" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" /> All advanced topics
            </Link>
          </div>
        </nav>

        <section className="grid gap-5 lg:grid-cols-[0.72fr_0.28fr]">
          <div className="space-y-5">
            <Card title="Core theory" eyebrow="Deep explanation" icon={<Lightbulb className="h-5 w-5" />}>
              <div className="space-y-4">
                {module.theory.map((paragraph) => (
                  <p key={paragraph} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300">{paragraph}</p>
                ))}
              </div>
            </Card>

            <Card title="Mental model diagram" eyebrow="How to think about it" icon={<Network className="h-5 w-5" />}>
              <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
                {module.diagram.map((step, index) => (
                  <div key={`${step}-${index}`} className="flex flex-col items-center gap-3 md:flex-row">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-semibold text-white">{step}</div>
                    {index < module.diagram.length - 1 && <ArrowRight className="h-4 w-4 rotate-90 text-cyan md:rotate-0" />}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Deep dives" eyebrow="Important details" icon={<CheckCircle2 className="h-5 w-5" />}>
              <div className="space-y-4">
                {module.deepDive.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Failure modes" eyebrow="What breaks in production" icon={<AlertTriangle className="h-5 w-5" />}>
              <ul className="space-y-2">
                {module.failureModes.map((item) => (
                  <li key={item} className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm leading-6 text-rose-100">{item}</li>
                ))}
              </ul>
            </Card>

            <Card title="Interview prompt" eyebrow="Practice explaining" icon={<HelpCircle className="h-5 w-5" />}>
              <p className="text-sm leading-7 text-slate-300">{module.interviewPrompt}</p>
            </Card>

            <Card title="Quiz" eyebrow="Check your understanding" icon={<HelpCircle className="h-5 w-5" />}>
              <InteractiveQuiz questions={module.quiz} />
            </Card>
          </div>

          <aside className="space-y-5">
            <div className="glass rounded-3xl p-5">
              <p className="text-sm font-semibold text-cyan">Key takeaways</p>
              <ul className="mt-4 space-y-3">
                {module.keyTakeaways.map((takeaway) => (
                  <li key={takeaway} className="flex gap-2 text-sm leading-6 text-slate-300">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" /> {takeaway}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-3xl p-5">
              <p className="text-sm font-semibold text-cyan">Advanced navigator</p>
              <div className="mt-4 space-y-2">
                {advancedModules.map((item) => (
                  <Link key={item.slug} href={`/system-design-advanced/${item.slug}`} className={`block rounded-2xl border px-3 py-2 text-sm ${item.slug === module.slug ? 'border-cyan/50 bg-cyan/10 text-cyan-100' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10'}`}>
                    <span className="font-bold">{item.order}.</span> {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="flex flex-col gap-3 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {previous && <Link href={`/system-design-advanced/${previous.slug}`} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"><ArrowLeft className="h-4 w-4" /> Previous: {previous.title}</Link>}
          </div>
          <div>
            {next && <Link href={`/system-design-advanced/${next.slug}`} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-cyan-100">Next: {next.title} <ArrowRight className="h-4 w-4" /></Link>}
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
