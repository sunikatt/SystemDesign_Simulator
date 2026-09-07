'use client';

import { Node } from '@xyflow/react';
import { BookOpen, Trash2 } from 'lucide-react';
import { learningContent } from '@/lib/learning';
import { ArchitectureNodeData, ComponentConfig } from '@/types/simulation';

type InspectorProps = {
  selectedNode?: Node<ArchitectureNodeData>;
  onConfigChange: (nodeId: string, config: ComponentConfig) => void;
  onDelete: (nodeId: string) => void;
};

function Field({ label, value, step = 1, min = 0, max, onChange, suffix }: { label: string; value: number; step?: number; min?: number; max?: number; suffix?: string; onChange: (value: number) => void }) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <span className="text-xs text-slate-400">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input
          className="w-full rounded-xl border border-white/10 bg-ink px-3 py-2 text-sm text-white outline-none focus:border-cyan"
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        {suffix && <span className="text-xs text-slate-400">{suffix}</span>}
      </div>
    </label>
  );
}

export function Inspector({ selectedNode, onConfigChange, onDelete }: InspectorProps) {
  if (!selectedNode) {
    return (
      <aside className="h-full border-l border-white/10 bg-panel/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Inspector</p>
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-slate-300">
          Select a component to edit properties and read beginner-friendly system design notes.
        </div>
      </aside>
    );
  }

  const { config, type, label } = selectedNode.data;
  const learning = learningContent[type];
  const update = (patch: ComponentConfig) => onConfigChange(selectedNode.id, { ...config, ...patch });

  return (
    <aside className="h-full overflow-y-auto border-l border-white/10 bg-panel/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Inspector</p>
          <h2 className="mt-2 text-xl font-bold text-white">{label}</h2>
        </div>
        <button onClick={() => onDelete(selectedNode.id)} className="rounded-xl border border-red-400/30 p-2 text-red-300 hover:bg-red-500/10" title="Delete component">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {config.capacityRps !== undefined && <Field label="Maximum RPS" value={config.capacityRps} onChange={(v) => update({ capacityRps: v })} suffix="RPS" />}
        {config.instances !== undefined && <Field label="Instances" value={config.instances} min={1} onChange={(v) => update({ instances: v })} />}
        {config.capacityPerInstanceRps !== undefined && <Field label="Capacity per instance" value={config.capacityPerInstanceRps} onChange={(v) => update({ capacityPerInstanceRps: v })} suffix="RPS" />}
        {config.opsPerSecond !== undefined && <Field label="Maximum operations/sec" value={config.opsPerSecond} onChange={(v) => update({ opsPerSecond: v })} suffix="OPS" />}
        {config.readCapacityQps !== undefined && <Field label="Read capacity" value={config.readCapacityQps} onChange={(v) => update({ readCapacityQps: v })} suffix="QPS" />}
        {config.writeCapacityQps !== undefined && <Field label="Write capacity" value={config.writeCapacityQps} onChange={(v) => update({ writeCapacityQps: v })} suffix="QPS" />}
        {config.latencyMs !== undefined && <Field label="Base latency" value={config.latencyMs} onChange={(v) => update({ latencyMs: v })} suffix="ms" />}
        {config.processingLatencyMs !== undefined && <Field label="Processing latency" value={config.processingLatencyMs} onChange={(v) => update({ processingLatencyMs: v })} suffix="ms" />}
        {config.failureRate !== undefined && <Field label="Failure rate" value={config.failureRate * 100} step={0.01} onChange={(v) => update({ failureRate: v / 100 })} suffix="%" />}
        {config.cacheHitRate !== undefined && <Field label="Cache hit rate" value={config.cacheHitRate * 100} max={100} step={1} onChange={(v) => update({ cacheHitRate: v / 100 })} suffix="%" />}
      </div>

      <div className="mt-5 rounded-3xl border border-cyan/20 bg-cyan/10 p-4">
        <div className="flex items-center gap-2 text-cyan-100"><BookOpen className="h-4 w-4" /><h3 className="font-bold">Learning Panel</h3></div>
        <div className="mt-3 space-y-3 text-sm leading-6 text-slate-200">
          <p><strong>What is it?</strong> {learning.what}</p>
          <p><strong>Why useful here?</strong> {learning.usefulHere}</p>
          <p><strong>When to use it?</strong> {learning.whenToUse}</p>
          <div>
            <strong>Trade-offs</strong>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
              {learning.tradeoffs.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <p><strong>Real-world:</strong> {learning.realWorld}</p>
          <p className="rounded-2xl bg-black/20 p-3"><strong>Interview question:</strong> {learning.interviewQuestion}</p>
        </div>
      </div>
    </aside>
  );
}
