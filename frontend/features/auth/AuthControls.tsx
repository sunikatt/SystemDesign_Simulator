'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, UserCircle } from 'lucide-react';
import { authEnabled } from '@/lib/auth-enabled';

export function AuthControls() {
  if (!authEnabled) {
    return (
      <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100">
        Demo mode
      </span>
    );
  }

  return <AuthenticatedControls />;
}

function AuthenticatedControls() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="h-10 w-32 animate-pulse rounded-full bg-white/10" />;
  }

  if (!session?.user) {
    return (
      <Link href="/login" className="rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan/20">
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className="hidden rounded-full border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/10 sm:inline-flex">
        Progress
      </Link>
      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] py-1 pl-1 pr-3">
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={session.user.image} alt={session.user.name ?? 'User'} width={32} height={32} className="rounded-full" />
        ) : (
          <UserCircle className="h-8 w-8 text-slate-300" />
        )}
        <span className="max-w-28 truncate text-sm text-slate-200">{session.user.name ?? session.user.email}</span>
      </div>
      <button onClick={() => signOut()} className="rounded-full border border-white/15 p-2 text-slate-300 hover:bg-white/10" aria-label="Sign out">
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
