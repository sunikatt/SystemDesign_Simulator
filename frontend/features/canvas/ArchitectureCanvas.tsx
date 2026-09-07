'use client';

import '@xyflow/react/dist/style.css';
import { useCallback, useMemo, useRef, useState } from 'react';
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, MiniMap, Node, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import { Play, RotateCcw, Save, Sparkles, Trash2 } from 'lucide-react';
import { defaultConfigs, componentLabels } from '@/lib/components';
import { simulateArchitecture } from '@/lib/simulation';
import { ArchitectureNodeData, ComponentConfig, ComponentType, SimulationResult } from '@/types/simulation';
import { ArchitectureNode } from './ArchitectureNode';
import { ComponentSidebar } from './ComponentSidebar';
import { Inspector } from './Inspector';
import { ResultsPanel } from '../results/ResultsPanel';

const STORAGE_KEY = 'systemdesign-lab-url-shortener-design';

type ArchitectureFlowNode = Node<ArchitectureNodeData, 'architecture'>;

const initialNodes: ArchitectureFlowNode[] = [
  { id: 'api-1', type: 'architecture', position: { x: 60, y: 40 }, data: { label: 'API Gateway', type: 'apiGateway', config: { ...defaultConfigs.apiGateway } } },
  { id: 'lb-1', type: 'architecture', position: { x: 60, y: 190 }, data: { label: 'Load Balancer', type: 'loadBalancer', config: { ...defaultConfigs.loadBalancer } } },
  { id: 'svc-1', type: 'architecture', position: { x: 60, y: 340 }, data: { label: 'URL Service', type: 'appService', config: { ...defaultConfigs.appService } } },
  { id: 'db-1', type: 'architecture', position: { x: 60, y: 500 }, data: { label: 'PostgreSQL', type: 'postgres', config: { ...defaultConfigs.postgres } } },
];

const initialEdges: Edge[] = [
  { id: 'api-lb', source: 'api-1', target: 'lb-1', animated: false },
  { id: 'lb-svc', source: 'lb-1', target: 'svc-1', animated: false },
  { id: 'svc-db', source: 'svc-1', target: 'db-1', animated: false },
];

const suggestedNodes: ArchitectureFlowNode[] = [
  { id: 'api-1', type: 'architecture', position: { x: 260, y: 20 }, data: { label: 'API Gateway', type: 'apiGateway', config: { ...defaultConfigs.apiGateway } } },
  { id: 'lb-1', type: 'architecture', position: { x: 260, y: 160 }, data: { label: 'Load Balancer', type: 'loadBalancer', config: { ...defaultConfigs.loadBalancer } } },
  { id: 'svc-1', type: 'architecture', position: { x: 260, y: 300 }, data: { label: 'URL Service', type: 'appService', config: { ...defaultConfigs.appService } } },
  { id: 'redis-1', type: 'architecture', position: { x: 80, y: 470 }, data: { label: 'Redis', type: 'redis', config: { ...defaultConfigs.redis } } },
  { id: 'db-1', type: 'architecture', position: { x: 440, y: 470 }, data: { label: 'PostgreSQL', type: 'postgres', config: { ...defaultConfigs.postgres } } },
];

const suggestedEdges: Edge[] = [
  { id: 'api-lb', source: 'api-1', target: 'lb-1' },
  { id: 'lb-svc', source: 'lb-1', target: 'svc-1' },
  { id: 'svc-redis', source: 'svc-1', target: 'redis-1' },
  { id: 'redis-db', source: 'redis-1', target: 'db-1' },
  { id: 'svc-db-write', source: 'svc-1', target: 'db-1' },
];

