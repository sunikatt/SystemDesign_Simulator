import { NextResponse } from 'next/server';
import { authEnabled } from '@/lib/auth-enabled';

async function authHandler(request: Request, context: unknown) {
  if (!authEnabled) {
    return NextResponse.json({ error: 'Authentication is disabled in demo mode.' }, { status: 404 });
  }

  const [{ default: NextAuth }, { authOptions }] = await Promise.all([
    import('next-auth'),
    import('@/lib/auth'),
  ]);

  const handler = NextAuth(authOptions);
  return handler(request, context);
}

export { authHandler as GET, authHandler as POST };
