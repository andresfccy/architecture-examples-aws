# Internal gRPC on ECS

## Use case

Low-latency internal microservices: pricing, inventory, payments, risk, or recommendations. Clients are other services, not browsers.

```mermaid
flowchart LR
  SvcA[Service A ECS] --> ALB[Internal ALB HTTP/2 gRPC]
  ALB --> SvcB[Service B ECS Fargate]
  SvcB --> Db[Aurora or DynamoDB]
  SvcB --> Cache[ElastiCache optional]
  SvcA --> Mesh[ECS Service Connect optional]
  SvcB --> Obs[ADOT, CloudWatch, X-Ray]
```

## Main decision

Use **gRPC on ECS/Fargate** when you need strongly typed contracts, low latency, internal streaming, or efficient service-to-service communication.

Use **REST** if the API is public or consumed by browsers without an extra gateway. Use **GraphQL** if the main problem is client aggregation. Use **EKS** only if you already need Kubernetes.

## Key questions

- Are consumers internal and controlled?
- Do you need versioned `.proto` contracts?
- Is there request/response or bidirectional streaming?
- Can the team operate containers?
- Do you need service discovery, mTLS, or traffic shifting?
- How will you propagate traces across services?

## Why these services

- **ECS Fargate**: containers without host management.
- **Internal ALB**: supports HTTP/2 and gRPC.
- **Service Connect**: discovery and service-to-service communication.
- **ADOT/X-Ray**: distributed traces.
- **Secrets Manager**: credentials outside images and plain variables.

## Pros

- Explicit contracts and generated clients.
- More efficient than JSON for intense internal traffic.
- Good fit for services with long-running runtimes.
- Blue/green or rolling deployments in ECS.
- Fine CPU/memory control.

## Cons

- Manual debugging is less simple than REST.
- Browser support requires a proxy or gateway.
- Requires disciplined protobuf versioning.
- Container operations are heavier than Lambda.
- Load balancing and health checks need solid testing.

## Alerts and cost

Minimum:

- ALB target 5xx, p99 target response time, unhealthy hosts.
- ECS CPU, memory, task restarts, deployment failures.
- Application gRPC status codes.
- Container Insights and logs with retention.
- Budget for Fargate vCPU/memory and ALB.

Cost drivers:

- Always-on Fargate tasks.
- ALB hours and LCU.
- NAT Gateway if private tasks access the internet.
- Verbose logs.

## Natural evolution

- If traffic grows: autoscale by CPU, memory, or custom metrics.
- If you need advanced resilience: circuit breakers and client retries.
- If service mesh matters: evaluate Service Connect or App Mesh more formally.
- If usage is only sporadic: reconsider Lambda.
- If many APIs are public: put REST/GraphQL at the edge and gRPC internally.

## Applied Examples

### Example 1: Internal logistics routing engine

**Context:** A delivery company separates quoting, driver availability, and delivery promise calculation. Calls are internal, contract-heavy, and latency-sensitive.

**Questions and answers:**

- **Why not internal REST?** gRPC reduces overhead, uses protobuf contracts, and makes deadlines explicit between services called many times per request.
- **Where does state live?** Transactional decisions stay in Aurora; frequent zone and rate data is cached in ElastiCache; change events leave through EventBridge.
- **How is blast radius controlled?** ECS Service Connect, per-service security groups, separate task roles, and client-side circuit breakers.

**Architecture by stage:**

- **Initial project:** ECS Fargate in private subnets, internal ALB with HTTP/2, ECR, CloudWatch Container Insights, and Secrets Manager.
- **Middle stage:** Service Connect for discovery, autoscaling by CPU/latency, blue/green deployment, X-Ray/ADOT, and VPC endpoints for ECR, logs, and Secrets Manager.
- **Large-scale projection:** Accounts by logistics domain, active regional meshes, Kafka/MSK for fleet telemetry, and a data lake for historical optimization.

**Migration/evolution:** If the current system is a Java monolith, extract idempotent read services first, keep public REST at the edge, and use gRPC only inside the VPC.

```mermaid
flowchart LR
  Api[Public API] --> Edge[REST facade]
  Edge --> Alb[Internal ALB gRPC]
  Alb --> Quote[ECS quote service]
  Alb --> Driver[ECS driver service]
  Alb --> Promise[ECS promise service]
  Quote --> Cache[ElastiCache zones]
  Driver --> Db[Aurora]
  Promise --> Bus[EventBridge]
  Bus --> Stream[MSK telemetry]
```

**Related patterns:** [container-web-app-fargate-alb](../container-web-app-fargate-alb/index.md), [redis-cache-aside-elasticache](../redis-cache-aside-elasticache/index.md), [kafka-msk-event-streaming](../kafka-msk-event-streaming/index.md).

## Practice exercise

Define a `PricingService.GetQuote` service in protobuf. Design the task definition, internal ALB, health check, and metrics for errors by gRPC code.

