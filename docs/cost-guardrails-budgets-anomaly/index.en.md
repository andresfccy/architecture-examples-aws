# Cost Guardrails and Wallet Protection

## Use case

Avoid billing surprises, accidental abuse, loops, consumption attacks, or poorly sized workloads.

```mermaid
flowchart LR
  Usage[AWS usage] --> CE[Cost Explorer]
  Usage --> CUR[CUR 2.0 to S3]
  CE --> Budgets[AWS Budgets]
  CE --> Anomaly[Cost Anomaly Detection]
  Usage --> CO[Compute Optimizer]
  Budgets --> SNS[SNS alerts]
  CUR --> Athena[Athena cost queries]
```

## Main decision

Enable **Budgets, Cost Anomaly Detection, Cost Explorer, tags, Compute Optimizer, and CUR** before the system grows.

Do not rely on manually checking the bill. Cost is also a security and architecture signal.

## Key questions

- What is the monthly budget per environment?
- Which tag identifies product, team, environment, and owner?
- Which service could grow without a limit?
- Which consumption metric triggers early alerting?
- Which automatic action is safe, and which requires approval?
- Which unit cost matters: per user, order, request, GB?

## Why these services

- **Budgets**: thresholds and alerts.
- **Cost Anomaly Detection**: unusual spikes.
- **Cost Explorer**: analysis by service/tag/account.
- **CUR + Athena**: line-item detail.
- **Compute Optimizer**: rightsizing.
- **Cost Optimization Hub**: aggregated recommendations.

## Pros

- Detects problems before month-end.
- Enables ownership through tags.
- Supports data-driven decisions.
- Identifies idle or oversized resources.
- Helps prevent accidental wallet DoS.

## Cons

- Budgets are not a technical rate limiter.
- Automatic actions can break production if poorly designed.
- Incomplete tags reduce visibility.
- Cost Explorer is not always immediate.
- Recommendations need context.

## Recommended alerts

- Monthly budget by account/environment.
- Forecast budget at 80% and 100%.
- Anomaly Detection by service.
- Alarm for NAT Gateway bytes/estimated cost.
- Alarm for CloudWatch Logs growth.
- Alarm for SQS backlog or EventBridge loop.
- Service Quotas where a limit protects spend.

## Practical guardrails

- Required tags: `app`, `env`, `owner`, `cost-center`.
- Explicit log retention.
- Lifecycle on S3 and snapshots.
- WAF rate-based rules for public endpoints.
- API Gateway throttling.
- Lambda reserved concurrency to limit explosion.
- VPC endpoints to reduce NAT where applicable.

## Natural evolution

- If spend is stable: Savings Plans or RIs with analysis.
- If resources are idle: Compute Optimizer and schedules.
- If logs dominate: sampling, retention, and classes.
- If DynamoDB on-demand stabilizes: evaluate provisioned.
- If Fargate runs continuously: Savings Plans or right-sizing.

## Practice exercise

Define guardrails for a public API: API throttling, WAF rate limit, Lambda reserved concurrency, budget, anomaly alert, and cost-per-request dashboard.

