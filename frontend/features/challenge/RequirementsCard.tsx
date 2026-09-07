import { CheckCircle2 } from 'lucide-react';

const requirements = [
  '100,000 users',
  '10,000 requests per second',
  '90% reads / 10% writes',
  'Target latency below 200ms',
  'High availability required',
  'URLs must persist',
  'Frequently accessed URLs should load quickly',
];

export function RequirementsCard() {
  return (
    <section className="glass rounded-3xl p-5">
      <p className="text-sm font-medium text-cyan">Challenge Requirements</p>
      <h1 className="mt-2 text-3xl font-black text-white">Design a URL Shortener</h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Build a system that creates short links and redirects users to original URLs under high read traffic.
      </p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {requirements.map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> {item}
          </div>
        ))}
      </div>
    </section>
  );
}
