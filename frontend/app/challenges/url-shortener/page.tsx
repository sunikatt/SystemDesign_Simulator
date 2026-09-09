import Link from 'next/link';
import { ArrowLeft, Network } from 'lucide-react';
import { RequirementsCard } from '@/features/challenge/RequirementsCard';
import { ArchitectureCanvas } from '@/features/canvas/ArchitectureCanvas';
import { AuthControls } from '@/features/auth/AuthControls';

export default function UrlShortenerChallengePage() {
  return (
    <main className="min-h-screen px-4 py-5 lg:px-6">
      <div className="mx-auto max-w-[1800px] space-y-5">
        <header className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-panel/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand shadow-glow"><Network className="h-5 w-5" /></div>
            <div>
              <div className="font-bold text-white">SystemDesign Lab</div>
              <div className="text-xs text-slate-400">System Design Essentials · Production URL Shortener</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AuthControls />
            <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" /> Back to landing
            </Link>
          </div>
        </header>

        <RequirementsCard />

        <section className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-cyan">Production Architecture Canvas</p>
              <h2 className="text-2xl font-black text-white">Build frontend-to-backend traffic flow, configure capacity, run, and iterate</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-400">
              This simulator uses educational formulas, not cloud resources. It models a production URL Shortener path: clients/frontend → API Gateway → load balancing/backend URL services → Redis → PostgreSQL, including traffic distribution, capacity, latency, errors, bottlenecks, and explainable scoring.
            </p>
          </div>
          <ArchitectureCanvas />
        </section>

        <section className="grid gap-4 pb-10 lg:grid-cols-2">
          <div className="glass rounded-3xl p-5">
            <h3 className="text-xl font-bold text-white">Your Architecture vs Suggested Architecture</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              There are multiple valid solutions depending on requirements and trade-offs. A strong production baseline for this workload is Frontend clients → API Gateway for routing/rate limiting/logging → Load Balancer for distributing traffic across stateless URL Service servers → Redis for hot redirect reads → PostgreSQL for durable URL mappings.
            </p>
          </div>
          <div className="glass rounded-3xl p-5">
            <h3 className="text-xl font-bold text-white">Trade-offs to think about</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>The API Gateway gives one production entry point, but it must be scaled and configured correctly.</li>
              <li>Gateway or load balancer traffic distribution protects individual URL service servers from overload.</li>
              <li>Redis reduces redirect latency but introduces cache invalidation and memory cost.</li>
              <li>More stateless backend service instances improve throughput but increase cost.</li>
              <li>PostgreSQL is durable and consistent, but writes and hot indexes can bottleneck.</li>
              <li>Rate limiting protects the system, but can reject legitimate bursts.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
