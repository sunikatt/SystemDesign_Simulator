'use client';

import { componentDescriptions, componentLabels, palette } from '@/lib/components';
import { ComponentType, TrafficProfile } from '@/types/simulation';

type ComponentSidebarProps = {
  traffic: TrafficProfile;
  onTrafficChange: (traffic: TrafficProfile) => void;
};

function TrafficField({ label, value, min = 0, max, step = 1, suffix, onChange }: { label: string; value: number; min?: number; max?: number; step?: number; suffix?: string; onChange: (value: number) => void }) {
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

export function ComponentSidebar({ traffic, onTrafficChange }: ComponentSidebarProps) {
  function onDragStart(event: React.DragEvent, type: ComponentType) {
    event.dataTransfer.setData('application/systemdesign-component', type);
    event.dataTransfer.effectAllowed = 'move';
  }

  const readPercent = Math.round(traffic.readPercentage * 100);

  return (
    <aside className="flex h-full flex-col gap-3 overflow-y-auto border-r border-white/10 bg-panel/80 p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Traffic Profile</p>
        <p className="mt-2 text-sm text-slate-400">Change load to test whether your design still survives.</p>
      </div>
      <div className="space-y-3">
        <TrafficField label="Total traffic" value={traffic.totalRps} min={100} step={100} suffix="RPS" onChange={(totalRps) => onTrafficChange({ ...traffic, totalRps })} />
        <TrafficField label="Read traffic" value={readPercent} min={0} max={100} suffix="%" onChange={(value) => onTrafficChange({ ...traffic, readPercentage: value / 100, writePercentage: 1 - value / 100 })} />
        <TrafficField label="Target latency" value={traffic.targetLatencyMs} min={10} step={10} suffix="ms" onChange={(targetLatencyMs) => onTrafficChange({ ...traffic, targetLatencyMs })} />
      </div>

      <div className="mt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Components</p>
        <p className="mt-2 text-sm text-slate-400">Drag production components onto the canvas, connect frontend-to-backend traffic flow, then run the simulation.</p>
      </div>
      <div className="space-y-3">
        {palette.map((type) => (
          <div
            key={type}
            draggable
            onDragStart={(event) => onDragStart(event, type)}
            className="cursor-grab rounded-2xl border border-white/10 bg-white/[0.04] p-3 active:cursor-grabbing hover:border-cyan/60 hover:bg-cyan/10"
          >
            <div className="font-semibold text-white">{componentLabels[type]}</div>
            <div className="mt-1 text-xs leading-5 text-slate-400">{componentDescriptions[type]}</div>
          </div>
        ))}
      </div>
      <div className="mt-auto rounded-2xl border border-violet-400/30 bg-violet-500/10 p-3 text-xs leading-5 text-violet-100">
        Tip: Start with API Gateway → Load Balancer → URL Service → Redis → PostgreSQL. The gateway routes/protects URL traffic; the balancer spreads it across backend URL service servers.
      </div>
    </aside>
  );
}
