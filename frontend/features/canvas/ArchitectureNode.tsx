'use client';

import { Handle, NodeProps, Position } from '@xyflow/react';
import { Activity, Database, GitBranch, HardDrive, Server, Shield } from 'lucide-react';
import { ArchitectureNodeData, ComponentStatus, ComponentType } from '@/types/simulation';

const iconMap: Record<ComponentType, React.ElementType> = {
  apiGateway: Shield,
  loadBalancer: GitBranch,
  appService: Server,
  redis: HardDrive,
  postgres: Database,
};

const statusClass: Record<ComponentStatus | 'IDLE', string> = {
  IDLE: 'border-slate-500/30 bg-slate-900/90',
  HEALTHY: 'border-emerald-400/50 bg-emerald-950/60',
  WARNING: 'border-amber-300/60 bg-amber-950/60',
  HIGH_LOAD: 'border-orange-400/70 bg-orange-950/60',
  OVERLOADED: 'border-red-400/70 bg-red-950/70',
  FAILED: 'border-red-500 bg-red-950',
};

export function ArchitectureNode({ data, selected }: NodeProps) {
  const nodeData = data as ArchitectureNodeData & { status?: ComponentStatus; utilization?: number; latencyMs?: number };
  const Icon = iconMap[nodeData.type];
  const status = nodeData.status ?? 'IDLE';

  return (
    <div className={`min-w-56 rounded-2xl border p-3 text-white shadow-2xl ${statusClass[status]} ${selected ? 'ring-2 ring-cyan' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-white/10 p-2"><Icon className="h-5 w-5 text-cyan" /></div>
          <div>
            <div className="font-bold">{nodeData.label}</div>
            <div className="text-xs text-slate-300">{status}</div>
          </div>
        </div>
        <Activity className="h-4 w-4 text-slate-300" />
      </div>
      {nodeData.utilization !== undefined && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-black/25 p-2">
            <div className="text-slate-400">Utilization</div>
            <div className="font-bold">{Math.round(nodeData.utilization * 100)}%</div>
          </div>
          <div className="rounded-xl bg-black/25 p-2">
            <div className="text-slate-400">Latency</div>
            <div className="font-bold">{nodeData.latencyMs}ms</div>
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
