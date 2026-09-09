'use client';

import { CheckCircle2, Link2, MousePointerClick, Play, RotateCcw, Save, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type PracticeWorkspaceProps = {
  slug: string;
  title: string;
  description: string;
  components: string[];
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  rubric: string[];
};

type CanvasComponent = {
  id: string;
  name: string;
  x: number;
  y: number;
};

type CanvasConnection = {
  id: string;
  sourceId: string;
  targetId: string;
};

export function PracticeWorkspace({
  slug,
  title,
  description,
  components,
  functionalRequirements,
  nonFunctionalRequirements,
  rubric,
}: PracticeWorkspaceProps) {
  const storageKey = `systemdesign-lab-practice-workspace-${slug}`;
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>([]);
  const [connections, setConnections] = useState<CanvasConnection[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [checkedRubric, setCheckedRubric] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { canvasComponents?: CanvasComponent[]; connections?: CanvasConnection[]; checkedRubric?: Record<string, boolean>; notes?: string };
        setCanvasComponents((parsed.canvasComponents ?? []).map((item, index) => ({ ...item, x: item.x ?? 80 + (index % 3) * 260, y: item.y ?? 80 + Math.floor(index / 3) * 150 })));
        setConnections(parsed.connections ?? []);
        setCheckedRubric(parsed.checkedRubric ?? {});
        setNotes(parsed.notes ?? '');
      } catch {
        // Ignore corrupted local workspace data.
      }
    }
    setHasLoaded(true);
  }, [storageKey]);

  const componentCoverage = components.length === 0 ? 0 : Math.round((new Set(canvasComponents.map((item) => item.name)).size / components.length) * 100);
  const expectedConnectionCount = Math.max(components.length - 1, 1);
  const connectionCoverage = Math.min(100, Math.round((connections.length / expectedConnectionCount) * 100));
  const rubricCoverage = rubric.length === 0 ? 0 : Math.round((Object.values(checkedRubric).filter(Boolean).length / rubric.length) * 100);
  const score = Math.round(componentCoverage * 0.45 + connectionCoverage * 0.25 + rubricCoverage * 0.3);

  const missingComponents = useMemo(() => {
    const selected = new Set(canvasComponents.map((item) => item.name));
    return components.filter((component) => !selected.has(component));
  }, [canvasComponents, components]);

  function positionForIndex(index: number) {
    return {
      x: 70 + (index % 4) * 250,
      y: 90 + Math.floor(index / 4) * 170,
    };
  }

  function addComponent(name: string, x?: number, y?: number) {
    setCanvasComponents((current) => {
      const position = x !== undefined && y !== undefined ? { x, y } : positionForIndex(current.length);
      return current.concat({ id: `${name}-${Date.now()}-${Math.random()}`, name, ...position });
    });
  }

  function removeComponent(id: string) {
    setCanvasComponents((current) => current.filter((item) => item.id !== id));
    setConnections((current) => current.filter((connection) => connection.sourceId !== id && connection.targetId !== id));
    if (selectedSourceId === id) setSelectedSourceId(null);
  }

  function connectFrom(id: string) {
    if (!selectedSourceId) {
      setSelectedSourceId(id);
      return;
    }

    if (selectedSourceId === id) {
      setSelectedSourceId(null);
      return;
    }

    setConnections((current) => {
      const exists = current.some((connection) => connection.sourceId === selectedSourceId && connection.targetId === id);
      if (exists) return current;
      return current.concat({ id: `${selectedSourceId}-${id}-${Date.now()}`, sourceId: selectedSourceId, targetId: id });
    });
    setSelectedSourceId(null);
  }

  function loadSuggested() {
    const suggestedComponents = components.map((name, index) => ({ id: `${name}-${index}`, name, ...positionForIndex(index) }));
    setCanvasComponents(suggestedComponents);
    setConnections(suggestedComponents.slice(0, -1).map((component, index) => ({ id: `${component.id}-${suggestedComponents[index + 1].id}`, sourceId: component.id, targetId: suggestedComponents[index + 1].id })));
    setCheckedRubric(Object.fromEntries(rubric.map((item) => [item, true])));
  }

  function reset() {
    setCanvasComponents([]);
    setConnections([]);
    setSelectedSourceId(null);
    setCheckedRubric({});
    setNotes('');
    localStorage.removeItem(storageKey);
  }

  function save() {
    localStorage.setItem(storageKey, JSON.stringify({ canvasComponents, connections, checkedRubric, notes }));
  }

  function dropOnCanvas(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const bounds = canvasRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const x = Math.max(12, event.clientX - bounds.left - 100);
    const y = Math.max(70, event.clientY - bounds.top - 35);
    const movingId = event.dataTransfer.getData('application/practice-move-id');
    const componentName = event.dataTransfer.getData('application/practice-component');

    if (movingId) {
      setCanvasComponents((current) => current.map((item) => item.id === movingId ? { ...item, x, y } : item));
      return;
    }

    if (componentName) addComponent(componentName, x, y);
  }

  return (
    <section className="glass overflow-hidden rounded-3xl">
      <div className="border-b border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan">Interactive practice workspace</p>
            <h2 className="mt-1 text-2xl font-black text-white">Build your {title} design</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Use the component bar, place building blocks on the canvas, then run the rubric simulator to see what is missing.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={loadSuggested} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-cyan-100">
              <MousePointerClick className="h-4 w-4" /> Suggested design
            </button>
            <button type="button" onClick={save} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
              <Save className="h-4 w-4" /> Save local
            </button>
            <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-2xl border border-rose-400/30 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/10">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-h-[820px] lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-black/20 p-5 lg:border-b-0 lg:border-r">
          <p className="text-sm font-semibold text-cyan">Problem brief</p>
          <h3 className="mt-2 text-xl font-black text-white">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Functional</p>
            <ul className="mt-3 space-y-2">
              {functionalRequirements.map((item) => (
                <li key={item} className="flex gap-2 text-xs leading-5 text-slate-300"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" /> {item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Non-functional</p>
            <ul className="mt-3 space-y-2">
              {nonFunctionalRequirements.map((item) => (
                <li key={item} className="flex gap-2 text-xs leading-5 text-slate-300"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" /> {item}</li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <div className="border-b border-white/10 bg-panel/80 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-cyan">Component bar</p>
              <p className="text-xs text-slate-500">Drag into canvas or click to add</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {components.map((component) => (
                <button
                  key={component}
                  type="button"
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData('application/practice-component', component)}
                  onClick={() => addComponent(component)}
                  className="shrink-0 cursor-grab rounded-2xl border border-cyan/20 bg-cyan/10 px-3 py-2 text-xs font-semibold text-cyan-100 hover:bg-cyan/20 active:cursor-grabbing"
                >
                  + {component}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-5 p-5">
            <div
              ref={canvasRef}
              onDragOver={(event) => event.preventDefault()}
              onDrop={dropOnCanvas}
              className="relative min-h-[760px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.22)_1px,transparent_0)] [background-size:24px_24px] p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">Architecture canvas</p>
                  <p className="text-xs text-slate-500">Place all major services, stores, caches, queues, and fallback components.</p>
                </div>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300">{canvasComponents.length} blocks</span>
              </div>

              {canvasComponents.length === 0 ? (
                <div className="flex min-h-[640px] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-black/20 p-6 text-center">
                  <div>
                    <p className="font-bold text-white">Canvas is empty</p>
                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">Click components from the top bar or use Suggested design. Then explain the request path and failure path.</p>
                  </div>
                </div>
              ) : (
                <>
                  <svg className="pointer-events-none absolute inset-0 h-full w-full">
                    <defs>
                      <marker id={`arrow-${slug}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L9,3 z" fill="#22d3ee" />
                      </marker>
                    </defs>
                    {connections.map((connection) => {
                      const source = canvasComponents.find((item) => item.id === connection.sourceId);
                      const target = canvasComponents.find((item) => item.id === connection.targetId);
                      if (!source || !target) return null;
                      const startX = source.x + 110;
                      const startY = source.y + 55;
                      const endX = target.x + 110;
                      const endY = target.y + 55;
                      return <line key={connection.id} x1={startX} y1={startY} x2={endX} y2={endY} stroke="#22d3ee" strokeWidth="2" strokeDasharray="7 5" markerEnd={`url(#arrow-${slug})`} />;
                    })}
                  </svg>
                  {canvasComponents.map((component, index) => (
                    <div
                      key={component.id}
                      draggable
                      onDragStart={(event) => event.dataTransfer.setData('application/practice-move-id', component.id)}
                      className={`absolute w-[220px] cursor-grab rounded-2xl border bg-ink/95 p-4 shadow-glow active:cursor-grabbing ${selectedSourceId === component.id ? 'border-emerald-300 ring-2 ring-emerald-300/30' : 'border-cyan/20'}`}
                      style={{ left: component.x, top: component.y }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan/15 text-xs font-black text-cyan">{index + 1}</div>
                        <button type="button" onClick={() => removeComponent(component.id)} className="rounded-lg p-1 text-slate-500 hover:bg-rose-500/10 hover:text-rose-200" aria-label={`Remove ${component.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <h4 className="mt-4 font-bold text-white">{component.name}</h4>
                      <p className="mt-2 text-xs leading-5 text-slate-400">Drag me. Then connect request/failure flow.</p>
                      <button type="button" onClick={() => connectFrom(component.id)} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 hover:bg-cyan/10">
                        <Link2 className="h-3.5 w-3.5" /> {selectedSourceId && selectedSourceId !== component.id ? 'Connect here' : selectedSourceId === component.id ? 'Selected' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-cyan">Rubric simulator</p>
                  <button type="button" onClick={save} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/10">
                    <Play className="h-3.5 w-3.5" /> Run
                  </button>
                </div>
                <div className="text-4xl font-black text-white">{score}%</div>
                <p className="mt-1 text-xs text-slate-400">45% components + 25% connections + 30% rubric checklist</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-cyan" style={{ width: `${score}%` }} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-2"><div className="font-bold text-white">{componentCoverage}%</div><div className="text-slate-500">Blocks</div></div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-2"><div className="font-bold text-white">{connectionCoverage}%</div><div className="text-slate-500">Links</div></div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-2"><div className="font-bold text-white">{rubricCoverage}%</div><div className="text-slate-500">Rubric</div></div>
                </div>
                {missingComponents.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-100">Missing components</p>
                    <p className="mt-2 text-xs leading-5 text-amber-50/90">{missingComponents.join(', ')}</p>
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-cyan">Rubric checklist</p>
                <div className="mt-3 space-y-2">
                  {rubric.map((item) => (
                    <label key={item} className="flex cursor-pointer gap-2 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs leading-5 text-slate-300 hover:bg-white/[0.04]">
                      <input
                        type="checkbox"
                        checked={Boolean(checkedRubric[item])}
                        onChange={(event) => setCheckedRubric((current) => ({ ...current, [item]: event.target.checked }))}
                        className="mt-1"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-cyan">Design notes</p>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Write your trade-offs, bottlenecks, fallback behavior, and final explanation..."
                  className="mt-3 min-h-32 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan/40"
                />
                <p className="mt-2 text-xs text-slate-500">{hasLoaded ? 'Saved locally in this browser.' : 'Loading workspace...'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
