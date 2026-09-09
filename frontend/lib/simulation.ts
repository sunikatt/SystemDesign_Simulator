import { Edge, Node } from '@xyflow/react';
import { ArchitectureNodeData, ComponentSimulation, ComponentStatus, ComponentType, Recommendation, SimulationResult, TrafficProfile } from '@/types/simulation';

export const urlShortenerTraffic: TrafficProfile = {
  totalRps: 10_000,
  readPercentage: 0.9,
  writePercentage: 0.1,
  targetLatencyMs: 200,
};

function statusFor(utilization: number, failureRate = 0): ComponentStatus {
  if (failureRate >= 0.5) return 'FAILED';
  if (utilization >= 1) return 'OVERLOADED';
  if (utilization >= 0.85) return 'HIGH_LOAD';
  if (utilization >= 0.7) return 'WARNING';
  return 'HEALTHY';
}

function latency(baseLatency: number, utilization: number): number {
  const capped = Math.min(utilization, 2.5);
  const overloadPenalty = utilization > 1 ? (utilization - 1) * baseLatency * 6 : 0;
  return Math.round((baseLatency * (1 + capped * capped) + overloadPenalty) * 10) / 10;
}

function queueDepth(incoming: number, capacity: number): number {
  if (incoming <= capacity) return Math.round(Math.max(0, incoming * Math.pow(incoming / Math.max(capacity, 1), 3) * 0.02));
  return Math.round((incoming - capacity) * 2 + incoming * 0.1);
}

function errorRate(utilization: number, baseFailureRate = 0): number {
  const overload = utilization <= 0.85 ? 0 : Math.pow(utilization - 0.85, 2) * 0.18;
  return Math.min(0.95, baseFailureRate + overload + (utilization > 1 ? (utilization - 1) * 0.25 : 0));
}

function createComponentResult(args: {
  nodeId: string;
  label: string;
  type: ComponentType;
  incomingRps: number;
  readRps: number;
  writeRps: number;
  capacity: number;
  baseLatency: number;
  baseFailureRate?: number;
  explanation: string;
}): ComponentSimulation {
  const utilization = args.incomingRps / Math.max(args.capacity, 1);
  const status = statusFor(utilization, args.baseFailureRate);
  return {
    nodeId: args.nodeId,
    label: args.label,
    type: args.type,
    incomingRps: Math.round(args.incomingRps),
    readRps: Math.round(args.readRps),
    writeRps: Math.round(args.writeRps),
    capacity: Math.round(args.capacity),
    utilization,
    latencyMs: latency(args.baseLatency, utilization),
    queueDepth: queueDepth(args.incomingRps, args.capacity),
    errorRate: errorRate(utilization, args.baseFailureRate),
    status,
    explanation: args.explanation,
  };
}

function findNode(nodes: Node<ArchitectureNodeData>[], type: ComponentType) {
  return nodes.find((node) => node.data.type === type);
}

function hasPath(nodes: Node<ArchitectureNodeData>[], edges: Edge[], fromType: ComponentType, toType: ComponentType): boolean {
  const from = findNode(nodes, fromType);
  const to = findNode(nodes, toType);
  if (!from || !to) return false;

  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    const list = adjacency.get(edge.source) ?? [];
    list.push(edge.target);
    adjacency.set(edge.source, list);
  }

  const queue = [from.id];
  const seen = new Set<string>();
  while (queue.length) {
    const current = queue.shift()!;
    if (current === to.id) return true;
    if (seen.has(current)) continue;
    seen.add(current);
    queue.push(...(adjacency.get(current) ?? []));
  }
  return false;
}

