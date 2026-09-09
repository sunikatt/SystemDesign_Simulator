import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, Lightbulb, ListChecks, PlayCircle, Workflow } from 'lucide-react';
import { AuthControls } from '@/features/auth/AuthControls';
import { InteractiveQuiz } from '@/features/essentials/InteractiveQuiz';
import { essentialsModuleDetails, essentialsModules, getEssentialsModule } from '@/lib/essentials';

export function generateStaticParams() {
  return essentialsModules.map((module) => ({ slug: module.slug }));
}

export default async function EssentialsModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const module = getEssentialsModule(slug);

  if (!module) notFound();

  const details = essentialsModuleDetails[module.slug];
  const currentIndex = essentialsModules.findIndex((item) => item.slug === module.slug);
  const previous = essentialsModules[currentIndex - 1];
  const next = essentialsModules[currentIndex + 1];
  const lessonSections = [
    { href: '#concept', label: 'Concept explanation' },
    { href: '#diagram', label: 'Simple diagram' },
    { href: '#live-example', label: 'Live mini example' },
    { href: '#scenarios', label: `${details.scenarios.length} thinking scenarios` },
    { href: '#production', label: 'Production example' },
    { href: '#practice', label: 'Interview + practice' },
    { href: '#quiz', label: 'Quiz' },
  ];

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <nav className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-panel/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan">System Design Essentials</p>
            <h1 className="mt-1 text-2xl font-black text-white">{module.order}. {module.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <AuthControls />
            <Link href="/system-design-essentials" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" /> All modules
            </Link>
          </div>
        </nav>

        <section className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href={previous ? `/system-design-essentials/${previous.slug}` : '/system-design-essentials'} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" /> {previous ? `Previous lesson: ${previous.title}` : 'Back to all modules'}
          </Link>
          <div className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Lesson {module.order} of {essentialsModules.length}
          </div>
          <Link href={next ? `/system-design-essentials/${next.slug}` : '/system-design-essentials'} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-cyan-100">
            {next ? `Next chapter: ${next.title}` : 'Finish track'} <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.72fr_0.28fr]">
          <div className="space-y-5">
            <ContentCard id="concept" eyebrow="Concept explanation" title={`What is ${module.title}?`} icon={<Lightbulb className="h-5 w-5" />}>
              <p className="text-sm leading-7 text-slate-300">{module.concept}</p>
              <div className="mt-5 space-y-4">
                {details.detailedExplanation.map((paragraph) => (
                  <p key={paragraph} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300">{paragraph}</p>
                ))}
              </div>
            </ContentCard>

            <ContentCard id="diagram" eyebrow="Simple diagram" title="How the flow looks" icon={<Workflow className="h-5 w-5" />}>
              <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
                {module.diagram.map((step, index) => (
                  <div key={`${step}-${index}`} className="flex flex-col items-center gap-3 md:flex-row">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-semibold text-white">{step}</div>
                    {index < module.diagram.length - 1 && <ArrowRight className="h-4 w-4 rotate-90 text-cyan md:rotate-0" aria-label={`${step} to ${module.diagram[index + 1]}`} />}
                  </div>
                ))}
              </div>
            </ContentCard>

            <ContentCard id="live-example" eyebrow="Live mini example" title={module.liveExample.title} icon={<PlayCircle className="h-5 w-5" />}>
              <p className="text-sm leading-7 text-slate-300">{module.liveExample.setup}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <h3 className="font-bold text-white">Knobs to change</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
                    {module.liveExample.knobs.map((knob) => <li key={knob}>{knob}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-cyan/20 bg-cyan/10 p-4">
                  <h3 className="font-bold text-cyan-100">What you should observe</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-200">{module.liveExample.observation}</p>
                </div>
              </div>
            </ContentCard>

            <ContentCard id="scenarios" eyebrow="Think like an architect" title="Scenario-based learning" icon={<Lightbulb className="h-5 w-5" />}>
              <div className="grid gap-4 lg:grid-cols-2">
                {details.scenarios.map((scenario) => (
                  <div key={scenario.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="font-bold text-white">{scenario.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{scenario.situation}</p>
                    <div className="mt-3 rounded-2xl bg-black/20 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Think about</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-300">
                        {scenario.thinkAbout.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300"><strong className="text-cyan-100">Guidance:</strong> {scenario.guidance}</p>
                  </div>
                ))}
              </div>
            </ContentCard>

            <ContentCard id="production" eyebrow="Production example" title="Where this appears in real systems" icon={<CheckCircle2 className="h-5 w-5" />}>
              <p className="text-sm leading-7 text-slate-300">{module.productionExample}</p>
            </ContentCard>

            <div id="practice" className="scroll-mt-6 grid gap-5 lg:grid-cols-2">
              <ContentCard eyebrow="Interview question" title="Practice explaining it" icon={<HelpCircle className="h-5 w-5" />}>
                <p className="text-sm leading-7 text-slate-300">{module.interviewQuestion}</p>
              </ContentCard>
              <ContentCard eyebrow="Practice challenge" title="Apply the concept" icon={<PlayCircle className="h-5 w-5" />}>
                <p className="text-sm leading-7 text-slate-300">{module.practiceChallenge}</p>
              </ContentCard>
            </div>

            <ContentCard id="quiz" eyebrow="Quiz" title="Check your understanding" icon={<HelpCircle className="h-5 w-5" />}>
              <InteractiveQuiz questions={details.quiz} />
            </ContentCard>
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
              <div className="flex items-center gap-2 text-sm font-semibold text-cyan">
                <ListChecks className="h-4 w-4" /> Lesson contents
              </div>
              <div className="mt-4 space-y-2">
                {lessonSections.map((section) => (
                  <a key={section.href} href={section.href} className="block rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white">
                    {section.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-5">
              <p className="text-sm font-semibold text-cyan">Module navigator</p>
              <div className="mt-4 max-h-[520px] space-y-2 overflow-y-auto pr-1">
                {essentialsModules.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/system-design-essentials/${item.slug}`}
                    className={`block rounded-2xl border px-3 py-2 text-sm ${item.slug === module.slug ? 'border-cyan/50 bg-cyan/10 text-cyan-100' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10'}`}
                  >
                    <span className="font-bold">{item.order}.</span> {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="flex flex-col gap-3 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {previous && (
              <Link href={`/system-design-essentials/${previous.slug}`} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" /> Previous: {previous.title}
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/practice-problems" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan/30 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan/10">
              Open practice problems
            </Link>
            {next && (
              <Link href={`/system-design-essentials/${next.slug}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-cyan-100">
                Next: {next.title} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function ContentCard({ id, eyebrow, title, icon, children }: { id?: string; eyebrow: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 glass rounded-3xl p-5">
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
