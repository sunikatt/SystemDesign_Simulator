import { ComponentConfig, ComponentType } from '@/types/simulation';

export const componentLabels: Record<ComponentType, string> = {
  apiGateway: 'API Gateway',
  loadBalancer: 'Load Balancer',
  appService: 'Application Service',
  redis: 'Redis',
  postgres: 'PostgreSQL',
};

export const componentDescriptions: Record<ComponentType, string> = {
  apiGateway: 'Entry point that authenticates, routes, rate-limits, and protects incoming API traffic.',
  loadBalancer: 'Distributes traffic across multiple backend service instances.',
  appService: 'Runs URL shortening business logic: create short codes and resolve redirects.',
  redis: 'Fast in-memory cache used to serve frequently accessed URLs without hitting the database.',
  postgres: 'Durable relational database where URL mappings are persisted.',
};

export const defaultConfigs: Record<ComponentType, ComponentConfig> = {
  apiGateway: {
    capacityRps: 20_000,
    latencyMs: 5,
    failureRate: 0.001,
  },
  loadBalancer: {
    instances: 2,
    capacityPerInstanceRps: 15_000,
    latencyMs: 3,
  },
  appService: {
    instances: 3,
    capacityPerInstanceRps: 5_000,
    processingLatencyMs: 15,
  },
  redis: {
    opsPerSecond: 50_000,
    latencyMs: 2,
    cacheHitRate: 0.9,
  },
  postgres: {
    readCapacityQps: 10_000,
    writeCapacityQps: 2_000,
    latencyMs: 20,
  },
};

export const palette: ComponentType[] = ['apiGateway', 'loadBalancer', 'appService', 'redis', 'postgres'];