export function simulateArchitecture(nodes: Node<ArchitectureNodeData>[], edges: Edge[], traffic: TrafficProfile = urlShortenerTraffic): SimulationResult {
  const total = traffic.totalRps;
  const reads = total * traffic.readPercentage;
  const writes = total * traffic.writePercentage;
  const components: ComponentSimulation[] = [];

  const gateway = findNode(nodes, 'apiGateway');
  const lb = findNode(nodes, 'loadBalancer');
  const app = findNode(nodes, 'appService');
  const redis = findNode(nodes, 'redis');
  const postgres = findNode(nodes, 'postgres');

  if (gateway) {
    components.push(createComponentResult({
      nodeId: gateway.id,
      label: gateway.data.label,
      type: 'apiGateway',
      incomingRps: total,
      readRps: reads,
      writeRps: writes,
      capacity: gateway.data.config.capacityRps ?? 1,
      baseLatency: gateway.data.config.latencyMs ?? 5,
      baseFailureRate: gateway.data.config.failureRate ?? 0,
      explanation: 'All frontend/mobile/client traffic enters through the API Gateway, where URL Shortener APIs are routed, rate-limited, logged, and forwarded to healthy backend server pools.'
    }));
  }

  if (lb) {
    const capacity = (lb.data.config.instances ?? 1) * (lb.data.config.capacityPerInstanceRps ?? 1);
    components.push(createComponentResult({
      nodeId: lb.id,
      label: lb.data.label,
      type: 'loadBalancer',
      incomingRps: total,
      readRps: reads,
      writeRps: writes,
      capacity,
      baseLatency: lb.data.config.latencyMs ?? 3,
      explanation: `Gateway traffic is distributed across ${lb.data.config.instances ?? 1} load balancer instance(s), then spread to URL service servers using health checks.`
    }));
  }

  if (app) {
    const capacity = (app.data.config.instances ?? 1) * (app.data.config.capacityPerInstanceRps ?? 1);
    components.push(createComponentResult({
      nodeId: app.id,
      label: app.data.label,
      type: 'appService',
      incomingRps: total,
      readRps: reads,
      writeRps: writes,
      capacity,
      baseLatency: app.data.config.processingLatencyMs ?? 15,
      explanation: 'The stateless backend URL service handles redirects, short URL creation, cache lookup, and durable database writes.'
    }));
  }

  let postgresReadRps = reads;
  let redisServedRps = 0;
  let cacheMissRps = reads;

  if (redis) {
    const cacheHitRate = redis.data.config.cacheHitRate ?? 0;
    redisServedRps = reads * cacheHitRate;
    cacheMissRps = reads - redisServedRps;
    postgresReadRps = cacheMissRps;
    components.push(createComponentResult({
      nodeId: redis.id,
      label: redis.data.label,
      type: 'redis',
      incomingRps: reads,
      readRps: reads,
      writeRps: 0,
      capacity: redis.data.config.opsPerSecond ?? 1,
      baseLatency: redis.data.config.latencyMs ?? 2,
      explanation: `${Math.round(redisServedRps)} read RPS are served from cache. ${Math.round(cacheMissRps)} read RPS miss cache and continue to PostgreSQL.`,
    }));
  }

  if (postgres) {
    const readCapacity = postgres.data.config.readCapacityQps ?? 1;
    const writeCapacity = postgres.data.config.writeCapacityQps ?? 1;
    const readUtilization = postgresReadRps / Math.max(readCapacity, 1);
    const writeUtilization = writes / Math.max(writeCapacity, 1);
    const utilization = Math.max(readUtilization, writeUtilization);
    const weightedCapacity = postgresReadRps + writes > 0 ? (postgresReadRps + writes) / Math.max(utilization, 0.001) : readCapacity + writeCapacity;
    const baseLatency = postgres.data.config.latencyMs ?? 20;
    const status = statusFor(utilization);
    components.push({
      nodeId: postgres.id,
      label: postgres.data.label,
      type: 'postgres',
      incomingRps: Math.round(postgresReadRps + writes),
      readRps: Math.round(postgresReadRps),
      writeRps: Math.round(writes),
      capacity: Math.round(weightedCapacity),
      utilization,
      latencyMs: latency(baseLatency, utilization),
      queueDepth: queueDepth(postgresReadRps + writes, weightedCapacity),
      errorRate: errorRate(utilization),
      status,
      explanation: `PostgreSQL receives ${Math.round(postgresReadRps)} read QPS and ${Math.round(writes)} write QPS. It is limited by the larger of read utilization and write utilization.`,
    });
  }

  const missing: Recommendation[] = [];
  if (!gateway) missing.push({ title: 'Add an API Gateway', why: 'A public system needs a controlled entry point for routing, throttling, and protection.', tradeOff: 'It adds another hop and must be scaled carefully.' });
  if (!lb) missing.push({ title: 'Add a Load Balancer', why: 'The service tier needs traffic distribution and health checks for availability.', tradeOff: 'It introduces another operational component.' });
  if (!app) missing.push({ title: 'Add Application Service instances', why: 'Business logic must run in horizontally scalable stateless services.', tradeOff: 'More instances increase cost and deployment complexity.' });
  if (!redis) missing.push({ title: 'Add Redis caching', why: '90% of traffic is reads. Caching popular mappings reduces database load and latency.', tradeOff: 'Cache invalidation, memory cost, and stale values become concerns.' });
  if (!postgres) missing.push({ title: 'Add durable PostgreSQL storage', why: 'URL mappings must persist even if cache or services restart.', tradeOff: 'Databases need backup, scaling, and indexing strategy.' });

  const topologyRecommendations: Recommendation[] = [];
  if (redis && postgres && !hasPath(nodes, edges, 'redis', 'postgres')) {
    topologyRecommendations.push({ title: 'Connect Redis miss path to PostgreSQL', why: 'Cache misses need durable storage lookup, otherwise uncached URLs cannot resolve.', tradeOff: 'The database still needs enough capacity for misses and writes.' });
  }

  const bottleneck = [...components].sort((a, b) => b.utilization - a.utilization)[0];
  const bottleneckRecommendations = bottleneck ? recommendationsFor(bottleneck, Boolean(redis)) : [];
  const totalLatencyMs = Math.round(components.reduce((sum, c) => sum + c.latencyMs, 0) * 10) / 10;
  const totalErrorRate = 1 - components.reduce((success, c) => success * (1 - c.errorRate), 1);
  const score = scoreArchitecture({ components, totalLatencyMs, totalErrorRate, nodes, edges, hasRedis: Boolean(redis), hasPostgres: Boolean(postgres) });

  const recommendations = [...missing, ...topologyRecommendations, ...bottleneckRecommendations]
    .filter((recommendation, index, all) => all.findIndex((item) => item.title === recommendation.title) === index)
    .slice(0, 5);

  return {
    traffic,
    components,
    totalLatencyMs,
    totalErrorRate,
    bottleneck: bottleneck?.status === 'HEALTHY' ? undefined : bottleneck,
    recommendations,
    score,
    formulas: [
      'utilization = incoming_requests_per_second / component_capacity',
      'status: 0–70% healthy, 70–85% warning, 85–100% high load, 100%+ overloaded',
      'latency = base_latency × (1 + utilization²) plus overload penalty above 100%',
      'queue_depth grows slowly below capacity and rapidly above capacity',
      'API Gateway routes URL Shortener API traffic and forwards requests to healthy backend pools',
      'Load Balancer distributes gateway traffic across stateless URL service instances',
      'Redis read hits = read_rps × cache_hit_rate; Redis misses go to PostgreSQL',
      `traffic mix = ${Math.round(traffic.readPercentage * 100)}% reads / ${Math.round(traffic.writePercentage * 100)}% writes at ${traffic.totalRps.toLocaleString()} RPS`,
      'PostgreSQL utilization = max(read_qps / read_capacity, write_qps / write_capacity)',
    ],
  };
}

