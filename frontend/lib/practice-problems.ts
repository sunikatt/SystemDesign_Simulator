import type { QuizQuestion } from './essentials';

export type PracticeDifficulty = 'Beginner' | 'Core' | 'Intermediate' | 'Advanced';

export type PracticeProblem = {
  slug: string;
  title: string;
  difficulty: PracticeDifficulty;
  status: 'Live now' | 'Guided notes' | 'Coming soon';
  description: string;
  simulatorHref?: string;
  topics: string[];
  components: string[];
  learningOutcomes: string[];
  requirements: {
    functional: string[];
    nonFunctional: string[];
  };
  apis: string[];
  dbSchema: string[];
  architecture: string[];
  commonMistakes: string[];
  correctSolution: string[];
  rubric: string[];
  quiz: QuizQuestion[];
};

export const difficulties: PracticeDifficulty[] = ['Beginner', 'Core', 'Intermediate', 'Advanced'];

export const difficultyStyles: Record<PracticeDifficulty, string> = {
  Beginner: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
  Core: 'border-cyan/30 bg-cyan/10 text-cyan-100',
  Intermediate: 'border-amber-400/30 bg-amber-500/10 text-amber-100',
  Advanced: 'border-rose-400/30 bg-rose-500/10 text-rose-100',
};

export const difficultyDescriptions: Record<PracticeDifficulty, string> = {
  Beginner: 'Start here: clean requirements, APIs, basic storage, caching, and simple scale.',
  Core: 'Common interview building blocks: rate limits, queues, IDs, consistency, and reliability.',
  Intermediate: 'Multi-component systems with real-time reads/writes, ranking, permissions, and sharding concerns.',
  Advanced: 'Large-scale distributed systems with hot partitions, global scale, streaming, and hard correctness trade-offs.',
};

export const solveSteps = [
  'Clarify functional and non-functional requirements',
  'Estimate traffic, storage, bandwidth, and peak load',
  'Design APIs and main read/write flows',
  'Model database tables, indexes, cache keys, and queues',
  'Place components on the architecture and explain why each exists',
  'Add failure handling: retries, fallback, DLQ, circuit breakers, and monitoring',
  'Run or review the rubric, find bottlenecks, and improve the design',
];

function quizFor(title: string, correct: string): QuizQuestion[] {
  return [
    {
      question: `What should you clarify first before designing ${title}?`,
      options: ['Requirements and scale', 'Which logo color to use', 'Only the database name', 'Only the frontend framework'],
      answer: 'Requirements and scale',
      explanation: 'System design starts with scope, functional requirements, non-functional targets, traffic, and access patterns.',
    },
    {
      question: `Which decision is most important for ${title}?`,
      options: [correct, 'Use microservices for every class', 'Avoid monitoring', 'Store everything only in browser localStorage'],
      answer: correct,
      explanation: 'The correct decision follows from the dominant access pattern and production risk of the system.',
    },
  ];
}

