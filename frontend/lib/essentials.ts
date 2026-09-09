export type EssentialsModule = {
  slug: string;
  order: number;
  title: string;
  level: 'Beginner' | 'Core' | 'Intermediate';
  summary: string;
  concept: string;
  diagram: string[];
  liveExample: {
    title: string;
    setup: string;
    knobs: string[];
    observation: string;
  };
  productionExample: string;
  interviewQuestion: string;
  practiceChallenge: string;
  keyTakeaways: string[];
};

export const essentialsModules: EssentialsModule[] = [
  {
    slug: 'non-functional-requirements',
    order: 1,
    title: 'Functional vs Non-Functional Requirements',
    level: 'Beginner',
    summary: 'Learn the difference between what a system does and how well it must work in production.',
    concept: 'Functional requirements describe product behavior: create a short URL, redirect a user, delete a link, or show analytics. Non-functional requirements describe production quality: latency, scale, availability, durability, security, cost, and observability. In system design interviews and real projects, NFRs drive architecture decisions.',
    diagram: ['Product need', 'Functional requirements', 'Non-functional requirements', 'Architecture choices'],
    liveExample: {
      title: 'URL Shortener requirement pressure',
      setup: 'Start with 1,000 RPS and 500ms latency target. Then increase to 10,000 RPS and 200ms target.',
      knobs: ['Total RPS', 'Read/write ratio', 'Latency target', 'Availability target'],
      observation: 'Higher scale and lower latency push the design toward API Gateway, load balancing, stateless services, Redis cache, and durable storage.',
    },
    productionExample: 'For a URL Shortener, “create short link” is functional. “Redirect within 100–200ms at 10,000 RPS with no data loss” is non-functional.',
    interviewQuestion: 'Before designing a URL Shortener, what functional and non-functional requirements would you clarify?',
    practiceChallenge: 'Write five functional and five non-functional requirements for a file upload service.',
    keyTakeaways: ['Functional = what the system does.', 'Non-functional = quality targets in production.', 'NFRs decide scale, storage, caching, availability, and cost.'],
  },
  {
    slug: 'frontend-backend-api-basics',
    order: 2,
    title: 'Frontend, Backend, and API Basics',
    level: 'Beginner',
    summary: 'Understand how browsers/mobile apps talk to backend services using APIs.',
    concept: 'A frontend is the user-facing application. A backend runs business logic, talks to databases/caches, and exposes APIs. APIs define how clients request actions or data. Production systems usually separate frontend delivery from backend service capacity so each can scale independently.',
    diagram: ['Browser / Mobile app', 'HTTPS request', 'API Gateway', 'Backend service', 'Database / Cache'],
    liveExample: {
      title: 'Create and redirect flow',
      setup: 'POST /api/shorten creates a mapping. GET /abc123 redirects to the original URL.',
      knobs: ['Endpoint type', 'Request size', 'Response latency', 'Error rate'],
      observation: 'Create calls usually need writes; redirect calls are read-heavy and benefit from caching.',
    },
    productionExample: 'A Next.js frontend can call backend APIs through an API Gateway. The gateway routes to stateless URL service instances behind a load balancer.',
    interviewQuestion: 'Why should frontend clients not connect directly to the database?',
    practiceChallenge: 'Design the API endpoints for create short URL, redirect, delete URL, and show analytics.',
    keyTakeaways: ['Frontend handles UX.', 'Backend handles business logic.', 'APIs are contracts between clients and services.'],
  },
  {
    slug: 'api-gateway',
    order: 3,
    title: 'API Gateway',
    level: 'Core',
    summary: 'Use a gateway as the public entry point for routing, auth, rate limits, logging, and protection.',
    concept: 'An API Gateway sits at the edge of the backend. It accepts public traffic, routes paths to services, validates requests, applies authentication/authorization, rate-limits abusive clients, logs requests, and forwards traffic to healthy upstream pools.',
    diagram: ['Client', 'API Gateway', 'Load Balancer / Service pool', 'Backend services'],
    liveExample: {
      title: 'Gateway capacity check',
      setup: 'Send 10,000 RPS through a gateway with only 5,000 RPS capacity.',
      knobs: ['Gateway max RPS', 'Rate limit threshold', 'Base latency', 'Failure rate'],
      observation: 'If the gateway is undersized, every downstream component looks fine but users still see errors because the front door is overloaded.',
    },
    productionExample: 'For URL Shortener, the gateway routes POST /api/shorten to create-link logic and GET /{code} to redirect logic. It also protects create-link APIs from spam.',
    interviewQuestion: 'What belongs in the API Gateway versus inside the URL service?',
    practiceChallenge: 'Add gateway rules for public redirects, authenticated link creation, and per-IP create-link rate limiting.',
    keyTakeaways: ['Gateway is the controlled production entry point.', 'It centralizes cross-cutting policies.', 'It must be scaled and monitored carefully.'],
  },
  {
    slug: 'load-balancing',
    order: 4,
    title: 'Load Balancing',
    level: 'Core',
    summary: 'Distribute traffic across multiple healthy backend servers to improve scale and availability.',
    concept: 'A load balancer spreads requests across service instances. It performs health checks and stops sending traffic to unhealthy servers. Load balancing helps horizontally scale stateless services and avoids one server becoming a single point of failure.',
    diagram: ['API Gateway', 'Load Balancer', 'URL Service A', 'URL Service B', 'URL Service C'],
    liveExample: {
      title: 'Traffic split across servers',
      setup: 'Send 12,000 RPS to three URL service instances that can each handle 5,000 RPS.',
      knobs: ['Number of instances', 'Capacity per instance', 'Health status', 'Routing algorithm'],
      observation: 'With three healthy instances, each receives around 4,000 RPS. If one fails, the remaining two receive around 6,000 RPS and can overload.',
    },
    productionExample: 'URL redirects are high volume, so multiple stateless URL service instances should sit behind a balancer.',
    interviewQuestion: 'How does stateless service design make load balancing easier?',
    practiceChallenge: 'Model traffic distribution when one out of four backend servers fails.',
    keyTakeaways: ['Horizontal scaling needs traffic distribution.', 'Health checks protect users from bad instances.', 'Stateful sessions can make balancing harder.'],
  },
  {
    slug: 'caching',
    order: 5,
    title: 'Caching and Caching Strategies',
    level: 'Core',
    summary: 'Reduce latency and database load using browser, CDN, application, and distributed caches.',
    concept: 'A cache stores frequently used data closer to the request path. Caching improves latency and reduces backend/database load, but introduces invalidation, stale data, memory cost, eviction, and hot-key problems.',
    diagram: ['Client', 'Backend service', 'Redis cache', 'Database on cache miss'],
    liveExample: {
      title: 'Cache hit-rate impact',
      setup: 'At 10,000 RPS with 90% reads, compare 50%, 90%, and 99% Redis hit rates.',
      knobs: ['Cache hit rate', 'TTL', 'Redis capacity', 'Database read capacity'],
      observation: 'At 90% hit rate, only 900 read QPS reach the database. At 50%, 4,500 read QPS hit the database and may overload it.',
    },
    productionExample: 'A URL Shortener caches popular shortCode → longUrl mappings in Redis so redirects do not hit PostgreSQL every time.',
    interviewQuestion: 'Explain cache-aside, write-through, write-back, and refresh-ahead. Which one fits URL redirects?',
    practiceChallenge: 'Design Redis caching for short URL redirects, including TTL, cache miss behavior, and hot-key protection.',
    keyTakeaways: ['Cache-aside is common for read-heavy systems.', 'Higher hit rate lowers DB load.', 'Caching adds invalidation and stale-data trade-offs.'],
  },
  {
    slug: 'databases-indexes',
    order: 6,
    title: 'Databases, Indexes, and Transactions',
    level: 'Core',
    summary: 'Understand durable storage, SQL/NoSQL choices, indexes, ACID, and read/write bottlenecks.',
    concept: 'Databases persist important data. SQL databases provide structured schema, transactions, joins, and strong consistency. NoSQL databases often optimize for scale, flexible schema, or specific access patterns. Indexes speed reads but add write overhead and storage cost.',
    diagram: ['Backend service', 'Connection pool', 'Primary database', 'Indexes', 'Durable storage'],
    liveExample: {
      title: 'Index lookup vs full scan',
      setup: 'Resolve short code abc123 with and without an index on short_code.',
      knobs: ['Read QPS', 'Write QPS', 'Index count', 'Connection pool size'],
      observation: 'Indexes make redirects fast, but too many indexes slow URL creation writes.',
    },
    productionExample: 'URL mappings need durable storage with a unique index on short_code. Writes create mappings; reads resolve redirects.',
    interviewQuestion: 'What database schema and indexes would you use for a URL Shortener?',
    practiceChallenge: 'Design a URL mappings table with columns, primary key, unique constraints, and indexes.',
    keyTakeaways: ['Databases provide durability.', 'Indexes optimize access patterns.', 'Write/read capacity must be estimated separately.'],
  },
  {
    slug: 'replication',
    order: 7,
    title: 'Replication and Read Scaling',
    level: 'Intermediate',
    summary: 'Scale reads and improve availability using primary-replica database setups.',
    concept: 'Replication copies data from a primary database to replicas. The primary usually handles writes; replicas handle reads. This improves read scale and availability but introduces replication lag and failover complexity.',
    diagram: ['Backend writes', 'Primary DB', 'Replication stream', 'Read replica 1', 'Read replica 2'],
    liveExample: {
      title: 'Move reads off the primary',
      setup: 'Database receives 9,000 reads/sec and 1,000 writes/sec. Add two read replicas.',
      knobs: ['Replica count', 'Replication lag', 'Read split percentage', 'Failover time'],
      observation: 'Replicas reduce primary read load, but newly written data may not appear instantly on replicas.',
    },
    productionExample: 'For URL Shortener, redirects can read from replicas if cache misses are okay with tiny replication lag. Creation writes must go to the primary.',
    interviewQuestion: 'When can replication lag break user experience?',
    practiceChallenge: 'Design read routing for URL redirects after adding two read replicas.',
    keyTakeaways: ['Primary handles writes.', 'Replicas scale reads.', 'Lag and failover are the trade-offs.'],
  },
  {
    slug: 'sharding',
    order: 8,
    title: 'Sharding and Partitioning',
    level: 'Intermediate',
    summary: 'Split data across multiple database shards when one database is not enough.',
    concept: 'Sharding horizontally partitions data across multiple databases or storage nodes. Common strategies include hash-based, range-based, geo-based, and directory-based sharding. Sharding increases capacity but makes queries, transactions, resharding, and operations harder.',
    diagram: ['Router / shard key', 'Shard 0', 'Shard 1', 'Shard 2', 'Shard 3'],
    liveExample: {
      title: 'Hash short code to shard',
      setup: 'Route each short code using hash(shortCode) % shardCount.',
      knobs: ['Shard count', 'Shard key', 'Traffic skew', 'Hot key percentage'],
      observation: 'Good hashing spreads writes/reads evenly. Bad shard keys or viral links can create hot shards.',
    },
    productionExample: 'A global URL Shortener may shard mappings by hash(short_code) or by generated ID range once one PostgreSQL primary cannot handle total data/traffic.',
    interviewQuestion: 'Compare hash-based sharding and range-based sharding for URL short codes.',
    practiceChallenge: 'Choose a shard key for URL mappings and explain how you would handle resharding.',
    keyTakeaways: ['Sharding adds horizontal database scale.', 'Shard key choice is critical.', 'Hot shards and resharding are hard.'],
  },
  {
    slug: 'queues',
    order: 9,
    title: 'Queues and Async Processing',
    level: 'Core',
    summary: 'Use queues to decouple slow work from user-facing request paths.',
    concept: 'Queues store work for asynchronous processing. Producers publish messages; consumers/workers process them. Queues improve latency and resilience for background jobs but introduce retries, duplicates, ordering issues, dead-letter queues, and eventual consistency.',
    diagram: ['Backend service', 'Queue', 'Worker pool', 'Analytics / Email / Processing DB'],
    liveExample: {
      title: 'Analytics without slowing redirects',
      setup: 'A redirect should return quickly, but analytics events need to be stored.',
      knobs: ['Event rate', 'Worker count', 'Processing time', 'Queue depth'],
      observation: 'Without a queue, analytics writes increase redirect latency. With a queue, redirects stay fast while workers process events later.',
    },
    productionExample: 'URL Shortener redirects can publish click events to a queue. Analytics workers aggregate clicks without blocking user redirects.',
    interviewQuestion: 'What happens if a queue message is processed twice, and how do you design idempotent consumers?',
    practiceChallenge: 'Add an analytics queue and worker to the URL Shortener architecture.',
    keyTakeaways: ['Queues decouple user requests from slow work.', 'Retries and duplicate processing are normal.', 'Queue depth is a key production metric.'],
  },
  {
    slug: 'rate-limiting',
    order: 10,
    title: 'Rate Limiting',
    level: 'Core',
    summary: 'Protect services from abuse, accidental spikes, and noisy clients.',
    concept: 'Rate limiting controls how many requests a client, user, IP, API key, or tenant can send over time. Common algorithms include fixed window, sliding window, token bucket, and leaky bucket.',
    diagram: ['Client requests', 'API Gateway rate limiter', 'Allowed traffic', 'Backend service'],
    liveExample: {
      title: 'Protect create-link API',
      setup: 'An attacker sends 5,000 create-link requests/sec from one IP.',
      knobs: ['Limit per IP', 'Burst size', 'Window size', 'Block duration'],
      observation: 'A rate limiter at the API Gateway rejects abusive traffic before it reaches URL service and PostgreSQL.',
    },
    productionExample: 'Allow public redirects generously, but apply stricter per-IP/per-user limits to POST /api/shorten.',
    interviewQuestion: 'Compare token bucket and sliding window rate limiters.',
    practiceChallenge: 'Design per-user and per-IP rate limits for URL creation.',
    keyTakeaways: ['Rate limiting protects shared infrastructure.', 'Different endpoints need different limits.', 'Limits must balance abuse prevention and user experience.'],
  },
  {
    slug: 'consistency',
    order: 11,
    title: 'Consistency and Data Freshness',
    level: 'Intermediate',
    summary: 'Understand strong consistency, eventual consistency, stale reads, and read-after-write expectations.',
    concept: 'Consistency describes how fresh and correct reads are after writes. Strong consistency returns the latest committed data. Eventual consistency allows temporary stale reads. Real systems often choose different consistency levels for different features.',
    diagram: ['Write request', 'Primary DB', 'Replica lag', 'Read request', 'Fresh or stale response'],
    liveExample: {
      title: 'Create then immediately redirect',
      setup: 'User creates a short URL and immediately opens it.',
      knobs: ['Read from primary', 'Read from replica', 'Replication lag', 'Cache write policy'],
      observation: 'If redirect reads from a lagging replica before cache is populated, the new short link may appear missing.',
    },
    productionExample: 'After URL creation, write-through/cache population can provide read-after-write behavior for the new short code.',
    interviewQuestion: 'Where can a URL Shortener accept eventual consistency, and where should it be strongly consistent?',
    practiceChallenge: 'Design read-after-write behavior for a newly created short URL.',
    keyTakeaways: ['Freshness requirements vary by feature.', 'Replicas can be stale.', 'Cache strategy affects consistency.'],
  },
  {
    slug: 'observability',
    order: 12,
    title: 'Observability: Logs, Metrics, Traces, Alerts',
    level: 'Core',
    summary: 'Operate production systems by measuring latency, errors, saturation, and user impact.',
    concept: 'Observability helps teams understand what is happening in production. Logs explain events, metrics show trends, traces follow requests across services, and alerts notify humans when SLOs are at risk.',
    diagram: ['Application emits signals', 'Logs', 'Metrics', 'Traces', 'Alerts / Dashboards'],
    liveExample: {
      title: 'Find the bottleneck',
      setup: 'Traffic increases and p95 latency crosses 200ms.',
      knobs: ['RPS', 'Cache hit rate', 'DB utilization', 'Error rate'],
      observation: 'Metrics reveal whether the bottleneck is gateway, service CPU, Redis, PostgreSQL, or queue backlog.',
    },
    productionExample: 'Track URL Shortener RPS, p50/p95/p99 latency, error rate, cache hit rate, DB connections, queue depth, and redirect success rate.',
    interviewQuestion: 'Which metrics would you put on the dashboard for a URL Shortener launch?',
    practiceChallenge: 'Create an observability checklist for API Gateway, URL service, Redis, PostgreSQL, and workers.',
    keyTakeaways: ['You cannot operate what you cannot measure.', 'Latency percentiles matter more than averages.', 'Alerts should map to user impact and SLOs.'],
  },
  {
    slug: 'capacity-estimation',
    order: 13,
    title: 'Capacity Estimation',
    level: 'Core',
    summary: 'Convert product requirements into rough traffic, storage, bandwidth, and server estimates.',
    concept: 'Capacity estimation uses simple math to size systems. Estimate reads, writes, storage growth, bandwidth, cache size, and peak traffic. The goal is not perfect accuracy; it is to expose bottlenecks and justify architecture choices.',
    diagram: ['Users', 'Requests/sec', 'Read/write split', 'Storage/day', 'Capacity plan'],
    liveExample: {
      title: 'URL Shortener back-of-envelope math',
      setup: '10,000 RPS, 90% redirects, 10% creates, 500 bytes per mapping.',
      knobs: ['RPS', 'Write percentage', 'Bytes per record', 'Retention period'],
      observation: '1,000 writes/sec creates 86.4M URLs/day. At 500 bytes each, raw mapping storage is roughly 43GB/day before indexes and replication.',
    },
    productionExample: 'Capacity estimates justify Redis, database write capacity, read replicas, sharding timelines, and API Gateway limits.',
    interviewQuestion: 'Estimate daily storage and read QPS for a URL Shortener with 100M daily active users.',
    practiceChallenge: 'Build a capacity estimate for a notification system with email, SMS, and push messages.',
    keyTakeaways: ['Use simple math first.', 'Separate reads from writes.', 'Storage, traffic, and peak load drive design.'],
  },
];

