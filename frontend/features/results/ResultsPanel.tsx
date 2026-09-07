'use client';

import { AlertTriangle, CheckCircle2, Gauge, Info, Lightbulb, XCircle } from 'lucide-react';
import { ComponentStatus, SimulationResult } from '@/types/simulation';

const statusIcon: Record<ComponentStatus, React.ElementType> = {
  HEALTHY: CheckCircle2,
  WARNING: AlertTriangle,
  HIGH_LOAD: AlertTriangle,
  OVERLOADED: XCircle,
  FAILED: XCircle,
};

const statusColor: Record<ComponentStatus, string> = {
  HEALTHY: 'text-emerald-300',
  WARNING: 'text-amber-300',
  HIGH_LOAD: 'text-orange-300',
  OVERLOADED: 'text-red-300',
  FAILED: 'text-red-400',
};

export function ResultsPanel({ result }: { result: SimulationResult }) {
  const scoreItems = [
    ['Overall', result.score.overall, result.score.explanations.overall],
    ['Scalability', result.score.scalability, result.score.explanations.scalability],
    ['Reliability', result.score.reliability, result.score.explanations.reliability],
    ['Latency', result.score.latency, result.score.explanations.latency],
    ['Cost Efficiency', result.score.costEfficiency, result.score.explanations.costEfficiency],
    ['Simplicity', result.score.simplicity, result.score.explanations.simplicity],
  ] as const;

  return (
    <section className="glass rounded-3xl p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan">System Design Result</p>
          <h2 className="text-3xl font-black text-white">Score: {result.score.overall} / 100</h2>
          <p className="mt-1 text-sm text-slate-400">Estimated latency {result.totalLatencyMs}ms · error rate {(result.totalErrorRate * 100).toFixed(2)}%</p>
        </div>
        {result.bottleneck ? (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
            <div className="font-bold">⚠ Bottleneck Detected: {result.bottleneck.label}</div>
            <div>{result.bottleneck.explanation}</div>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            No severe bottleneck detected for this traffic profile.
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {scoreItems.map(([label, score, explanation]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-slate-300">{label}</span>
              <Gauge className="h-4 w-4 text-cyan" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">{score}</div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{explanation}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="font-bold text-white">Component Analysis</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="py-2">Component</th>
                  <th>Incoming</th>
                  <th>Reads</th>
                  <th>Writes</th>
                  <th>Capacity</th>
                  <th>Utilization</th>
                  <th>Latency</th>
                  <th>Error</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {result.components.map((component) => {
                  const Icon = statusIcon[component.status];
                  return (
                    <tr key={component.nodeId} className="border-t border-white/10">
                      <td className="py-3 font-semibold text-white">{component.label}</td>
                      <td>{component.incomingRps}</td>
                      <td>{component.readRps}</td>
                      <td>{component.writeRps}</td>
                      <td>{component.capacity}</td>
                      <td>{Math.round(component.utilization * 100)}%</td>
                      <td>{component.latencyMs}ms</td>
                      <td>{(component.errorRate * 100).toFixed(2)}%</td>
                      <td><span className={`inline-flex items-center gap-1 ${statusColor[component.status]}`}><Icon className="h-4 w-4" /> {component.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-cyan/20 bg-cyan/10 p-4">
            <h3 className="flex items-center gap-2 font-bold text-cyan-100"><Lightbulb className="h-4 w-4" /> Recommendations</h3>
            <div className="mt-3 space-y-3">
              {result.recommendations.length ? result.recommendations.map((rec, index) => (
                <div key={`${rec.title}-${index}`} className="rounded-2xl bg-black/20 p-3 text-sm leading-6">
                  <div className="font-semibold text-white">{rec.title}</div>
                  <div className="text-slate-300"><strong>Why:</strong> {rec.why}</div>
                  <div className="text-slate-400"><strong>Trade-off:</strong> {rec.tradeOff}</div>
                </div>
              )) : <p className="text-sm text-slate-300">Your architecture is healthy for the current target. Try increasing traffic or reducing capacity to explore failure modes.</p>}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="flex items-center gap-2 font-bold text-white"><Info className="h-4 w-4 text-cyan" /> Simulation Formulas</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              {result.formulas.map((formula) => <li key={formula}>{formula}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
