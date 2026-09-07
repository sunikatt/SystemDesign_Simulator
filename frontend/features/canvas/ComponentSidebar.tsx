'use client';

import { componentDescriptions, componentLabels, palette } from '@/lib/components';
import { ComponentType } from '@/types/simulation';

export function ComponentSidebar() {
  function onDragStart(event: React.DragEvent, type: ComponentType) {
    event.dataTransfer.setData('application/systemdesign-component', type);
    event.dataTransfer.effectAllowed = 'move';
  }

  return (
    <aside className="flex h-full flex-col gap-3 border-r border-white/10 bg-panel/80 p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Components</p>
        <p className="mt-2 text-sm text-slate-400">Drag onto the canvas, connect them, then run the simulation.</p>
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
        Tip: Start with Gateway → Load Balancer → URL Service → Redis → PostgreSQL. Then try removing Redis to see the database bottleneck.
      </div>
    </aside>
  );
}
