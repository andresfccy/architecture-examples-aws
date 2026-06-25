# Glossary

This glossary works as the site's cross-reference. In pattern pages, the first occurrence of many terms is automatically converted into a link with a tooltip.

## Architecture and delivery

### IaC
Infrastructure as Code. Define infrastructure in versioned files, for example with CDK, CloudFormation, SAM, or Terraform, instead of creating resources manually in the console.

### CDK
AWS Cloud Development Kit. Defines AWS infrastructure with languages like TypeScript or Python. It generates CloudFormation.

### CloudFormation
Native AWS service for declaring and deploying infrastructure with YAML/JSON templates.

### SAM
Serverless Application Model. A CloudFormation extension focused on Lambda, API Gateway, Step Functions, and serverless.

### Stack
Infrastructure deployment unit. In CDK/CloudFormation it groups related resources.

### Construct
CDK abstraction for modeling resources. L2/L3 constructs encapsulate best practices.

### `cdk synth`
Generates the CloudFormation template from CDK code.

### `cdk diff`
Shows changes before deployment. Key for detecting dangerous replacements.

### Drift
Difference between what IaC declares and what actually exists in AWS, often due to manual changes.

### Change set
CloudFormation preview of changes before executing them.

### Blue/green deployment
Deployment with two environments or versions, shifting traffic from the old version to the new one.

### Canary deployment
Gradual deployment to a small percentage of traffic before exposing it to everyone.

### Rollback
Revert to a previous version when deployment fails or metrics degrade.

### Blast radius
Scope of damage if something fails. Reduced with separate accounts, least privilege, and per-environment limits.

### Workload
System, application, or set of services that solves a business need.

### Well-Architected
AWS framework for evaluating architectures across security, reliability, operational excellence, performance, cost, and sustainability.

## APIs, frontend, and compute

### REST
API style based on resources and HTTP verbs. Good for simple, widely compatible contracts.

### GraphQL
API model where the client asks for exactly the fields it needs. Good for frontends with varied screens.

### BFF
Backend for Frontend. Backend layer adapted to a specific client, such as web or mobile.

### gRPC
Efficient RPC protocol based on HTTP/2 and protobuf. Good for internal services with strong contracts.

### WebSocket
Persistent bidirectional connection between client and server. Useful for chat, live dashboards, and notifications.

### SSE
Server-Sent Events. Simple server-to-client streaming channel over HTTP.

### API Gateway HTTP API
Simpler and cost-effective option for modern HTTP APIs.

### API Gateway REST API
More complete option for APIs with API keys, usage plans, request validation, caching, or direct WAF.

### AppSync
Managed GraphQL service on AWS with resolvers, auth, and subscriptions.

### Lambda
Event-driven serverless compute. Ideal for short functions and variable traffic. Maximum execution time: 15 minutes.

### Function URL
Direct HTTPS endpoint for Lambda. In production, use secure auth, ideally `AWS_IAM`.

### ECS
Elastic Container Service. Managed container orchestrator on AWS.

### Fargate
Serverless mode for running containers without managing EC2 instances.

### ECS Express Mode
Simplified path for deploying HTTP apps on ECS with less initial configuration.

### ECR
Elastic Container Registry. Private registry for Docker images.

### ALB
Application Load Balancer. HTTP/HTTPS/gRPC load balancer with health checks and routing rules.

### Service Connect
ECS capability for service discovery and service-to-service communication.

### Cold start
Extra time when Lambda initializes a new execution environment. Important for latency-sensitive APIs.

### Reserved concurrency
Free Lambda concurrency limit or reservation. Protects downstream systems and controls blast radius.

### Provisioned concurrency
Pre-initialized Lambda capacity to reduce cold starts. Has additional cost.

### SnapStart
Startup optimization for some Lambda runtimes that restores from a snapshot.

## Messaging, events, and streaming

### Messaging
Asynchronous communication where a message is consumed and then disappears. Example: SQS.

### Streaming
Durable event log with retention and replay. Example: Kinesis or Kafka/MSK.

### SQS
Managed queue for decoupling producers and consumers. Ideal for async workers.