export type ThinkingScenario = {
  title: string;
  situation: string;
  thinkAbout: string[];
  guidance: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type EssentialsModuleDetail = {
  detailedExplanation: string[];
  scenarios: ThinkingScenario[];
  quiz: QuizQuestion[];
};

export const essentialsModuleDetails: Record<string, EssentialsModuleDetail> = {
  'non-functional-requirements': {
    detailedExplanation: [
      'Good system design starts by separating product behavior from production quality. Functional requirements tell us the user-visible features. Non-functional requirements tell us the scale, speed, reliability, security, and cost constraints the system must satisfy.',
      'If two teams build the same URL Shortener feature set, their architectures can be completely different if their NFRs differ. A small internal tool may only need one server and one database. A public product with 10,000 RPS needs gateway controls, horizontal scaling, caching, backups, monitoring, and capacity planning.',
      'In interviews, NFRs are how you show senior thinking. Instead of immediately drawing boxes, clarify traffic, latency target, availability, durability, consistency, data retention, privacy, and abuse constraints.',
    ],
    scenarios: [
      {
        title: 'Internal admin tool vs public product',
        situation: 'Both systems create short links. One has 50 employees. The other has millions of public users.',
        thinkAbout: ['Would both need Redis?', 'Would both need multi-region?', 'Which one needs abuse protection first?'],
        guidance: 'The internal tool can prioritize simplicity. The public product needs rate limits, high availability, traffic distribution, caching, and stronger observability.',
      },
      {
        title: 'Latency target changes architecture',
        situation: 'Product says redirects must be under 100ms globally instead of under 1 second.',
        thinkAbout: ['Can every redirect hit the primary database?', 'Do we need edge/CDN caching?', 'Where should hot links live?'],
        guidance: 'Tighter latency targets push reads closer to users through Redis, CDN/edge caching, replicas, or regional deployments.',
      },
      {
        title: 'Availability vs cost trade-off',
        situation: 'The team asks for 99.99% availability but also wants minimum infrastructure cost.',
        thinkAbout: ['What downtime is acceptable?', 'Which components need redundancy?', 'Can the business pay for multi-zone or multi-region?'],
        guidance: 'Higher availability needs redundant gateways, services, databases, failover, monitoring, and operational readiness. Clarify the business value before overbuilding.',
      },
    ],
    quiz: [
      {
        question: 'Which one is a non-functional requirement?',
        options: ['User can create a short URL', 'Redirect latency must be below 200ms', 'User can delete a URL', 'User can copy a link'],
        answer: 'Redirect latency must be below 200ms',
        explanation: 'Latency is a quality constraint, not a feature behavior.',
      },
      {
        question: 'Why should we clarify NFRs before drawing architecture?',
        options: ['They decide scale and trade-offs', 'They replace API design', 'They remove the need for databases', 'They are only useful for UI design'],
        answer: 'They decide scale and trade-offs',
        explanation: 'Traffic, latency, availability, consistency, and durability heavily influence architecture choices.',
      },
    ],
  },
  'frontend-backend-api-basics': {
    detailedExplanation: [
      'The frontend should focus on user interaction: forms, buttons, pages, and client-side validation. The backend should own business rules, security checks, persistence, and integration with caches, queues, and databases.',
      'APIs are contracts. A good API contract includes method, path, request body, response body, status codes, validation rules, auth requirements, idempotency behavior, and error format.',
      'Production API design also thinks about versioning, timeouts, retries, request size limits, pagination, rate limits, and observability. A simple endpoint becomes production-ready only when these concerns are handled.',
    ],
    scenarios: [
      {
        title: 'Create URL endpoint',
        situation: 'The frontend sends a long URL and optional custom alias.',
        thinkAbout: ['Should the frontend generate the short code?', 'Where do we validate malicious URLs?', 'What status code for duplicate alias?'],
        guidance: 'The backend should generate or validate aliases, reject bad URLs, enforce user limits, write to storage, and return a stable response contract.',
      },
      {
        title: 'Redirect endpoint under high traffic',
        situation: 'Millions of users open short links. Most calls are anonymous GET requests.',
        thinkAbout: ['Should redirect require auth?', 'Can this response be cached?', 'What happens when code is missing?'],
        guidance: 'Redirects should be fast, mostly unauthenticated, heavily cached, and return clear 404/410 behavior for missing or expired links.',
      },
      {
        title: 'Mobile app version mismatch',
        situation: 'Old mobile apps still call v1 APIs while the backend team is rolling out v2 responses.',
        thinkAbout: ['How do we version APIs?', 'Can old clients parse new fields?', 'What deprecation window is safe?'],
        guidance: 'Use stable contracts, backward-compatible changes, explicit versioning when needed, and clear error formats so clients can evolve safely.',
      },
    ],
    quiz: [
      {
        question: 'Why should frontend clients not directly access the production database?',
        options: ['It exposes credentials and bypasses business rules', 'It makes CSS slower', 'Databases cannot store URLs', 'APIs are only for mobile apps'],
        answer: 'It exposes credentials and bypasses business rules',
        explanation: 'The backend protects secrets, validates requests, enforces authorization, and controls data access.',
      },
      {
        question: 'What should an API contract define?',
        options: ['Only button colors', 'Path, method, request, response, errors, and auth', 'Only database indexes', 'Only deployment region'],
        answer: 'Path, method, request, response, errors, and auth',
        explanation: 'A reliable API is a clear agreement between client and server.',
      },
    ],
  },
  'api-gateway': {
    detailedExplanation: [
      'An API Gateway is not the place for core business logic. It is the place for shared edge responsibilities: routing, authentication checks, authorization policy enforcement, throttling, request size limits, schema validation, TLS termination, logging, metrics, and sometimes response transformation.',
      'For a URL Shortener, the gateway can route POST /api/shorten to the create-link service and GET /{code} to the redirect service. It can apply stricter rate limits to write endpoints and looser limits to public redirect endpoints.',
      'A gateway can also become a failure point. If every request passes through it, gateway capacity, timeout configuration, retries, health checks, and dashboards are production-critical.',
    ],
    scenarios: [
      {
        title: 'Bot attack on create endpoint',
        situation: 'One IP sends thousands of create-link requests per second.',
        thinkAbout: ['Where should this be blocked?', 'Should Redis/Postgres see this traffic?', 'What response should abusive clients get?'],
        guidance: 'Block or throttle at the gateway before expensive backend work. This protects service CPU, DB writes, and ID generation.',
      },
      {
        title: 'Multiple backend services',
        situation: 'You split URL creation, redirects, and analytics into separate services.',
        thinkAbout: ['How will clients know service locations?', 'Where do routing rules live?', 'How do you observe per-route errors?'],
        guidance: 'The gateway gives clients one stable public API while routing internally to service-specific upstreams.',
      },
      {
        title: 'Gateway timeout too short',
        situation: 'Some valid create-link requests fail because downstream validation sometimes takes longer than the gateway timeout.',
        thinkAbout: ['What timeout should the gateway use?', 'Should slow work move async?', 'How do retries affect duplicate writes?'],
        guidance: 'Timeouts must match endpoint behavior. Keep user-facing operations fast, use idempotency for retries, and move expensive tasks to async workflows.',
      },
    ],
    quiz: [
      {
        question: 'Which responsibility is best suited for an API Gateway?',
        options: ['Generating every database index', 'Per-IP rate limiting', 'Storing all URL mappings forever', 'Running offline analytics jobs'],
        answer: 'Per-IP rate limiting',
        explanation: 'Rate limiting is a shared edge policy and is commonly handled at gateway level.',
      },
      {
        question: 'Why can an API Gateway become dangerous if undersized?',
        options: ['It is in the request path for all clients', 'It only handles background jobs', 'It never fails', 'It removes all latency'],
        answer: 'It is in the request path for all clients',
        explanation: 'If the front door is overloaded, users fail before requests reach healthy backend services.',
      },
    ],
  },
  'load-balancing': {
    detailedExplanation: [
      'Load balancing is how a system uses many service instances as one logical service. The load balancer receives requests and chooses a healthy backend instance using algorithms such as round robin, least connections, weighted routing, or latency-aware routing.',
      'The biggest prerequisite is stateless service design. If a request can be handled by any instance, scaling is easy. If session state only lives on one machine, traffic distribution becomes fragile.',
      'Health checks are as important as distribution. A load balancer should remove unhealthy instances quickly and add recovered instances carefully to avoid sending users to broken servers.',
    ],
    scenarios: [
      {
        title: 'One backend goes down',
        situation: 'You run three URL service instances. One starts returning 500 errors.',
        thinkAbout: ['How will the balancer detect failure?', 'How quickly should traffic stop?', 'Can remaining instances handle load?'],
        guidance: 'Health checks remove the bad instance. Capacity planning must ensure remaining instances can absorb traffic during failures.',
      },
      {
        title: 'Uneven traffic distribution',
        situation: 'One server gets much more traffic than others.',
        thinkAbout: ['Is sticky session enabled?', 'Are requests long-running?', 'Are instance weights wrong?'],
        guidance: 'Choose an algorithm that matches workload. Stateless URL services usually work well with round robin or least-connections.',
      },
      {
        title: 'Slow instance still passes health checks',
        situation: 'An instance responds 200 OK to health checks but serves real traffic very slowly due to CPU saturation.',
        thinkAbout: ['Are health checks deep enough?', 'Should routing consider latency?', 'When should autoscaling add capacity?'],
        guidance: 'Combine basic health checks with latency/error metrics, outlier detection, and autoscaling so slow-but-alive instances do not hurt users.',
      },
    ],
    quiz: [
      {
        question: 'What makes horizontal scaling easier?',
        options: ['Stateless services', 'Local-only sessions', 'One giant server', 'Manual traffic routing'],
        answer: 'Stateless services',
        explanation: 'If any instance can serve any request, a load balancer can distribute traffic safely.',
      },
      {
        question: 'What is the purpose of health checks?',
        options: ['Detect unhealthy instances and stop routing to them', 'Increase database storage', 'Generate short codes', 'Replace monitoring'],
        answer: 'Detect unhealthy instances and stop routing to them',
        explanation: 'Health checks protect users from broken backend instances.',
      },
    ],
  },
  caching: {
    detailedExplanation: [
      'Caching stores frequently requested data in a faster layer. For read-heavy systems, caching can be the difference between a healthy database and an overloaded database. The key metric is cache hit rate: the percentage of reads served from cache.',
      'Different caching strategies solve different write/read problems. Cache-aside loads data on miss and is simple. Write-through updates cache and database together. Write-back writes to cache first and flushes later, improving write speed but risking data loss. Refresh-ahead reloads popular keys before they expire.',
      'Caching is not free. You must handle TTL, eviction, invalidation, stale data, hot keys, cache stampede, serialization size, and Redis availability. Good engineers can explain both the speed benefit and the correctness risks.',
    ],
    scenarios: [
      {
        title: 'Viral short link hot key',
        situation: 'One celebrity shares a short link and one Redis key gets massive traffic.',
        thinkAbout: ['Can one Redis node handle the hot key?', 'Should CDN/edge cache redirects?', 'Do we need request coalescing?'],
        guidance: 'Hot keys may need replication, local in-process cache, CDN/edge caching, or special handling for extremely popular links.',
      },
      {
        title: 'Cache miss storm',
        situation: 'Redis restarts and many popular keys disappear at once.',
        thinkAbout: ['Will all requests hit Postgres?', 'Can backend collapse duplicate misses?', 'Should TTLs be jittered?'],
        guidance: 'Use cache warmup, request coalescing, TTL jitter, and DB protection to avoid cache stampede.',
      },
      {
        title: 'Short URL update/delete',
        situation: 'A user deletes a short URL but Redis still has old mapping.',
        thinkAbout: ['Should deletes invalidate cache?', 'Can stale redirects be accepted?', 'What TTL is safe?'],
        guidance: 'For correctness-sensitive data, invalidate or update cache on writes. TTL alone may not be enough.',
      },
    ],
    quiz: [
      {
        question: 'At 9,000 read RPS with 90% cache hit rate, how many read QPS reach DB?',
        options: ['900', '1,000', '4,500', '9,000'],
        answer: '900',
        explanation: '10% miss rate means 9,000 × 0.10 = 900 DB read QPS.',
      },
      {
        question: 'Which caching strategy loads data into cache only after a miss?',
        options: ['Cache-aside', 'Write-back', 'Token bucket', 'Range sharding'],
        answer: 'Cache-aside',
        explanation: 'Cache-aside checks cache first, queries DB on miss, then stores the value in cache.',
      },
    ],
  },
  'databases-indexes': {
    detailedExplanation: [
      'Databases are the durable source of truth. For a URL Shortener, Redis can disappear and services can restart, but URL mappings must remain in the database.',
      'Indexes are data structures that speed up lookups. Without an index on short_code, a redirect may require scanning many rows. With an index, lookup is fast. But each index must be maintained on writes, so too many indexes can hurt write throughput.',
      'Transactions matter when multiple changes must succeed or fail together. For example, creating a custom alias may need to check uniqueness and insert mapping safely under concurrent requests.',
    ],
    scenarios: [
      {
        title: 'Duplicate custom alias',
        situation: 'Two users try to create the same custom alias at the same time.',
        thinkAbout: ['Can application-only validation prevent this?', 'Do we need a unique DB constraint?', 'What error should user see?'],
        guidance: 'Use a unique constraint on short_code and handle conflict errors. App validation alone has race conditions.',
      },
      {
        title: 'Slow redirects',
        situation: 'Redirect latency increases as table grows.',
        thinkAbout: ['Is short_code indexed?', 'Is the query using the index?', 'Are DB connections saturated?'],
        guidance: 'Check indexes, query plans, connection pools, and cache hit rate before adding more servers blindly.',
      },
      {
        title: 'Transaction boundary for analytics',
        situation: 'Creating a link writes the mapping and also initializes analytics metadata.',
        thinkAbout: ['Must both writes succeed together?', 'Can analytics metadata be created later?', 'What should retry safely do?'],
        guidance: 'Keep critical mapping writes transactional. Non-critical analytics setup can be retried asynchronously if it does not block link creation correctness.',
      },
    ],
    quiz: [
      {
        question: 'Why add an index on short_code?',
        options: ['To make redirect lookup fast', 'To remove need for backups', 'To cache browser CSS', 'To avoid API Gateway'],
        answer: 'To make redirect lookup fast',
        explanation: 'Redirects need quick lookup by short code, so short_code is a core access pattern.',
      },
      {
        question: 'What is a downside of many indexes?',
        options: ['Slower writes and more storage', 'No reads possible', 'No schema allowed', 'They disable transactions'],
        answer: 'Slower writes and more storage',
        explanation: 'Every write must update indexes, so indexes trade write cost for read speed.',
      },
    ],
  },
  replication: {
    detailedExplanation: [
      'Replication copies data from one database node to others. A common design is one primary for writes and multiple replicas for reads. This can increase read capacity and provide failover options.',
      'Replication is not magic. Replicas can lag behind the primary. If a user writes data and immediately reads from a stale replica, they may not see their own write.',
      'Production systems decide which reads can tolerate lag. Analytics or old links may be okay on replicas. Newly created links may need primary read, cache population, or read-after-write routing.',
    ],
    scenarios: [
      {
        title: 'New short link not found',
        situation: 'User creates /abc123 and immediately opens it, but redirect service reads from lagging replica.',
        thinkAbout: ['Should new mappings be cached immediately?', 'Should first reads go to primary?', 'How much lag is acceptable?'],
        guidance: 'For read-after-write, write to primary and populate cache, or route immediate reads to primary until replicas catch up.',
      },
      {
        title: 'Primary failure',
        situation: 'The primary DB becomes unavailable.',
        thinkAbout: ['Can writes continue?', 'Who promotes a replica?', 'What data could be lost?'],
        guidance: 'Failover planning matters. Automated promotion reduces downtime but must handle split-brain and data-loss risk.',
      },
      {
        title: 'Replica overloaded by analytics reads',
        situation: 'Dashboards run heavy queries against the same replicas used by redirect cache misses.',
        thinkAbout: ['Should analytics use separate replicas?', 'Can queries be pre-aggregated?', 'What is the user-facing priority?'],
        guidance: 'Separate operational reads from analytical reads when possible. Redirect availability should not depend on slow dashboard queries.',
      },
    ],
    quiz: [
      {
        question: 'What is replication lag?',
        options: ['Delay before replicas receive latest primary writes', 'Extra frontend CSS delay', 'Redis memory eviction', 'Gateway timeout setting'],
        answer: 'Delay before replicas receive latest primary writes',
        explanation: 'Replicas are often asynchronously updated and can temporarily be stale.',
      },
      {
        question: 'Why use read replicas?',
        options: ['To scale read traffic', 'To generate API keys', 'To avoid backups forever', 'To rate limit users'],
        answer: 'To scale read traffic',
        explanation: 'Replicas move read load away from the primary database.',
      },
    ],
  },
  sharding: {
    detailedExplanation: [
      'Sharding means splitting one logical dataset across multiple physical databases or partitions. Instead of every row living in one database, a routing rule decides which shard owns each row.',
      'The shard key is the most important decision. A good shard key spreads reads and writes evenly and supports common queries. A bad shard key creates hot shards or forces expensive cross-shard queries.',
      'Sharding should not be the first solution. Use indexes, caching, replicas, and vertical scaling first. Sharding adds operational complexity: migrations, resharding, distributed transactions, backups per shard, and routing logic.',
    ],
    scenarios: [
      {
        title: 'Hash-based URL mapping shards',
        situation: 'You use hash(short_code) % 4 to choose one of four database shards.',
        thinkAbout: ['Will writes spread evenly?', 'How do you add a fifth shard?', 'Where does routing logic live?'],
        guidance: 'Hashing spreads load well, but changing shard count can move many keys unless using consistent hashing or a directory service.',
      },
      {
        title: 'Range-based shard by first character',
        situation: 'A-F on shard 1, G-M on shard 2, N-Z on shard 3.',
        thinkAbout: ['What if generated codes are not evenly distributed?', 'Can one range become hot?', 'Are range scans easier?'],
        guidance: 'Range sharding can support range queries but may create uneven distribution and hot ranges.',
      },
      {
        title: 'Resharding after growth',
        situation: 'Four shards are full and the team needs to move to eight shards without downtime.',
        thinkAbout: ['How are keys migrated?', 'Can reads check old and new shards?', 'How do we verify no data is lost?'],
        guidance: 'Plan resharding with dual reads/writes or a directory layer, background migration, checksums, and gradual cutover to reduce risk.',
      },
    ],
    quiz: [
      {
        question: 'What is a shard key?',
        options: ['The field/rule used to route data to a shard', 'A cache TTL', 'An HTTP status code', 'A UI component'],
        answer: 'The field/rule used to route data to a shard',
        explanation: 'The shard key determines where each record lives.',
      },
      {
        question: 'Why is sharding hard?',
        options: ['Resharding, cross-shard queries, and operations become complex', 'It removes all latency', 'It only works on frontend', 'It disables replication'],
        answer: 'Resharding, cross-shard queries, and operations become complex',
        explanation: 'Sharding increases scale but adds significant distributed data complexity.',
      },
    ],
  },
  queues: {
    detailedExplanation: [
      'Queues decouple request handling from background work. A user-facing service can publish a message quickly and return a response while workers process the task asynchronously.',
      'Queues improve resilience because temporary worker failures do not have to fail user requests. The queue buffers work until consumers recover. But queues introduce eventual consistency and require retry, idempotency, ordering, and dead-letter handling.',
      'A good queue design defines message schema, retry policy, maximum attempts, dead-letter queue, monitoring for queue depth/age, and consumer idempotency.',
    ],
    scenarios: [
      {
        title: 'Redirect analytics',
        situation: 'Every redirect needs click analytics, but analytics writes are slow.',
        thinkAbout: ['Should redirect wait for analytics DB?', 'What if analytics worker is down?', 'Can duplicate events happen?'],
        guidance: 'Publish click events to a queue and return redirect fast. Workers process analytics later and must handle duplicates.',
      },
      {
        title: 'Queue backlog',
        situation: 'Traffic spike creates millions of pending events.',
        thinkAbout: ['Do we add workers?', 'Can downstream DB handle more writes?', 'What alerts should fire?'],
        guidance: 'Scale consumers carefully and monitor queue depth and oldest message age. Downstream capacity still matters.',
      },
      {
        title: 'Poison message retries forever',
        situation: 'One malformed analytics event crashes the worker every time it is retried.',
        thinkAbout: ['How many retries are safe?', 'Where should bad messages go?', 'How will engineers inspect them?'],
        guidance: 'Use bounded retries, validation, dead-letter queues, and alerts so one bad message does not block the whole pipeline.',
      },
    ],
    quiz: [
      {
        question: 'Why use a queue for analytics?',
        options: ['To keep redirects fast', 'To make every read strongly consistent', 'To replace Redis cache', 'To remove workers'],
        answer: 'To keep redirects fast',
        explanation: 'Analytics is not needed to complete the redirect, so it can be processed asynchronously.',
      },
      {
        question: 'Why should queue consumers be idempotent?',
        options: ['Messages can be retried or delivered more than once', 'Queues never fail', 'It improves CSS rendering', 'It removes database indexes'],
        answer: 'Messages can be retried or delivered more than once',
        explanation: 'At-least-once delivery means duplicates are possible, so processing should be safe to repeat.',
      },
    ],
  },
  'rate-limiting': {
    detailedExplanation: [
      'Rate limiting protects shared systems from abuse, accidental client bugs, and noisy tenants. It can be applied per IP, user, API key, route, tenant, or globally.',
      'Different algorithms fit different behavior. Fixed window is simple but can allow boundary bursts. Sliding window is smoother. Token bucket allows controlled bursts. Leaky bucket smooths traffic at a stable drain rate.',
      'In production, rate limits should return clear errors, include retry-after metadata when useful, and be observable. You should know who is being limited and whether limits are hurting real users.',
    ],
    scenarios: [
      {
        title: 'Abusive URL creation',
        situation: 'A bot creates thousands of spam links.',
        thinkAbout: ['Limit by IP or user?', 'Should redirects have same limit?', 'Should suspicious URLs be blocked?'],
        guidance: 'Create-link endpoints need stricter per-IP/per-user limits, authentication, captcha or abuse detection. Redirect limits may be higher.',
      },
      {
        title: 'Legitimate burst',
        situation: 'A customer imports many links at once.',
        thinkAbout: ['Should paid users get higher quotas?', 'Can bulk import use async jobs?', 'What happens after quota?'],
        guidance: 'Use tiered quotas and separate bulk workflows so protection does not block valid business use cases.',
      },
      {
        title: 'Distributed rate limiter drift',
        situation: 'Multiple gateway instances enforce limits independently and a client gets more requests than intended.',
        thinkAbout: ['Do limit counters need shared storage?', 'What consistency is required?', 'Can approximate limits be accepted?'],
        guidance: 'Use shared counters such as Redis or a purpose-built limiter when limits must be global. Local limits are simpler but less exact.',
      },
    ],
    quiz: [
      {
        question: 'Which algorithm allows controlled bursts using saved capacity?',
        options: ['Token bucket', 'Database index', 'Round robin', 'Cache-aside'],
        answer: 'Token bucket',
        explanation: 'Token bucket accumulates tokens up to a limit, allowing bursts while enforcing average rate.',
      },
      {
        question: 'Where is rate limiting commonly applied first?',
        options: ['API Gateway / edge', 'User browser only', 'Database schema only', 'CSS compiler'],
        answer: 'API Gateway / edge',
        explanation: 'Blocking abusive traffic early protects backend services and databases.',
      },
    ],
  },
  consistency: {
    detailedExplanation: [
      'Consistency is about what value a read returns after a write. Strong consistency means reads see the latest committed write. Eventual consistency means replicas or caches may return old data temporarily.',
      'The correct choice depends on user expectation. Bank balances need stronger consistency. View counters and analytics can often be eventually consistent. URL redirects usually need strong read-after-write for newly created links.',
      'Caches and replicas are the main places stale reads appear. The design must define cache invalidation, replica read routing, and what stale behavior is acceptable.',
    ],
    scenarios: [
      {
        title: 'Deleted link still redirects',
        situation: 'User deletes a link, but Redis still contains the mapping.',
        thinkAbout: ['Is stale redirect acceptable?', 'Should delete invalidate cache?', 'Should TTL be short?'],
        guidance: 'If deletion must take effect immediately, invalidate Redis on delete and avoid relying only on TTL.',
      },
      {
        title: 'Analytics count delay',
        situation: 'Dashboard shows 95 clicks but actual events are 105.',
        thinkAbout: ['Is this user-visible correctness critical?', 'Can async aggregation lag?', 'Should UI communicate delay?'],
        guidance: 'Analytics is usually okay with eventual consistency if product communicates that metrics may be delayed.',
      },
      {
        title: 'Custom alias race condition',
        situation: 'Two users request the same custom alias from different regions at nearly the same time.',
        thinkAbout: ['Who wins the alias?', 'Where is uniqueness enforced?', 'Can eventual consistency allow duplicates?'],
        guidance: 'Uniqueness needs strong coordination at the write path, usually through a primary database constraint or a strongly consistent reservation service.',
      },
    ],
    quiz: [
      {
        question: 'Which feature usually tolerates eventual consistency better?',
        options: ['Click analytics', 'Password change', 'Payment capture', 'Unique alias creation'],
        answer: 'Click analytics',
        explanation: 'Analytics can lag slightly without breaking core user actions.',
      },
      {
        question: 'What can cause stale reads?',
        options: ['Replica lag or stale cache', 'A bigger monitor', 'More CSS files', 'Using HTTPS'],
        answer: 'Replica lag or stale cache',
        explanation: 'Replicas and caches may not immediately reflect the latest write.',
      },
    ],
  },
  observability: {
    detailedExplanation: [
      'Observability is the ability to understand system behavior from emitted signals. The core signals are logs, metrics, and traces. Logs tell what happened, metrics show numerical trends, and traces show a request path across services.',
      'For production systems, averages are not enough. p95 and p99 latency show tail behavior experienced by slower users. Error rate, saturation, queue depth, cache hit rate, and DB connection usage reveal bottlenecks before full outage.',
      'Good alerts map to user impact. Alerting on every CPU spike creates noise. Alerting when p95 latency violates SLO or error rate exceeds threshold is more actionable.',
    ],
    scenarios: [
      {
        title: 'Latency spike',
        situation: 'Users complain redirects are slow after a marketing campaign.',
        thinkAbout: ['Is p99 high?', 'Did cache hit rate drop?', 'Is DB connection pool saturated?'],
        guidance: 'Use metrics to identify the layer, traces to follow slow requests, and logs to inspect errors or timeouts.',
      },
      {
        title: 'Silent analytics failure',
        situation: 'Redirects work but click counts stop increasing.',
        thinkAbout: ['Is queue depth growing?', 'Are workers failing?', 'Are messages in DLQ?'],
        guidance: 'Monitor async pipelines separately. User-facing success does not mean background processing is healthy.',
      },
      {
        title: 'Error budget burn',
        situation: 'The service is still up, but p95 latency and 5xx errors are slowly consuming the monthly SLO budget.',
        thinkAbout: ['Which alerts show user impact?', 'Do we slow deployments?', 'What dashboard proves recovery?'],
        guidance: 'SLO-based alerts help teams act before a full outage. Error budget burn connects technical signals to product reliability.',
      },
    ],
    quiz: [
      {
        question: 'Which metric best shows tail latency?',
        options: ['p99 latency', 'Average logo size', 'Total CSS classes', 'Number of routes'],
        answer: 'p99 latency',
        explanation: 'p99 shows latency experienced by the slowest 1% of requests.',
      },
      {
        question: 'What does queue depth indicate?',
        options: ['How much async work is waiting', 'How many frontend pages exist', 'How many DB indexes exist', 'How many users are logged in only'],
        answer: 'How much async work is waiting',
        explanation: 'Queue depth helps detect worker or downstream bottlenecks.',
      },
    ],
  },
  'capacity-estimation': {
    detailedExplanation: [
      'Capacity estimation turns vague scale into numbers. Start with users and behavior, convert to requests per second, split reads and writes, estimate data size, then compare demand against component capacity.',
      'Use rough math and state assumptions. Interviewers and production teams do not expect perfect numbers; they expect clear reasoning. Always separate average traffic from peak traffic because systems fail at peaks.',
      'The output of capacity estimation should influence architecture. If reads dominate, caching and replicas matter. If writes dominate, ID generation, indexes, partitions, and queues matter. If storage grows quickly, retention and sharding timelines matter.',
    ],
    scenarios: [
      {
        title: 'Read-heavy URL Shortener',
        situation: '10,000 RPS with 90% redirects and 10% creates.',
        thinkAbout: ['How many DB reads after 90% cache hit?', 'How many writes per day?', 'Can one primary handle writes?'],
        guidance: 'Reads become 9,000 RPS. With 90% cache hit, DB read load is 900 QPS. Writes are 1,000/sec or 86.4M/day.',
      },
      {
        title: 'Peak vs average traffic',
        situation: 'Average traffic is 2,000 RPS but peak traffic is 20,000 RPS during campaigns.',
        thinkAbout: ['Which number should capacity support?', 'Can autoscaling react fast enough?', 'What protects the DB during peak?'],
        guidance: 'Design for expected peak plus safety margin. Use autoscaling, caching, rate limiting, and queueing to absorb bursts.',
      },
      {
        title: 'Storage growth with retention',
        situation: 'The product stores mappings forever, but analytics events are kept for 13 months.',
        thinkAbout: ['How much storage grows daily?', 'What gets archived or deleted?', 'How do indexes and replicas multiply cost?'],
        guidance: 'Capacity estimates should include retention, index overhead, replication factor, backups, and archival policy—not just raw row size.',
      },
    ],
    quiz: [
      {
        question: 'At 1,000 writes/sec, approximately how many writes happen per day?',
        options: ['86.4 million', '1 million', '3,600', '100,000'],
        answer: '86.4 million',
        explanation: '1,000 × 60 × 60 × 24 = 86,400,000 writes/day.',
      },
      {
        question: 'Why separate reads and writes in estimation?',
        options: ['They stress different components differently', 'They are always equal', 'Writes never need storage', 'Reads always require queues'],
        answer: 'They stress different components differently',
        explanation: 'Reads may be cached/replicated; writes often hit primary storage and indexes.',
      },
    ],
  },
};

export function getEssentialsModule(slug: string) {
  return essentialsModules.find((module) => module.slug === slug);
}