export const practiceProblems: PracticeProblem[] = [
  {
    slug: 'url-shortener',
    title: 'URL Shortener',
    difficulty: 'Beginner',
    status: 'Live now',
    simulatorHref: '/challenges/url-shortener',
    description: 'Design the request path from clients to API Gateway, backend services, Redis cache, and PostgreSQL. Run the simulator, find bottlenecks, and improve the architecture.',
    topics: ['API Gateway', 'Load balancing', 'Caching', 'Database capacity', 'Scoring'],
    components: ['Client', 'API Gateway', 'Load Balancer', 'URL Service', 'Redis Cache', 'PostgreSQL', 'Analytics Queue', 'Workers'],
    learningOutcomes: ['Read-heavy design', 'Cache-aside redirects', 'Async analytics'],
    requirements: {
      functional: ['Create short URL', 'Redirect short code to long URL', 'Support custom alias and expiry', 'Track click analytics'],
      nonFunctional: ['Redirect p95 < 200ms', 'High read availability', 'Durable URL mappings', 'Abuse/rate-limit protection'],
    },
    apis: ['POST /api/urls {longUrl, customAlias?, expiresAt?}', 'GET /{shortCode} -> 301/302 redirect', 'DELETE /api/urls/{shortCode}', 'GET /api/urls/{shortCode}/analytics'],
    dbSchema: ['url_mapping(id, short_code UNIQUE, long_url, user_id, expires_at, created_at)', 'click_event(id, short_code, country, device, created_at)', 'Index: short_code unique for redirect lookup'],
    architecture: ['Client → API Gateway → Load Balancer → URL Service → Redis cache → PostgreSQL', 'URL Service → Analytics Queue → Workers → Analytics DB'],
    commonMistakes: ['Storing mappings only in Redis', 'Writing analytics synchronously before redirect', 'No unique constraint on custom alias'],
    correctSolution: ['Use DB as source of truth and Redis as cache', 'Populate/invalidate cache on writes', 'Send click events asynchronously through queue'],
    rubric: ['Has fast redirect path', 'Has durable mapping store', 'Handles cache miss', 'Protects create API from spam', 'Explains analytics async trade-off'],
    quiz: quizFor('URL Shortener', 'Use Redis for hot redirects but keep DB as source of truth'),
  },
  {
    slug: 'rate-limiter',
    title: 'Rate Limiter',
    difficulty: 'Core',
    status: 'Guided notes',
    description: 'Design per-user, per-IP, and global limits using token bucket, sliding window counters, Redis, and clear 429 behavior.',
    topics: ['Token bucket', 'Redis counters', 'Sliding window', 'Abuse prevention'],
    components: ['API Gateway', 'Limiter Service', 'Redis Counters', 'Token Bucket Store', 'Policy DB', 'Metrics + Alerts'],
    learningOutcomes: ['Token bucket decisions', 'Distributed counters', 'Fail-open vs fail-closed'],
    requirements: {
      functional: ['Define rules per user/IP/API key', 'Allow or reject each request', 'Return retry-after metadata', 'Support plan-based quotas'],
      nonFunctional: ['Limiter decision < 10ms', 'Globally consistent enough for abuse protection', 'Highly available at edge', 'Observable blocked/allowed counts'],
    },
    apis: ['POST /internal/rate-limit/check {key, route}', 'GET /api/usage', 'PUT /admin/limit-rules/{id}'],
    dbSchema: ['limit_rule(id, route, plan, capacity, refill_rate)', 'rate_limit_event(key, route, allowed, created_at)', 'Redis key: rl:{route}:{userOrIp} -> tokens/window counter'],
    architecture: ['Client → API Gateway → Rate Limiter → Redis → Backend Service', 'Limiter → Metrics pipeline → Alerts'],
    commonMistakes: ['Using only local counters on many gateways', 'Same limit for login and public read APIs', 'No behavior when Redis is down'],
    correctSolution: ['Use token bucket/sliding window based on route', 'Shared Redis counters for global limits', 'Fail closed for risky writes/login and fail open for low-risk reads if needed'],
    rubric: ['Defines key dimension', 'Chooses algorithm', 'Explains distributed counter', 'Handles Redis failure', 'Returns 429 correctly'],
    quiz: quizFor('Rate Limiter', 'Use Redis/atomic counters for distributed quota state'),
  },
  {
    slug: 'twitter-x-feed',
    title: 'Twitter / X Feed',
    difficulty: 'Advanced',
    status: 'Guided notes',
    description: 'Design timelines, fanout-on-write/read, ranking, media metadata, celebrity accounts, caching, and feed freshness trade-offs.',
    topics: ['Fanout', 'Ranking', 'Timeline cache', 'Hot users'],
    components: ['Post Service', 'Follow Graph', 'Fanout Queue', 'Timeline Cache', 'Ranking Service', 'Media/CDN', 'Notification Service'],
    learningOutcomes: ['Hybrid fanout', 'Timeline caching', 'Celebrity hot-user handling'],
    requirements: {
      functional: ['Create post', 'Follow/unfollow users', 'Read home timeline', 'Rank and paginate feed'],
      nonFunctional: ['Low-latency feed reads', 'Eventually fresh timeline', 'Handle celebrity fanout', 'High availability for reads'],
    },
    apis: ['POST /api/posts', 'POST /api/follows/{userId}', 'GET /api/feed?cursor=', 'GET /api/users/{id}/posts'],
    dbSchema: ['post(id, author_id, body, media_ids, created_at)', 'follow(follower_id, followee_id)', 'home_timeline(user_id, post_id, score)', 'author_outbox(author_id, post_id)'],
    architecture: ['Post Service → Post DB → Fanout Queue → Timeline Cache', 'Feed API → Timeline Cache + Ranking Service + Media CDN'],
    commonMistakes: ['Fanout every celebrity post synchronously', 'Build feed from DB joins on every request', 'Ignore ranking/freshness trade-off'],
    correctSolution: ['Hybrid fanout: write fanout for normal users, read-time merge for celebrities', 'Cache timelines', 'Use queues and monitor fanout lag'],
    rubric: ['Explains fanout strategy', 'Handles celebrity users', 'Uses cache', 'Supports pagination', 'Mentions eventual consistency'],
    quiz: quizFor('Twitter / X Feed', 'Use hybrid fanout to avoid celebrity write amplification'),
  },
  {
    slug: 'notification-service',
    title: 'Notification Service',
    difficulty: 'Core',
    status: 'Guided notes',
    description: 'Design email, SMS, and push notification delivery with queues, workers, retries, templates, user preferences, and provider failover.',
    topics: ['Queues', 'Workers', 'Retries', 'DLQ'],
    components: ['Event Queue', 'Notification Orchestrator', 'Template Service', 'Email Worker', 'SMS Worker', 'Push Worker', 'DLQ', 'Provider Fallback'],
    learningOutcomes: ['Queue-based delivery', 'Retries + DLQ', 'Provider fallback'],
    requirements: {
      functional: ['Send email/SMS/push', 'Render templates', 'Respect user preferences', 'Track delivery status'],
      nonFunctional: ['Do not slow product requests', 'Retry safely', 'Avoid duplicate sends', 'Handle provider outage'],
    },
    apis: ['POST /internal/notifications', 'GET /api/notifications/{id}', 'PUT /api/users/{id}/preferences'],
    dbSchema: ['notification(id, user_id, channel, template_id, status)', 'delivery_attempt(notification_id, provider, status, retry_count)', 'user_preference(user_id, channel, enabled)'],
    architecture: ['Product Service → Queue → Orchestrator → Channel Workers → Providers', 'Failed messages → DLQ → Alert/Replay'],
    commonMistakes: ['Sending provider calls synchronously', 'No idempotency key', 'No DLQ for poison messages'],
    correctSolution: ['Queue notifications', 'Use idempotent workers', 'Retry with backoff and failover provider for critical messages'],
    rubric: ['Has queue', 'Separates channels', 'Handles retries', 'Respects preferences', 'Tracks delivery'],
    quiz: quizFor('Notification Service', 'Use queues and idempotent workers for provider delivery'),
  },
  {
    slug: 'ride-sharing-location',
    title: 'Ride Sharing Location',
    difficulty: 'Advanced',
    status: 'Guided notes',
    description: 'Design real-time driver location ingestion, geo-indexing, nearby driver search, map updates, and high-write streaming pipelines.',
    topics: ['Geo indexing', 'Streams', 'WebSockets', 'High writes'],
    components: ['Location Gateway', 'Stream Processor', 'Geo Index', 'Driver State Store', 'Dispatch Service', 'WebSocket Gateway', 'Location History'],
    learningOutcomes: ['Geo indexing', 'High-write streams', 'Freshness vs history'],
    requirements: {
      functional: ['Drivers publish locations', 'Riders search nearby drivers', 'Show live map movement', 'Dispatch ride request'],
      nonFunctional: ['Very fresh latest location', 'High write throughput', 'Geo search under low latency', 'Expire stale drivers'],
    },
    apis: ['POST /api/drivers/location', 'GET /api/drivers/nearby?lat=&lng=', 'POST /api/rides/request', 'WS /location-updates'],
    dbSchema: ['driver_location(driver_id, lat, lng, geohash, updated_at)', 'driver_status(driver_id, available)', 'ride_request(id, rider_id, pickup_cell, status)'],
    architecture: ['Driver App → Location Gateway → Stream Processor → Geo Index', 'Rider App → Dispatch Service → Geo Index → WebSocket updates'],
    commonMistakes: ['Full scanning all drivers by distance', 'Keeping stale drivers forever', 'Writing every location update into order DB'],
    correctSolution: ['Partition by geohash/S2 cell', 'Use latest-location store with TTL', 'Archive history asynchronously'],
    rubric: ['Uses geo index', 'Handles high writes', 'Expires stale data', 'Separates latest vs history', 'Supports realtime updates'],
    quiz: quizFor('Ride Sharing Location', 'Use geo-indexed latest location with TTL'),
  },
  {
    slug: 'distributed-cache',
    title: 'Distributed Cache',
    difficulty: 'Advanced',
    status: 'Guided notes',
    description: 'Design a Redis-like cache with consistent hashing, replication, eviction, hot key handling, failover, and cache consistency choices.',
    topics: ['Consistent hashing', 'Eviction', 'Replication', 'Hot keys'],
    components: ['Client SDK', 'Hash Ring Router', 'Cache Nodes', 'Replica Nodes', 'Cluster Manager', 'Eviction Engine', 'DB Fallback'],
    learningOutcomes: ['Consistent hashing', 'Replication/failover', 'Hot-key mitigation'],
    requirements: {
      functional: ['Set/get/delete key', 'TTL expiry', 'Evict under memory pressure', 'Add/remove nodes'],
      nonFunctional: ['Low latency', 'High availability', 'Balanced key distribution', 'Safe node failure handling'],
    },
    apis: ['SET key value ttl', 'GET key', 'DELETE key', 'CLUSTER NODES'],
    dbSchema: ['In-memory key -> value, ttl, version', 'shard_map(range, primary, replicas)', 'node_health(node_id, status)'],
    architecture: ['Client SDK → Hash Ring/Slot Router → Cache Primary → Replicas', 'Cache miss → Source DB'],
    commonMistakes: ['Using hash(key) % nodeCount during resharding', 'No replication', 'No hot-key strategy'],
    correctSolution: ['Use consistent hashing/vnodes or slot map', 'Replicate keys', 'Use TTL jitter/request coalescing/hot-key replication'],
    rubric: ['Explains sharding', 'Explains eviction', 'Handles node failure', 'Handles hot keys', 'Mentions stale data'],
    quiz: quizFor('Distributed Cache', 'Use consistent hashing or slots to reduce key movement'),
  },
  {
    slug: 'search-autocomplete',
    title: 'Search Autocomplete',
    difficulty: 'Intermediate',
    status: 'Guided notes',
    description: 'Design low-latency typeahead suggestions using tries, prefix indexes, ranking signals, caching, and near-real-time index updates.',
    topics: ['Prefix index', 'Ranking', 'Caching', 'Index refresh'],
    components: ['Search API', 'Prefix Index/Trie', 'Ranking Store', 'Redis Hot Prefix Cache', 'Indexer Pipeline', 'Query Logs'],
    learningOutcomes: ['Prefix indexing', 'Ranking freshness', 'Hot prefix caching'],
    requirements: {
      functional: ['Return suggestions for prefix', 'Rank suggestions', 'Support locale/personalization', 'Update suggestions from logs'],
      nonFunctional: ['Very low p95 latency', 'High QPS on short prefixes', 'Fresh enough rankings', 'Moderation/spam safety'],
    },
    apis: ['GET /api/suggest?q=iph&locale=en', 'POST /internal/query-log', 'POST /internal/index/rebuild'],
    dbSchema: ['suggestion(prefix, term, score, locale)', 'term_stats(term, popularity, freshness)', 'query_log(query, user_id, created_at)'],
    architecture: ['Client → Search API → Redis hot prefix cache → Prefix Index → Ranking Store', 'Query logs → Indexer Pipeline → Prefix Index'],
    commonMistakes: ['Full text DB query on every keystroke', 'No debounce/min prefix length', 'No moderation of suggestions'],
    correctSolution: ['Precompute top terms per prefix', 'Cache hot prefixes', 'Update index asynchronously'],
    rubric: ['Uses prefix index', 'Handles hot prefixes', 'Explains ranking', 'Mentions debounce', 'Handles index freshness'],
    quiz: quizFor('Search Autocomplete', 'Precompute and cache top suggestions per prefix'),
  },
  {
    slug: 'video-streaming-service',
    title: 'Video Streaming Service',
    difficulty: 'Advanced',
    status: 'Guided notes',
    description: 'Design upload, transcoding, storage, CDN delivery, adaptive bitrate playback, metadata, recommendations, and global scale.',
    topics: ['Transcoding', 'CDN', 'Object storage', 'ABR'],
    components: ['Upload API', 'Object Storage', 'Transcode Queue', 'Transcoder Workers', 'Metadata DB', 'CDN', 'Playback API'],
    learningOutcomes: ['Async transcoding', 'CDN delivery', 'Adaptive bitrate'],
    requirements: {
      functional: ['Upload video', 'Transcode into renditions', 'Stream playback', 'Generate thumbnails'],
      nonFunctional: ['High upload durability', 'Low rebuffering playback', 'Global delivery', 'Process heavy jobs asynchronously'],
    },
    apis: ['POST /api/videos/upload-url', 'POST /api/videos/{id}/complete', 'GET /api/videos/{id}/manifest', 'GET /api/videos/{id}/metadata'],
    dbSchema: ['video(id, owner_id, title, status, duration)', 'rendition(video_id, resolution, bitrate, object_key)', 'view_event(video_id, user_id, timestamp)'],
    architecture: ['Client → Upload API → Object Storage → Transcode Queue → Workers → Renditions', 'Playback API → CDN → Object Storage'],
    commonMistakes: ['Transcoding in request path', 'Serving video from app server', 'Only one huge video file'],
    correctSolution: ['Use async transcoding', 'Segment renditions for adaptive bitrate', 'Serve through CDN'],
    rubric: ['Separates upload/playback', 'Uses object storage', 'Uses queue/workers', 'Uses CDN', 'Explains ABR'],
    quiz: quizFor('Video Streaming Service', 'Use async transcoding and CDN-backed playback'),
  },
  {
    slug: 'messaging-app-chat',
    title: 'Messaging App / Chat',
    difficulty: 'Intermediate',
    status: 'Guided notes',
    description: 'Design one-to-one and group chat with WebSockets, message persistence, delivery acknowledgements, ordering, and offline sync.',
    topics: ['WebSockets', 'Ordering', 'Presence', 'Offline sync'],
    components: ['WebSocket Gateway', 'Chat Service', 'Message Store', 'Fanout Queue', 'Presence Redis', 'Push Notifications'],
    learningOutcomes: ['Realtime fanout', 'Message ordering', 'Offline sync'],
    requirements: {
      functional: ['Send messages', 'Receive realtime messages', 'Group chat', 'Read receipts and presence'],
      nonFunctional: ['Low-latency delivery', 'Durable history', 'Ordering per conversation', 'Offline replay'],
    },
    apis: ['WS /chat', 'POST /api/conversations/{id}/messages', 'GET /api/conversations/{id}/messages?cursor=', 'POST /api/messages/{id}/receipt'],
    dbSchema: ['conversation(id, type)', 'message(id, conversation_id, sender_id, body, seq, created_at)', 'membership(conversation_id, user_id)', 'receipt(message_id, user_id, status)'],
    architecture: ['Client → WebSocket Gateway → Chat Service → Message Store', 'Chat Service → Fanout Queue → Gateways/Push Notifications'],
    commonMistakes: ['Keeping messages only in memory', 'No idempotency/client message ID', 'Ignoring offline users'],
    correctSolution: ['Persist messages', 'Use sequence numbers per conversation', 'Replay from last acknowledged message on reconnect'],
    rubric: ['Uses WebSockets', 'Persists messages', 'Handles ordering', 'Handles offline sync', 'Tracks presence'],
    quiz: quizFor('Messaging App / Chat', 'Persist messages and replay missed messages after reconnect'),
  },
  {
    slug: 'web-crawler',
    title: 'Web Crawler',
    difficulty: 'Advanced',
    status: 'Guided notes',
    description: 'Design URL frontier, politeness rules, robots.txt handling, deduplication, distributed workers, parsing, and crawl freshness.',
    topics: ['URL frontier', 'Deduplication', 'Workers', 'Politeness'],
    components: ['URL Frontier', 'Scheduler', 'Crawler Workers', 'Robots Cache', 'Dedup Store', 'Parser', 'Index Pipeline'],
    learningOutcomes: ['Frontier scheduling', 'Politeness', 'Deduplication'],
    requirements: {
      functional: ['Discover URLs', 'Fetch pages', 'Parse links/content', 'Respect robots.txt'],
      nonFunctional: ['Scale across workers', 'Avoid duplicate crawling', 'Do not overload domains', 'Prioritize fresh/important pages'],
    },
    apis: ['POST /internal/frontier/add-url', 'GET /internal/frontier/next', 'POST /internal/crawl-result', 'GET /internal/robots?domain='],
    dbSchema: ['url_frontier(url_hash, url, domain, priority, next_crawl_at)', 'crawl_result(url_hash, status, content_hash)', 'robots_rule(domain, rules, fetched_at)'],
    architecture: ['Scheduler → URL Frontier → Crawler Workers → Parser → Index Pipeline', 'Crawler → Robots Cache + Dedup Store'],
    commonMistakes: ['Crawling one domain too aggressively', 'No URL normalization/dedup', 'FIFO scheduling forever'],
    correctSolution: ['Use per-domain queues and politeness', 'Normalize URL and content hashes', 'Prioritize by importance/freshness'],
    rubric: ['Has frontier', 'Respects robots', 'Handles dedup', 'Explains scheduling', 'Scales workers'],
    quiz: quizFor('Web Crawler', 'Use per-domain politeness queues and URL deduplication'),
  },
  {
    slug: 'pastebin-text-sharing',
    title: 'Code / Text Sharing like Pastebin',
    difficulty: 'Beginner',
    status: 'Guided notes',
    description: 'Design paste creation, custom or generated IDs, expiration, privacy settings, syntax-highlight metadata, and read-heavy access.',
    topics: ['ID generation', 'TTL', 'Read-heavy', 'Abuse controls'],
    components: ['Paste API', 'Metadata DB', 'Object Storage', 'Redis Cache', 'Expiry Worker', 'Moderation Queue'],
    learningOutcomes: ['TTL design', 'Read-heavy content', 'Abuse moderation'],
    requirements: {
      functional: ['Create paste', 'Read paste by ID', 'Set expiry/privacy', 'Report abuse'],
      nonFunctional: ['Fast public reads', 'Durable content', 'Expiry cleanup', 'Abuse moderation'],
    },
    apis: ['POST /api/pastes', 'GET /p/{id}', 'DELETE /api/pastes/{id}', 'POST /api/pastes/{id}/report'],
    dbSchema: ['paste(id, owner_id, visibility, expires_at, object_key, language)', 'abuse_report(paste_id, reason, status)', 'Index: expires_at for cleanup'],
    architecture: ['Client → Paste API → Metadata DB + Object Storage', 'Read path → Redis/CDN → Object Storage', 'Expiry Worker + Moderation Queue'],
    commonMistakes: ['Storing huge content only in DB rows', 'No expiry index', 'No moderation path'],
    correctSolution: ['Store metadata in DB and content in object storage', 'Cache hot public pastes', 'Run expiry/moderation asynchronously'],
    rubric: ['Separates metadata/content', 'Handles expiry', 'Caches hot reads', 'Supports privacy', 'Mentions abuse'],
    quiz: quizFor('Pastebin', 'Store large content in object storage and metadata in DB'),
  },
  {
    slug: 'concert-ticket-sale',
    title: 'Concert Ticket Sale',
    difficulty: 'Advanced',
    status: 'Guided notes',
    description: 'Design high-demand ticket inventory, waiting rooms, fairness, reservations, payment flow, anti-bot controls, and oversell prevention.',
    topics: ['Inventory locks', 'Waiting room', 'Payments', 'Anti-bot'],
    components: ['Waiting Room', 'Inventory Service', 'Reservation Store', 'Payment Service', 'Order Service', 'Anti-bot Layer', 'Queue'],
    learningOutcomes: ['Inventory correctness', 'Waiting room fairness', 'Payment idempotency'],
    requirements: {
      functional: ['Browse event', 'Join waiting room', 'Reserve seat', 'Pay for ticket'],
      nonFunctional: ['No overselling', 'Handle huge sale spikes', 'Fair admission', 'Idempotent checkout'],
    },
    apis: ['POST /api/events/{id}/join-waiting-room', 'POST /api/seats/{id}/reserve', 'POST /api/checkout', 'GET /api/orders/{id}'],
    dbSchema: ['seat(id, event_id, status)', 'reservation(id, seat_id, user_id, expires_at)', 'order(id, reservation_id, payment_status)', 'payment(idempotency_key, status)'],
    architecture: ['Client → Waiting Room → Inventory Service → Reservation Store → Payment → Order Service'],
    commonMistakes: ['Letting everyone hit inventory at once', 'No reservation TTL', 'Eventually consistent final seat ownership'],
    correctSolution: ['Use waiting room controlled admission', 'Short-lived reservations', 'Strong consistency/transaction for seat state'],
    rubric: ['Prevents oversell', 'Uses waiting room', 'Handles payment retry', 'Releases expired holds', 'Mentions anti-bot'],
    quiz: quizFor('Concert Ticket Sale', 'Use strong reservation state to prevent overselling'),
  },
  {
    slug: 'distributed-id-generator',
    title: 'Distributed ID Generator',
    difficulty: 'Core',
    status: 'Guided notes',
    description: 'Design unique sortable IDs using Snowflake-style workers, timestamp bits, sequence numbers, clock drift handling, and availability trade-offs.',
    topics: ['Snowflake', 'Clock drift', 'Sequences', 'Uniqueness'],
    components: ['ID Generator Service/SDK', 'Worker ID Allocator', 'Clock Monitor', 'Sequence Counter', 'Metrics'],
    learningOutcomes: ['Snowflake IDs', 'Clock drift', 'Worker coordination'],
    requirements: {
      functional: ['Generate unique IDs', 'Support high throughput', 'Roughly sortable by time', 'Allocate worker IDs'],
      nonFunctional: ['No central bottleneck', 'Low latency', 'Collision-free', 'Handle clock drift'],
    },
    apis: ['GET /internal/ids/next', 'POST /internal/workers/register', 'GET /internal/workers/{id}/lease'],
    dbSchema: ['id = timestamp_bits + worker_id_bits + sequence_bits', 'worker_lease(worker_id, host, expires_at)'],
    architecture: ['Service/SDK → Worker ID Lease → Local Clock + Sequence → ID', 'Clock Monitor → Alerts'],
    commonMistakes: ['One global SQL auto-increment sequence for all scale', 'Manual duplicate worker IDs', 'Ignoring clock rollback'],
    correctSolution: ['Use Snowflake-style ID', 'Lease unique worker IDs', 'Pause or fallback on clock rollback'],
    rubric: ['Explains bit allocation', 'Guarantees uniqueness', 'Handles worker collision', 'Handles clock drift', 'Mentions ordering limits'],
    quiz: quizFor('Distributed ID Generator', 'Use timestamp + worker id + sequence bits for scalable uniqueness'),
  },
  {
    slug: 'real-time-leaderboard',
    title: 'Real-time Leaderboard',
    difficulty: 'Intermediate',
    status: 'Guided notes',
    description: 'Design score updates, top-K queries, rank lookup, Redis sorted sets, sharding, season resets, and real-time client updates.',
    topics: ['Sorted sets', 'Top-K', 'Sharding', 'Real-time updates'],
    components: ['Score API', 'Validation Service', 'Redis Sorted Sets', 'Event Log', 'Rank Cache', 'WebSocket Updates'],
    learningOutcomes: ['Sorted sets', 'Top-K/rank lookup', 'Realtime updates'],
    requirements: {
      functional: ['Submit score', 'Show top-K', 'Show user rank', 'Reset per season'],
      nonFunctional: ['Fast rank lookup', 'Durable score history', 'Cheat resistance', 'Realtime updates'],
    },
    apis: ['POST /api/scores', 'GET /api/leaderboards/{id}/top', 'GET /api/leaderboards/{id}/rank/{userId}', 'WS /leaderboard-updates'],
    dbSchema: ['score_event(user_id, score_delta, event_id)', 'leaderboard(season, region, user_id, score)', 'Redis zset: leaderboard:{season}:{region}'],
    architecture: ['Game → Score API → Validation → Event Log + Redis Sorted Set', 'Leaderboard API → Redis → WebSocket Updates'],
    commonMistakes: ['Sorting DB rows for every top-K', 'Keeping only Redis without durable events', 'No anti-cheat validation'],
    correctSolution: ['Use Redis sorted sets for serving', 'Persist score events', 'Validate scores before applying'],
    rubric: ['Uses sorted set', 'Handles durability', 'Supports rank lookup', 'Handles season/region', 'Mentions anti-cheat'],
    quiz: quizFor('Real-time Leaderboard', 'Use Redis sorted sets backed by durable score events'),
  },
  {
    slug: 'file-storage-service',
    title: 'File Storage Service',
    difficulty: 'Intermediate',
    status: 'Guided notes',
    description: 'Design upload/download APIs, object storage, metadata database, permissions, resumable upload, deduplication, and sharing links.',
    topics: ['Object storage', 'Metadata', 'Permissions', 'Resumable upload'],
    components: ['Upload API', 'Signed URL Service', 'Object Storage', 'Metadata DB', 'Permission Service', 'Scan Queue', 'CDN'],
    learningOutcomes: ['Metadata vs bytes', 'Signed URLs', 'Resumable upload'],
    requirements: {
      functional: ['Upload/download file', 'Share file', 'Set permissions', 'Resume large upload'],
      nonFunctional: ['Durable file storage', 'Secure access', 'Large file support', 'Global download performance'],
    },
    apis: ['POST /api/files/upload-session', 'PUT /api/files/{id}/parts/{part}', 'GET /api/files/{id}/download-url', 'POST /api/files/{id}/share'],
    dbSchema: ['file(id, owner_id, name, object_key, size, checksum, status)', 'permission(file_id, principal_id, role)', 'upload_session(file_id, part_count, expires_at)'],
    architecture: ['Client → Upload API → Signed URL → Object Storage', 'Metadata DB + Permission Service → Download URL → CDN'],
    commonMistakes: ['Sending all bytes through app server', 'Making object bucket public', 'No resumable upload'],
    correctSolution: ['Use signed URLs', 'Store metadata separately', 'Use multipart upload and permission checks'],
    rubric: ['Uses object storage', 'Separates metadata', 'Secures downloads', 'Supports large upload', 'Mentions scanning/CDN'],
    quiz: quizFor('File Storage Service', 'Use object storage for bytes and DB for metadata'),
  },
];

export function getPracticeProblem(slug: string) {
  return practiceProblems.find((problem) => problem.slug === slug);
}
