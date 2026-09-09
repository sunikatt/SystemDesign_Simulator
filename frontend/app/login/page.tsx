'use client';

import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { Github, Mail, Network } from 'lucide-react';
import { authEnabled } from '@/lib/auth-enabled';

export default function LoginPage() {
  if (!authEnabled) {
    return <LoginDisabled />;
  }

  return <LoginEnabled />;
}

function LoginEnabled() {
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-panel/80 p-7 shadow-glow">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Login to SystemDesign Lab</h1>
            <p className="text-sm text-slate-400">Save progress, attempts, scores, and architecture history.</p>
          </div>
        </div>

        {session?.user ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              You are logged in as {session.user.email ?? session.user.name}.
            </div>
            <Link href="/dashboard" className="block rounded-2xl bg-white px-4 py-3 text-center font-bold text-ink hover:bg-cyan-100">
              Open dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white px-4 py-3 font-bold text-ink hover:bg-cyan-100">
              <Mail className="h-5 w-5" /> Continue with Google
            </button>
            <button onClick={() => signIn('github', { callbackUrl: '/dashboard' })} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-slate-950 px-4 py-3 font-bold text-white hover:bg-slate-900">
              <Github className="h-5 w-5" /> Continue with GitHub
            </button>
            <p className="pt-2 text-xs leading-5 text-slate-500">
              If a provider is disabled, add OAuth credentials to <code className="text-slate-300">.env.local</code> using <code className="text-slate-300">.env.example</code>.
            </p>
          </div>
        )}

        <Link href="/" className="mt-6 inline-flex text-sm text-cyan-200 hover:text-cyan">
          Back to home
        </Link>
      </div>
    </main>
  );
}

function LoginDisabled() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-panel/80 p-7 shadow-glow">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Demo mode is enabled</h1>
            <p className="text-sm text-slate-400">Login is optional and currently disabled for public sharing.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-100">
          You can read all lessons and use the simulator without signing in. Progress saving can be enabled later with hosted Postgres and OAuth credentials.
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="inline-flex flex-1 justify-center rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
            Back home
          </Link>
          <Link href="/practice-problems" className="inline-flex flex-1 justify-center rounded-2xl bg-white px-4 py-3 text-sm font-bold text-ink hover:bg-cyan-100">
            Practice problems
          </Link>
        </div>
      </div>
    </main>
  );
}