function CanvasInner() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<ArchitectureFlowNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [result, setResult] = useState<SimulationResult | undefined>();
  const [isRunning, setIsRunning] = useState(false);

  const nodeTypes = useMemo(() => ({ architecture: ArchitectureNode }), []);
  const selectedNode = nodes.find((node) => node.selected);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, animated: Boolean(result), style: { stroke: '#38bdf8' } }, eds));
  }, [result, setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/systemdesign-component') as ComponentType;
    if (!type) return;
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const id = `${type}-${Date.now()}`;
    setNodes((nds) => nds.concat({
      id,
      type: 'architecture',
      position,
      data: { label: componentLabels[type], type, config: { ...defaultConfigs[type] } },
    }));
  }, [screenToFlowPosition, setNodes]);

  function updateConfig(nodeId: string, config: ComponentConfig) {
    setNodes((current) => current.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, config } } : node));
  }

  function deleteNode(nodeId: string) {
    setNodes((current) => current.filter((node) => node.id !== nodeId));
    setEdges((current) => current.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }

  function runSimulation() {
    setIsRunning(true);
    setEdges((current) => current.map((edge) => ({ ...edge, animated: true })));
    const simulation = simulateArchitecture(nodes, edges);
    setTimeout(() => {
      setResult(simulation);
      setNodes((current) => current.map((node) => {
        const component = simulation.components.find((item) => item.nodeId === node.id);
        if (!component) return { ...node, data: { ...node.data, status: undefined, utilization: undefined, latencyMs: undefined } };
        return { ...node, data: { ...node.data, status: component.status, utilization: component.utilization, latencyMs: component.latencyMs } };
      }));
      setIsRunning(false);
    }, 650);
  }

  function reset() {
    setResult(undefined);
    setNodes(initialNodes);
    setEdges(initialEdges);
    setTimeout(() => fitView({ padding: 0.18, duration: 400 }), 50);
  }

  function loadSuggested() {
    setResult(undefined);
    setNodes(suggestedNodes);
    setEdges(suggestedEdges);
    setTimeout(() => fitView({ padding: 0.18, duration: 400 }), 50);
  }

  function clearCanvas() {
    setResult(undefined);
    setNodes([]);
    setEdges([]);
  }

  function saveArchitecture() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
  }

  function loadSaved() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as { nodes: ArchitectureFlowNode[]; edges: Edge[] };
    setNodes(parsed.nodes);
    setEdges(parsed.edges);
    setResult(undefined);
  }

  return (
    <div className="grid h-[760px] overflow-hidden rounded-3xl border border-white/10 bg-ink/80 lg:grid-cols-[290px_minmax(0,1fr)_360px]">
      <ComponentSidebar />
      <main className="relative min-h-0" ref={wrapperRef}>
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          <button onClick={runSimulation} disabled={isRunning} className="inline-flex items-center gap-2 rounded-2xl bg-cyan px-4 py-2 text-sm font-bold text-ink hover:bg-cyan-200 disabled:opacity-60">
            <Play className="h-4 w-4" /> {isRunning ? 'Simulating...' : 'Run Simulation'}
          </button>
          <button onClick={loadSuggested} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-panel/90 px-3 py-2 text-sm text-white hover:bg-white/10"><Sparkles className="h-4 w-4" /> Suggested</button>
          <button onClick={saveArchitecture} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-panel/90 px-3 py-2 text-sm text-white hover:bg-white/10"><Save className="h-4 w-4" /> Save</button>
          <button onClick={loadSaved} className="rounded-2xl border border-white/15 bg-panel/90 px-3 py-2 text-sm text-white hover:bg-white/10">Load</button>
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-panel/90 px-3 py-2 text-sm text-white hover:bg-white/10"><RotateCcw className="h-4 w-4" /> Reset</button>
          <button onClick={clearCanvas} className="inline-flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100 hover:bg-red-500/20"><Trash2 className="h-4 w-4" /> Clear</button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#334155" variant={BackgroundVariant.Dots} gap={22} size={1} />
          <Controls className="!border-white/10 !bg-panel !text-white" />
          <MiniMap className="!bg-panel" nodeColor="#7c3aed" maskColor="rgba(2,6,23,0.65)" />
        </ReactFlow>
      </main>
      <Inspector selectedNode={selectedNode} onConfigChange={updateConfig} onDelete={deleteNode} />
      {result && (
        <div className="col-span-full max-h-[720px] overflow-y-auto border-t border-white/10 bg-ink p-5">
          <ResultsPanel result={result} />
        </div>
      )}
    </div>
  );
}

export function ArchitectureCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
