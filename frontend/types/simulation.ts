export type ComponentType = 'apiGateway' | 'loadBalancer' | 'appService' | 'redis' | 'postgres';

export type ComponentStatus = 'HEALTHY' | 'WARNING' | 'HIGH_LOAD' | 'OVERLOADED' | 'FAILED';

export type ArchitectureNodeData = {
  [key: string]: unknown;
  label: string;
  type: ComponentType;
  config: ComponentConfig;
};

export type ComponentConfig = {
  capacityRps?: number;
  latencyMs?: number;
  failureRate?: number;
  instances?: number;
  capacityPerInstanceRps?: number;
  processingLatencyMs?: number;
  opsPerSecond?: number;
  cacheHitRate?: number;
  readCapacityQps?: number;
  writeCapacityQps?: number;
};

export type TrafficProfile = {
  totalRps: number;
  readPercentage: number;
  writePercentage: number;
  targetLatencyMs: number;
};

export type ComponentSimulation = {
  nodeId: string;
  label: string;
  type: ComponentType;
  incomingRps: number;
  readRps: number;
  writeRps: number;
  capacity: number;
  utilization: number;
  latencyMs: number;
  queueDepth: number;
  errorRate: number;
  status: ComponentStatus;
  explanation: string;
};

export type Recommendation = {
  title: string;
  why: string;
  tradeOff: string;
};

export type ScoreBreakdown = {
  overall: number;
  scalability: number;
  reliability: number;
  latency: number;
  costEfficiency: number;
  simplicity: number;
  explanations: Record<string, string>;
};

export type SimulationResult = {
  traffic: TrafficProfile;
  components: ComponentSimulation[];
  totalLatencyMs: number;
  totalErrorRate: number;
  bottleneck?: ComponentSimulation;
  recommendations: Recommendation[];
  score: ScoreBreakdown;
  formulas: string[];
};