### SQS Standard
High-throughput queue with best-effort ordering and at-least-once delivery.

### SQS FIFO
Queue with ordering by message group and deduplication, with throughput restrictions.

### Visibility timeout
Time during which an SQS message is hidden while a worker processes it.

### DLQ
Dead-letter queue. Queue where messages land after failing too many attempts.

### Redrive
Reprocess messages from a DLQ back to the original queue or a controlled flow.

### SNS
Simple pub/sub for fan-out to SQS, Lambda, HTTP, email, or SMS.

### Step Functions
Workflow orchestration service for steps, retries, branching, and visible state.

### EventBridge
Event bus with content-based routing, AWS/SaaS integrations, rules, pipes, and archive/replay.

### Event bus
Logical channel where events are published. Domain-specific buses are usually cleaner.

### Event pattern
Filtering rule that decides which events reach a target.

### EventBridge Pipes
Managed source-to-target connection with filtering/enrichment and no glue Lambda.

### Kinesis Data Streams
AWS-native stream service with partitions/shards, retention, and consumers.

### Firehose
Managed data delivery service to S3, OpenSearch, Redshift, and other destinations.

### Flink
Stateful stream processing engine: windows, joins, aggregations, and complex events.

### MSK
Managed Streaming for Apache Kafka. Managed Kafka for workloads requiring Kafka APIs/ecosystem.

### Topic
Logical channel in Kafka/SNS where producers publish and consumers receive.

### Partition
Unit of parallelism and ordering in Kafka/Kinesis. The partition key determines distribution.

### Shard
Kinesis capacity/parallelism unit.

### Consumer group
Kafka consumer group that distributes partitions across instances.

### Consumer lag
Distance between produced and consumed data. Critical streaming metric.

### Replay
Read past events again from a position or retention window.

### At-least-once
Delivery guarantee where a message can be processed more than once. Requires idempotency.

### Idempotency
Ability to repeat an operation without incorrectly changing the final result.

## Data, storage, search, and cache

### SQL
Relational model with tables, joins, constraints, and transactions. Example: Aurora PostgreSQL.

### NoSQL
Family of non-relational databases optimized for specific models: key-value, document, graph, etc.

### OLTP
Transactional application processing: create orders, charge payments, update profiles.

### OLAP
Analytical processing: reports, aggregations, historical data, and BI.

### Aurora
Managed relational database compatible with PostgreSQL or MySQL, designed for high availability and performance.

### Aurora Serverless v2
Aurora mode that scales capacity in ACUs based on demand.

### ACU
Aurora Capacity Unit. Aurora Serverless capacity unit.

### RDS Proxy
Managed connection pool for protecting RDS/Aurora databases, especially useful with Lambda.

### DynamoDB
Managed NoSQL key-value/document database with low latency and high scale.

### Single-table design
Model multiple entities in one DynamoDB table based on access patterns.

### PK/SK
Partition key and sort key. Common DynamoDB primary keys for distributing and ordering data.

### GSI
Global Secondary Index. DynamoDB secondary index for additional access patterns.

### Hot partition
Overloaded partition caused by an overly frequent key. Causes throttling.

### TTL
Time to Live. Automatic expiration of records or objects after a given time.

### DynamoDB Streams
Change stream from a DynamoDB table. Used for CDC, projections, or events.

### CDC
Change Data Capture. Capture database changes to replicate them to search, analytics, or events.

### S3
Durable object storage. Good for files, data lakes, backups, and static assets.

### Presigned URL
Temporary URL to upload or download S3 objects without sending the file through your backend.

### S3 Tables
AWS service for managed Iceberg tables on S3, integrated with Glue/Athena.

### Iceberg
Open analytical table format with snapshots, schema evolution, and partitioning.

### Glue Data Catalog
Metadata catalog for tables queryable by Athena, Glue, and other engines.

### Athena
Serverless service for querying S3 data with SQL. It mainly charges by data scanned.

### Glue ETL
Managed service for transformation jobs, usually with Spark.

### Redshift
Managed data warehouse for high-performance BI and analytics.

### Parquet
Columnar format efficient for analytics. Reduces scan cost compared to CSV/JSON.

