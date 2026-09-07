import { ComponentType } from '@/types/simulation';

export type LearningContent = {
  title: string;
  what: string;
  usefulHere: string;
  whenToUse: string;
  tradeoffs: string[];
  realWorld: string;
  interviewQuestion: string;
};

export const learningContent: Record<ComponentType, LearningContent> = {
  apiGateway: {
    title: 'API Gateway',
    what: 'An API Gateway is the front door of the system. It receives client requests and can handle routing, authentication, throttling, and observability.',
    usefulHere: 'For a URL shortener, it protects the redirect and create-url APIs from abusive traffic and gives one controlled entry point.',
    whenToUse: 'Use it when many clients call backend APIs, when you need shared policies, or when you want consistent request routing.',
    tradeoffs: ['Can become a bottleneck if undersized.', 'Adds one more network hop.', 'Misconfiguration can block healthy traffic.'],
    realWorld: 'AWS API Gateway, Kong, NGINX, Envoy, and Apigee are common examples.',
    interviewQuestion: 'What responsibilities belong in an API Gateway versus inside application services?',
  },
  loadBalancer: {
    title: 'Load Balancer',
    what: 'A load balancer spreads traffic across multiple service instances so no single instance receives all requests.',
    usefulHere: 'Redirect traffic can be very high, so the URL service needs horizontal scaling behind a balancer.',
    whenToUse: 'Use it when one backend instance cannot handle all traffic or when you need high availability.',
    tradeoffs: ['Adds operational complexity.', 'Session affinity can create uneven load.', 'Health checks must be designed carefully.'],
    realWorld: 'Common examples include AWS ALB/NLB, HAProxy, NGINX, and Envoy.',
    interviewQuestion: 'How does a load balancer improve availability and scalability?',
  },
  appService: {
    title: 'Application Service',
    what: 'The application service contains business logic. For this challenge, it creates short URLs and resolves short codes to original URLs.',
    usefulHere: 'It is where validation, ID generation, cache lookup/write-through logic, and database calls happen.',
    whenToUse: 'Every system needs application services to execute domain-specific behavior.',
    tradeoffs: ['Too few instances cause CPU/thread bottlenecks.', 'Too much logic in one service can become a monolith.', 'Bad database access patterns can overload storage.'],
    realWorld: 'This could be a Spring Boot, Node.js, Go, or Python service deployed as multiple replicas.',
    interviewQuestion: 'How would you make the URL service stateless, and why does that matter?',
  },
  redis: {
    title: 'Redis',
    what: 'Redis is a fast in-memory data store commonly used as a cache.',
    usefulHere: 'Most URL shortener traffic is reads. Caching popular URL mappings reduces database load and improves latency.',
    whenToUse: 'Use Redis when data is read frequently and can tolerate cache invalidation or occasional staleness.',
    tradeoffs: ['Cache invalidation is hard.', 'Memory is more expensive than disk.', 'Cached data can become stale.', 'Redis needs persistence/replication planning if critical.'],
    realWorld: 'Redis is used for caching, rate limiting, sessions, leaderboards, and queues.',
    interviewQuestion: 'Why would you use Redis instead of directly querying PostgreSQL for every redirect?',
  },
  postgres: {
    title: 'PostgreSQL',
    what: 'PostgreSQL is a durable relational database used to persist important data safely.',
    usefulHere: 'Short URL mappings must survive restarts and cache evictions, so they need durable storage.',
    whenToUse: 'Use it for structured data, strong consistency, transactions, indexing, and durable persistence.',
    tradeoffs: ['Vertical scaling has limits.', 'Write throughput can become a bottleneck.', 'Indexes speed reads but slow writes.', 'Read replicas introduce replication lag.'],
    realWorld: 'PostgreSQL is widely used for SaaS products, fintech systems, internal tools, and data-heavy applications.',
    interviewQuestion: 'How would you scale PostgreSQL reads and writes for a rapidly growing URL shortener?',
  },
};
