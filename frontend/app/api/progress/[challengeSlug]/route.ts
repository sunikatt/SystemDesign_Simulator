import { NextResponse } from 'next/server';
import { authEnabled } from '@/lib/auth-enabled';

type ProgressPayload = {
  score: number;
  latencyMs: number;
  errorRate: number;
  architecture?: unknown;
  result?: unknown;
};

function statusForScore(score: number) {
  if (score >= 85) return 'MASTERED';
  if (score >= 60) return 'IN_PROGRESS';
  return 'STARTED';
}

function serialize(value: unknown) {
  return value === undefined ? undefined : JSON.stringify(value);
}

export async function GET(_request: Request, context: { params: Promise<{ challengeSlug: string }> }) {
  if (!authEnabled) {
    return NextResponse.json({ progress: null, mode: 'demo' });
  }

  const [{ getServerSession }, { authOptions }, { prisma }] = await Promise.all([
    import('next-auth'),
    import('@/lib/auth'),
    import('@/lib/prisma'),
  ]);

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { challengeSlug } = await context.params;
  const progress = await prisma.challengeProgress.findUnique({
    where: { userId_challengeSlug: { userId, challengeSlug } },
  });

  return NextResponse.json({ progress });
}

export async function POST(request: Request, context: { params: Promise<{ challengeSlug: string }> }) {
  if (!authEnabled) {
    return NextResponse.json({ progress: null, mode: 'demo', saved: false });
  }

  const [{ getServerSession }, { authOptions }, { prisma }] = await Promise.all([
    import('next-auth'),
    import('@/lib/auth'),
    import('@/lib/prisma'),
  ]);

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { challengeSlug } = await context.params;
  const body = (await request.json()) as ProgressPayload;
  const score = Math.max(0, Math.min(100, Math.round(Number(body.score) || 0)));
  const latencyMs = Number(body.latencyMs) || 0;
  const errorRate = Number(body.errorRate) || 0;

  const existing = await prisma.challengeProgress.findUnique({
    where: { userId_challengeSlug: { userId, challengeSlug } },
  });
  const architectureJson = serialize(body.architecture);
  const resultJson = serialize(body.result);

  const bestScore = Math.max(existing?.bestScore ?? 0, score);
  const status = statusForScore(bestScore);
  const completedAt = status === 'MASTERED' ? (existing?.completedAt ?? new Date()) : existing?.completedAt;

  const [progress] = await prisma.$transaction([
    prisma.challengeProgress.upsert({
      where: { userId_challengeSlug: { userId, challengeSlug } },
      create: {
        userId,
        challengeSlug,
        status,
        simulationRuns: 1,
        attempts: 1,
        bestScore,
        lastScore: score,
        lastLatencyMs: latencyMs,
        lastErrorRate: errorRate,
        architectureJson,
        lastResultJson: resultJson,
        completedAt,
      },
      update: {
        status,
        simulationRuns: { increment: 1 },
        attempts: { increment: 1 },
        bestScore,
        lastScore: score,
        lastLatencyMs: latencyMs,
        lastErrorRate: errorRate,
        architectureJson,
        lastResultJson: resultJson,
        completedAt,
      },
    }),
    prisma.challengeAttempt.create({
      data: {
        userId,
        challengeSlug,
        score,
        latencyMs,
        errorRate,
        architectureJson,
        resultJson,
      },
    }),
  ]);

  return NextResponse.json({ progress });
}