### Data lake
Central repository of historical data in low-cost storage, usually S3.

### Lakehouse
Approach that combines data lake storage with table capabilities, transactions, and schema evolution.

### OpenSearch
Search, aggregation, logs, and vector search engine. Good for text, facets, and hybrid search.

### Full-text search
Relevance-based text search, not only exact key equality.

### Facets
Aggregated filters such as category, price, brand, or status in search results.

### ElastiCache
Managed cache service compatible with Valkey, Redis OSS, or Memcached.

### Valkey
In-memory engine compatible with Redis OSS, recommended in several new ElastiCache scenarios.

### Cache-aside
Pattern where the app checks cache first; on miss, it reads the DB and populates cache.

### Cache hit rate
Percentage of reads served by cache. If low, the cache is not helping.

### Cache stampede
Many requests recompute the same value when it expires. Mitigate with locks, jitter, or stale-while-revalidate.

## AI, RAG, and vectors

### Bedrock
AWS service for using foundation models and building generative applications without managing base models.

### Foundation model
Large pretrained model, such as text, embedding, or multimodal models.

### LLM
Large Language Model. Language model used to generate, summarize, reason over, or extract text.

### Token
Internal text unit processed by a model. Cost and latency often depend on input and output tokens.

### Embedding
Numeric vector that represents semantic meaning of text, image, or other content.

### Vector
List of numbers. In AI, used to compare similarity between content.

### Vector store
Specialized storage for embeddings and nearest-neighbor search. Examples: S3 Vectors, OpenSearch vector, Valkey vector.

### S3 Vectors
AWS service for cost-effective vector storage and querying, especially for moderate QPS.

### Vector search
Search for semantically similar items by comparing embeddings.

### Semantic search
Search by meaning, not only exact words.

### Hybrid search
Combines traditional text search with vector search.

### RAG
Retrieval-Augmented Generation. Pattern where external context is retrieved and given to the LLM for better answers.

### Grounding
Anchoring model responses to concrete retrieved sources or data, reducing hallucinations.

### Chunking
Splitting documents into fragments so they can be indexed and retrieved better in RAG.

### Reranking
Reordering retrieved results to send the model the most relevant context.

### Prompt
Instruction or context sent to the model.

### Prompt injection
Attack where external content tries to manipulate model instructions.

### Semantic cache
Cache that reuses responses when a new question is semantically similar to a previous one.

### Agent
System that uses a model to reason and call tools or APIs to complete tasks.

### Tool use
Model/agent capability to invoke external tools such as APIs, searches, or functions.

## Security, identity, and networking

### IAM
Identity and Access Management. AWS service for identities, roles, policies, and permissions.

### Principal
Identity that performs an action: user, role, service, or account.

### IAM role
Assumable identity with permissions. Preferred over long-lived credentials.

### Trust policy
Policy that defines who can assume a role.

### Permission policy
Policy that defines what actions an identity can perform and on which resources.

### Least privilege
Grant only the permissions required on specific resources.

### `iam:PassRole`
Permission to pass a role to a service. If broad, it can allow privilege escalation.

### OIDC
OpenID Connect. Allows CI/CD to assume AWS roles with temporary tokens and no static access keys.

### STS
Security Token Service. Issues temporary credentials for roles and sessions.

### Secrets Manager
Service for storing, rotating, and auditing secrets such as passwords, tokens, or API keys.

### SSM Parameter Store
Service for configuration parameters and simple secrets.

### KMS
Key Management Service. Manages encryption keys.

### CMK
Customer managed key. KMS key managed by the customer with custom policies.

### CloudTrail
Record of AWS API calls. Answers who did what, when, and from where.

### GuardDuty
Managed threat detection in AWS.

### Security Hub
Aggregates security findings and controls.

### WAF
Web Application Firewall for protecting HTTP workloads against common patterns and rate limiting.

### VPC
Isolated virtual network in AWS.

### Public subnet
Subnet with a route to an internet gateway.

### Private subnet
Subnet without direct internet exposure. Can egress through NAT or endpoints.

### NAT Gateway
Allows internet egress from private subnets. Can be a cost surprise by hour and GB.

