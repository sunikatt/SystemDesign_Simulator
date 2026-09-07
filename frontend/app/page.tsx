import Link from 'next/link';
import { ArrowRight, Bot, LineChart, Network, PlayCircle } from 'lucide-react';

const steps = [
  'Read requirements',
  'Build architecture',
  'Run simulation',
  'Find bottlenecks',
  'Fix trade-offs',
  'Get feedback',
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand shadow-glow">
            <Network className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">SystemDesign Lab</span>
        </div>
        <Link href="/challenges/url-shortener" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/10">
          Open MVP
        </Link>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-sm text-cyan-200">
            <Bot className="h-4 w-4" /> Interactive system design simulator
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-white md:text-7xl">
            Don&apos;t just read system design. Build it, run it, break it.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Practice the URL Shortener challenge with a visual architecture canvas, mathematical traffic simulation, bottleneck detection, and beginner-friendly explanations.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/challenges/url-shortener" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-ink hover:bg-cyan-100">
              Start URL Shortener Challenge <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/10">
              See how it works
            </a>
          </div>
        </div>

        <div className="glass rounded-[2rem] p-5">
          <div className="rounded-[1.5rem] border border-white/10 bg-ink/80 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Simulation Preview</p>
                <h2 className="text-xl font-bold">URL Shortener @ 10,000 RPS</h2>
              </div>
              <PlayCircle className="h-8 w-8 text-cyan" />
            </div>
            <div className="space-y-3">
              {['API Gateway', 'Load Balancer', 'URL Service', 'Redis Cache', 'PostgreSQL'].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/20 text-sm font-bold text-violet-200">{index + 1}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{item}</div>
                    <div className="text-xs text-slate-400">Utilization, latency, queue, and error rate calculated</div>
                  </div>
                  <LineChart className="h-5 w-5 text-cyan" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl scroll-mt-8 pb-24 pt-10">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan">How it works</p>
          <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">Learn system design by changing the system and seeing the result.</h2>
          <p className="mt-4 text-slate-300">
            The MVP uses a simplified mathematical simulator. It does not create real cloud infrastructure; it teaches the relationship between traffic, capacity, latency, bottlenecks, and trade-offs.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {steps.map((step, index) => (
            <div key={step} className="glass rounded-2xl p-4 text-sm font-medium text-slate-200">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-cyan/15 text-sm font-black text-cyan">{index + 1}</div>
              {step}
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <h3 className="font-bold text-white">1. Build</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Drag API Gateway, Load Balancer, URL Service, Redis, and PostgreSQL onto the canvas.</p>
            </div>
            <div>
              <h3 className="font-bold text-white">2. Simulate</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Run 10,000 RPS through your architecture and calculate utilization, latency, queue depth, and errors.</p>
            </div>
            <div>
              <h3 className="font-bold text-white">3. Improve</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Read bottleneck explanations, compare trade-offs, adjust the design, and run again.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