function recommendationsFor(bottleneck: ComponentSimulation, hasRedis: boolean): Recommendation[] {
  if (bottleneck.type === 'postgres') {
    return [
      hasRedis
        ? { title: 'Increase cache hit rate or add read replicas', why: 'PostgreSQL is the bottleneck. More reads should be served outside the primary database.', tradeOff: 'Read replicas can lag; higher cache hit rate may increase stale-data risk.' }
        : { title: 'Add Redis caching', why: 'Most traffic is reads, so caching popular URLs can remove thousands of QPS from PostgreSQL.', tradeOff: 'Adds memory cost and cache invalidation complexity.' },
      { title: 'Optimize write path', why: 'If writes are near capacity, ID generation and indexes should be designed to avoid hot spots.', tradeOff: 'Write optimization can reduce query flexibility.' },
    ];
  }
  if (bottleneck.type === 'appService') {
    return [{ title: 'Add more stateless service instances', why: 'The application tier is horizontally scalable when it does not store local session state.', tradeOff: 'More instances cost more and require deployment automation.' }];
  }
  if (bottleneck.type === 'loadBalancer') {
    return [{ title: 'Scale load balancing capacity', why: 'After the API Gateway routes requests, the balancer must distribute traffic across URL service servers without becoming the choke point.', tradeOff: 'Larger or more balancers increase infrastructure cost.' }];
  }
  if (bottleneck.type === 'apiGateway') {
    return [{ title: 'Scale the API Gateway tier or add stricter rate limits', why: 'The gateway is the first production component for all URL Shortener traffic. It must route, throttle, and forward traffic safely to backend pools.', tradeOff: 'Strict limits can reject legitimate spikes; more gateway capacity costs more.' }];
  }
  return [{ title: 'Scale Redis or reduce cache traffic', why: 'The cache is receiving more operations than configured capacity.', tradeOff: 'Redis clustering adds operational complexity.' }];
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreArchitecture(args: { components: ComponentSimulation[]; totalLatencyMs: number; totalErrorRate: number; nodes: Node<ArchitectureNodeData>[]; edges: Edge[]; hasRedis: boolean; hasPostgres: boolean; }) {
  const maxUtil = args.components.length ? Math.max(...args.components.map((c) => c.utilization)) : 2;
  const overloadedCount = args.components.filter((c) => c.status === 'OVERLOADED' || c.status === 'FAILED').length;
  const warningCount = args.components.filter((c) => c.status === 'WARNING' || c.status === 'HIGH_LOAD').length;
  const instanceBonus = args.nodes.reduce((sum, node) => sum + Math.max(0, (node.data.config.instances ?? 1) - 1), 0) * 3;

  const scalability = clampScore(100 - Math.max(0, maxUtil - 0.55) * 95 - overloadedCount * 20 + instanceBonus);
  const reliability = clampScore(100 - overloadedCount * 28 - warningCount * 9 - (args.hasPostgres ? 0 : 35) + instanceBonus * 0.8);
  const latencyScore = clampScore(100 - Math.max(0, args.totalLatencyMs - 80) * 0.45 - args.totalErrorRate * 250 + (args.hasRedis ? 8 : -12));
  const costEfficiency = clampScore(95 - args.nodes.length * 5 - instanceBonus * 1.5 - Math.max(0, 0.45 - maxUtil) * 25);
  const simplicity = clampScore(100 - args.nodes.length * 6 - args.edges.length * 3 + (args.nodes.length >= 4 ? 8 : 0));
  const overall = clampScore(scalability * 0.28 + reliability * 0.24 + latencyScore * 0.22 + costEfficiency * 0.13 + simplicity * 0.13);

  return {
    overall,
    scalability,
    reliability,
    latency: latencyScore,
    costEfficiency,
    simplicity,
    explanations: {
      scalability: `Based on peak utilization of ${Math.round(maxUtil * 100)}%, overloaded components, and horizontal scaling instances.`,
      reliability: `Penalizes overloaded components and missing durable storage; rewards redundancy in scalable tiers.`,
      latency: `Estimated end-to-end latency is ${args.totalLatencyMs}ms versus the 200ms target, with error rate impact included.`,
      costEfficiency: 'Rewards useful capacity without excessive components or idle over-provisioning.',
      simplicity: 'Rewards architectures that satisfy requirements without unnecessary graph complexity.',
      overall: 'Weighted average: scalability 28%, reliability 24%, latency 22%, cost 13%, simplicity 13%.',
    },
  };
}
