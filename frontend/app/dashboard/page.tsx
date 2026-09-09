import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ArrowRight, Trophy } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const progress = await prisma.challengeProgress.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  });

  const urlProgress = progress.find((item) => item.challengeSlug === 'url-shortener');
  const bestScore = urlProgress?.bestScore ?? 0;

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-panel/70 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan">Learner dashboard</p>
            <h1 className="mt-1 text-3xl font-black text-white">Welcome, {session.user.name ?? session.user.email}</h1>
            <p className="mt-2 text-sm text-slate-400">Track interview-prep progress across system design simulator challenges.</p>
          </div>
          <Link href="/challenges/url-shortener" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-ink hover:bg-cyan-100">
            Continue learning <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric label="Challenges started" value={progress.length} />
          <Metric label="Best score" value={`${bestScore}%`} />
          <Metric label="Simulation runs" value={progress.reduce((sum, item) => sum + item.simulationRuns, 0)} />
          <Metric label="Mastered" value={progress.filter((item) => item.status === 'MASTERED').length} />
        </section>

        <section className="rounded-3xl border border-white/10 bg-panel/70 p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-200">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Learning paths</h2>
              <p className="text-sm text-slate-400">Three tracks: System Design Essentials, System Design, and Advanced System Design.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">System Design Essentials</p>
                <h3 className="mt-1 font-bold text-white">Production URL Shortener Architecture</h3>
                <p className="mt-1 text-sm text-slate-400">Frontend clients, API Gateway routing/rate limits, traffic distribution across backend URL service servers, Redis cache, PostgreSQL persistence, latency, bottlenecks, and trade-offs.</p>
                {urlProgress && (
                  <p className="mt-2 text-xs text-slate-500">Last updated {urlProgress.updatedAt.toLocaleString()}</p>
                )}
              </div>
              <div className="min-w-48">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-400">Progress</span>
                  <span className="font-bold text-cyan">{bestScore}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-cyan" style={{ width: `${Math.min(bestScore, 100)}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-500">Status: {urlProgress?.status ?? 'NOT_STARTED'}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/system-design-essentials" className="rounded-2xl bg-white px-4 py-2 text-center text-sm font-bold text-ink hover:bg-cyan-100">
                  Learn essentials
                </Link>
                <Link href="/challenges/url-shortener" className="rounded-2xl border border-white/15 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-white/10">
                  Open challenge
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </div>
  );
}