### VPC endpoint
Private access to AWS services without going through the internet. S3/DynamoDB use gateway endpoints; others use interface endpoints.

### PrivateLink
Technology to expose/access services privately across VPCs/accounts.

### Security group
Stateful firewall at resource/ENI level.

### NACL
Stateless firewall at subnet level.

### Route 53
AWS managed DNS.

### ACM
AWS Certificate Manager. Managed TLS certificates.

### CloudFront
Global CDN for caching, TLS, edge routing, and WAF protection.

### OAC
Origin Access Control. Recommended way to allow CloudFront to read a private S3 bucket.

### SCP
Service Control Policy. AWS Organizations policy that limits maximum permissions for accounts/OUs.

## Observability, resilience, and operations

### Observability
Ability to understand the internal state of a system from logs, metrics, and traces.

### Log
Textual or JSON event record generated by the app or infrastructure.

### Structured logging
JSON logs with consistent fields such as requestId, userId, orderId, and errorType.

### Metric
Numeric measure over time: errors, latency, CPU, queue depth, cost.

### Custom metric
Application-defined metric, such as failed orders or cache hit rate.

### EMF
Embedded Metric Format. Way to publish CloudWatch metrics from JSON logs.

### Trace
Path of a request through services. Helps identify bottlenecks.

### X-Ray
AWS service for distributed traces.

### ADOT
AWS Distro for OpenTelemetry. AWS distribution of OpenTelemetry for metrics/traces.

### OpenTelemetry
Open standard for logs, metrics, and traces.

### Dashboard
Operational view with relevant metrics for a service or system.

### Alarm
Rule that changes state when a metric crosses a threshold.

### Composite alarm
Alarm that combines other alarms to reduce noise.

### M-of-N
Configuration where M out of N datapoints must breach to trigger an alarm.

### `treatMissingData`
CloudWatch setting that decides if missing data counts as OK, ALARM, missing, or ignore.

### p90/p99
Latency percentiles. p99 shows the experience of the slowest requests; better than Average for alarms.

### SLO
Service Level Objective. Measurable goal, for example 99.9% successful requests under 300 ms.

### SLI
Service Level Indicator. Metric that measures an SLO, such as error rate or p99 latency.

### Runbook
Operational guide for responding to an alarm or incident.

### Circuit breaker
Pattern that cuts calls to a failing downstream to avoid cascades.

### Backpressure
Mechanism to reduce or slow producers when consumers cannot keep up.

### Throttling
Rejecting or limiting requests because capacity or quota was exceeded.

### Retry with backoff
Retries with increasing wait time to avoid worsening a failure.

### Timeout
Wait limit before canceling an operation. Should be explicit.

### Health check
Health verification used by load balancers/orchestrators to know whether a target can serve traffic.

## Cost and financial governance

### Budget
Budget with alerts for actual or forecast spend. It does not technically limit spend by itself.

### Cost Explorer
Tool for analyzing costs by service, account, tag, and period.

### Cost Anomaly Detection
Detection of unusual spend or spikes.

### CUR
Cost and Usage Report. Detailed billing data for Athena or other query engines.

### Billing view
View that scopes billing data to a subset, useful for teams or units.

### Compute Optimizer
Service that recommends right-sizing for EC2, Lambda, EBS, RDS, and others.

### Cost Optimization Hub
Aggregates savings opportunities across services.

### Savings Plans
Spend commitment for discounts, common in compute and databases depending on plan type.

### Reserved Instances
Capacity/usage reservation for discounts in supported services.

### Right-sizing
Adjust CPU, memory, capacity, or resource class to actual usage.

### On-demand
Pay-per-use with no commitment. Good at the start or with uncertain traffic.

### Provisioned
Configured capacity. Can be cheaper with stable traffic, but requires tuning.

### Lifecycle policy
Rule to move or delete data by age, for example in S3 or ECR.

### Log retention
How long logs are kept. If infinite, cost silently grows.

### Wallet DoS
Accidental or malicious consumption that does not take the system down by CPU, but by bill. Mitigate with budgets, quotas, throttling, and WAF.
