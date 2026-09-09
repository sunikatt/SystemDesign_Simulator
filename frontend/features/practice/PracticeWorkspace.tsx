'use client';

import { CheckCircle2, MousePointerClick, Play, RotateCcw, Save, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>([]);
  const [checkedRubric, setCheckedRubric] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { canvasComponents?: CanvasComponent[]; checkedRubric?: Record<string, boolean>; notes?: string };
        setCanvasComponents(parsed.canvasComponents ?? []);
        setCheckedRubric(parsed.checkedRubric ?? {});
        setNotes(parsed.notes ?? '');
      } catch {
        // Ignore corrupted local workspace data.
      }
    }
    setHasLoaded(true);
  }, [storageKey]);

  const componentCoverage = components.length === 0 ? 0 : Math.round((new Set(canvasComponents.map((item) => item.name)).size / components.length) * 100);
  const rubricCoverage = rubric.length === 0 ? 0 : Math.round((Object.values(checkedRubric).filter(Boolean).length / rubric.length) * 100);
  const score = Math.round(componentCoverage * 0.6 + rubricCoverage * 0.4);

  const missingComponents = useMemo(() => {
    const selected = new Set(canvasComponents.map((item) => item.name));
    return components.filter((component) => !selected.has(component));
  }, [canvasComponents, components]);

  function addComponent(name: string) {
    setCanvasComponents((current) => current.concat({ id: `${name}-${Date.now()}-${Math.random()}`, name }));
  }

  function removeComponent(id: string) {
    setCanvasComponents((current) => current.filter((item) => item.id !== id));
  }

  function loadSuggested() {
    setCanvasComponents(components.map((name, index) => ({ id: `${name}-${index}`, name })));
    setCheckedRubric(Object.fromEntries(rubric.map((item) => [item, true])));
  }

  function reset() {
    setCanvasComponents([]);
    setCheckedRubric({});
    setNotes('');
    localStorage.removeItem(storageKey);
  }

  function save() {
    localStorage.setItem(storageKey, JSON.stringify({ canvasComponents, checkedRubric, notes }));
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

      <div className="grid min-h-[720px] lg:grid-cols-[320px_minmax(0,1fr)]">
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
              <p className="text-xs text-slate-500">Click to add components to canvas</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {components.map((component) => (
                <button key={component} type="button" onClick={() => addComponent(component)} className="shrink-0 rounded-2xl border border-cyan/20 bg-cyan/10 px-3 py-2 text-xs font-semibold text-cyan-100 hover:bg-cyan/20">
                  + {component}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-5 p-5">
            <div className="min-h-[680px] rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.22)_1px,transparent_0)] [background-size:24px_24px] p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">Architecture canvas</p>
                  <p className="text-xs text-slate-500">Place all major services, stores, caches, queues, and fallback components.</p>
                </div>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300">{canvasComponents.length} blocks</span>
              </div>

              {canvasComponents.length === 0 ? (
                <div className="flex min-h-[560px] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-black/20 p-6 text-center">
                  <div>
                    <p className="font-bold text-white">Canvas is empty</p>
                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">Click components from the top bar or use Suggested design. Then explain the request path and failure path.</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {canvasComponents.map((component, index) => (
                    <div key={component.id} className="rounded-2xl border border-cyan/20 bg-ink/90 p-4 shadow-glow">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan/15 text-xs font-black text-cyan">{index + 1}</div>
                        <button type="button" onClick={() => removeComponent(component.id)} className="rounded-lg p-1 text-slate-500 hover:bg-rose-500/10 hover:text-rose-200" aria-label={`Remove ${component.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <h4 className="mt-4 font-bold text-white">{component.name}</h4>
                      <p className="mt-2 text-xs leading-5 text-slate-400">Explain why this block is required and what happens if it fails.</p>
                    </div>
                  ))}
                </div>
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
                <p className="mt-1 text-xs text-slate-400">60% component coverage + 40% rubric checklist</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-cyan" style={{ width: `${score}%` }} />
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
