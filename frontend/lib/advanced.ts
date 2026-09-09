import type { QuizQuestion } from './essentials';

export type AdvancedModule = {
  slug: string;
  order: number;
  title: string;
  summary: string;
  theory: string[];
  deepDive: {
    title: string;
    explanation: string;
  }[];
  diagram: string[];
  failureModes: string[];
  interviewPrompt: string;
  keyTakeaways: string[];
  quiz: QuizQuestion[];
};

export const advancedModules: AdvancedModule[] = [
  {
    slug: 'consistent-hashing',
    order: 1,
    title: 'Consistent Hashing and Distributed Cache',
    summary: 'Learn how large caches distribute keys, handle node changes, reduce remapping, and survive hot-key traffic.',
    theory: [
      'Consistent hashing is a technique for distributing keys across nodes while minimizing key movement when nodes are added or removed. Instead of hash(key) % nodeCount, both keys and nodes are placed on a logical hash ring. A key belongs to the first node clockwise from its hash position.',
      'This matters because cache clusters change over time. Nodes fail, new nodes are added, capacity is expanded, and traffic shifts. With modulo hashing, changing node count remaps many keys at once, causing cache misses and database pressure. Consistent hashing remaps mostly the keys owned by changed nodes.',
      'Production systems usually add virtual nodes, also called vnodes, so each physical node owns many small ranges on the ring. Vnodes improve load distribution and make rebalancing smoother.',
    ],
    deepDive: [
      {
        title: 'Why modulo hashing breaks during scaling',
        explanation: 'If you route keys using hash(key) % 4, then adding a fifth node changes the modulo result for most keys. That creates a huge cache miss storm. Consistent hashing avoids this by moving only the ranges that now belong to the new node.',
      },
      {
        title: 'Replication and availability',
        explanation: 'A distributed cache often stores each key on multiple nodes: primary plus replicas. If the primary fails, clients can read from a replica. The trade-off is more memory usage and more complex consistency when writes update replicas.',
      },
      {
        title: 'Hot keys',
        explanation: 'Consistent hashing balances number of keys, not necessarily traffic. One viral key can overload a single cache node. Hot-key protection may need request coalescing, local cache, CDN, key replication, or special sharding of that hot value.',
      },
    ],
    diagram: ['Client', 'Hash ring router', 'Cache node A/B/C', 'Replica nodes', 'Database on miss'],
    failureModes: ['Cache node failure causes misses for its key ranges.', 'Adding nodes can still create temporary rebalancing load.', 'Hot keys can overload one node even with balanced key distribution.', 'Stale replicas can return old values after writes.'],
    interviewPrompt: 'Design a distributed cache like Redis/Memcached that supports node addition, node failure, replication, and hot-key mitigation.',
    keyTakeaways: ['Consistent hashing minimizes key movement.', 'Virtual nodes improve balance.', 'Replication improves availability but costs memory.', 'Hot keys need separate protection.'],
    quiz: [
      {
        question: 'What is the main benefit of consistent hashing over hash(key) % nodeCount?',
        options: ['Less key movement when nodes change', 'It removes all cache misses', 'It guarantees no hot keys', 'It stores data permanently'],
        answer: 'Less key movement when nodes change',
        explanation: 'Consistent hashing remaps mostly keys in affected ranges, reducing cache disruption during scaling.',
      },
      {
        question: 'Why use virtual nodes?',
        options: ['To improve distribution and smoother rebalancing', 'To remove replication', 'To make databases unnecessary', 'To disable hashing'],
        answer: 'To improve distribution and smoother rebalancing',
        explanation: 'Vnodes spread each physical node across multiple hash ranges, improving balance.',
      },
    ],
  },
  {
    slug: 'sharding-resharding',
    order: 2,
    title: 'Sharding and Resharding Strategy',
    summary: 'Go deep on shard keys, routing, online migration, dual writes, consistency, and operational risk.',
    theory: [
      'Sharding splits one logical dataset across many physical partitions. The goal is to scale storage and throughput beyond one database. A shard key decides which shard owns each row or document.',
      'A good shard key distributes reads and writes evenly and matches the most common access patterns. A bad shard key creates hot shards, cross-shard joins, awkward transactions, and painful resharding.',
      'Resharding is the process of changing shard layout after growth. It is one of the hardest production migrations because the system must keep serving reads/writes while data moves.',
    ],
    deepDive: [
      {
        title: 'Shard key selection',
        explanation: 'Hash(user_id) spreads users evenly but makes range queries harder. Region-based sharding helps locality but can become uneven. Time-based sharding supports retention but creates hot current partitions. The best choice depends on access patterns.',
      },
      {
        title: 'Routing layer',
        explanation: 'Clients need a way to find the right shard. This can be embedded logic, a routing service, or a directory table. Directory-based routing gives flexibility during migrations but adds another dependency.',
      },
      {
        title: 'Online resharding plan',
        explanation: 'A safe migration often uses background copy, dual writes, dual reads or fallback reads, checksums, traffic shadowing, gradual cutover, and rollback. The system must define source of truth during the transition.',
      },
    ],
    diagram: ['Request', 'Shard router', 'Shard map', 'Shard 1/2/3', 'Background migration workers'],
    failureModes: ['Hot shard saturates while other shards are idle.', 'Cross-shard transactions become slow or inconsistent.', 'Migration loses writes without dual-write or change-capture strategy.', 'Shard map outage can break routing.'],
    interviewPrompt: 'You have one database that can no longer handle user data. Design a sharding and resharding plan without downtime.',
    keyTakeaways: ['Shard key choice drives everything.', 'Sharding increases operational complexity.', 'Resharding needs careful migration and verification.', 'Avoid sharding too early.'],
    quiz: [
      {
        question: 'What makes a shard key good?',
        options: ['Even distribution and support for common access patterns', 'Always using created_at', 'Always using first letter', 'Avoiding indexes'],
        answer: 'Even distribution and support for common access patterns',
        explanation: 'A shard key must balance load and keep important queries efficient.',
      },
      {
        question: 'Why is online resharding hard?',
        options: ['Reads and writes continue while data moves', 'Users stop using the system', 'It removes backups', 'It only affects CSS'],
        answer: 'Reads and writes continue while data moves',
        explanation: 'The system must preserve correctness while serving traffic and migrating data.',
      },
    ],
  },
  {
    slug: 'multi-region-reliability',
    order: 3,
    title: 'Multi-Region Reliability and Failover',
    summary: 'Understand active-active, active-passive, global routing, replication lag, failover, and disaster recovery.',
    theory: [
      'Multi-region design places infrastructure in more than one geographic region to reduce latency and survive regional failures. The design must choose how traffic routes, where writes go, how data replicates, and what happens during failover.',
      'Active-passive keeps one primary region and a standby region. It is simpler but failover may take time. Active-active serves traffic from multiple regions at once, improving latency and availability but making data consistency much harder.',
      'Disaster recovery is measured with RTO and RPO. RTO is how long recovery takes. RPO is how much data loss is acceptable. These numbers drive replication and failover architecture.',
    ],
    deepDive: [
      {
        title: 'Global traffic routing',
        explanation: 'DNS, Anycast, or global load balancers route users to nearby healthy regions. Health checks must detect regional failure and stop sending traffic to broken regions without flapping.',
      },
      {
        title: 'Write consistency across regions',
        explanation: 'Single-primary writes are simpler but remote users pay higher latency. Multi-primary writes improve locality but require conflict resolution, idempotency, and careful data modeling.',
      },
      {
        title: 'Failover runbooks',
        explanation: 'Reliable failover is not just technology. Teams need tested runbooks, alerts, ownership, data validation, and rollback plans. Untested failover often fails during real incidents.',
      },
    ],
    diagram: ['Global router', 'Region A services', 'Region B services', 'Data replication', 'Failover control plane'],
    failureModes: ['Split-brain allows two primaries to accept conflicting writes.', 'Replication lag causes stale reads after failover.', 'DNS TTL delays traffic shift.', 'Failover automation can trigger unnecessarily without robust health checks.'],
    interviewPrompt: 'Design a multi-region architecture for a product that needs low latency globally and must survive one full-region outage.',
    keyTakeaways: ['RTO/RPO define recovery goals.', 'Active-active is powerful but complex.', 'Replication lag affects correctness.', 'Failover must be tested regularly.'],
    quiz: [
      {
        question: 'What does RPO measure?',
        options: ['Acceptable data loss window', 'Frontend render time', 'Number of cache nodes', 'API route count'],
        answer: 'Acceptable data loss window',
        explanation: 'Recovery Point Objective defines how much data loss the business can tolerate.',
      },
      {
        question: 'What is a split-brain risk?',
        options: ['Two regions both accepting writes as primary', 'One CSS file split into two files', 'Too many frontend routes', 'A cache key expiring'],
        answer: 'Two regions both accepting writes as primary',
        explanation: 'Split-brain can create conflicting writes and data corruption.',
      },
    ],
  },
  {
    slug: 'stream-processing-hot-partitions',
    order: 4,
    title: 'Stream Processing and Hot Partitions',
    summary: 'Learn Kafka-style streams, partitions, consumer groups, ordering, backpressure, and hot partition mitigation.',
    theory: [
      'Stream processing handles continuous event flows such as clicks, payments, logs, location updates, or feed events. Events are appended to topics, split into partitions, and consumed by worker groups.',
      'Partitions provide parallelism and ordering. Events with the same key usually go to the same partition, preserving order for that key. But a bad key can create a hot partition that overloads one broker or consumer.',
      'A mature stream system tracks lag, processing time, retries, poison messages, schema evolution, and exactly-once or at-least-once semantics depending on business needs.',
    ],
    deepDive: [
      {
        title: 'Ordering vs parallelism',
        explanation: 'If all events for one user must be ordered, partition by user_id. But if one user produces huge traffic, that partition becomes hot. Increasing partition count helps only if the key distribution is broad enough.',
      },
      {
        title: 'Consumer lag and backpressure',
        explanation: 'Lag grows when producers publish faster than consumers process. Adding consumers helps until partitions or downstream databases become bottlenecks. Backpressure protects downstream systems from overload.',
      },
      {
        title: 'Poison messages and retries',
        explanation: 'A malformed event can crash consumers repeatedly. Use bounded retries, schema validation, dead-letter topics, and alerting to keep the stream moving.',
      },
    ],
    diagram: ['Producers', 'Topic partitions', 'Consumer group', 'Processing service', 'Sink database / cache'],
    failureModes: ['Hot partition causes high lag for one key range.', 'Consumer retries block progress.', 'Downstream database cannot handle sink writes.', 'Schema changes break old consumers.'],
    interviewPrompt: 'Design a clickstream processing pipeline that handles millions of events per second and supports near-real-time analytics.',
    keyTakeaways: ['Partitions provide parallelism and ordering.', 'Bad keys create hot partitions.', 'Lag is a critical health metric.', 'Retries need DLQ strategy.'],
    quiz: [
      {
        question: 'What does consumer lag indicate?',
        options: ['How far consumers are behind producers', 'How many CSS files exist', 'How many users are logged in', 'How many API paths exist'],
        answer: 'How far consumers are behind producers',
        explanation: 'Lag is the amount of unprocessed stream data waiting for consumers.',
      },
      {
        question: 'Why can partitioning by a single popular key be dangerous?',
        options: ['It creates a hot partition', 'It removes ordering', 'It disables queues', 'It prevents metrics'],
        answer: 'It creates a hot partition',
        explanation: 'All events for that key go to one partition, limiting parallelism and causing overload.',
      },
    ],
  },
];

export function getAdvancedModule(slug: string) {
  return advancedModules.find((module) => module.slug === slug);
}
