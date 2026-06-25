# Observability with CloudWatch, X-Ray, and ADOT

## Use case

Every production system needs to know whether it is healthy, where it fails, who changed something, and how long each operation takes.

```mermaid
flowchart LR
  App[Lambda ECS API] --> Logs[CloudWatch Logs JSON]
  App --> Metrics[CloudWatch Metrics EMF]
  App --> Traces[X-Ray or ADOT]
  Metrics --> Alarms[CloudWatch Alarms]
  Alarms --> SNS[SNS Notifications]
  Audit[CloudTrail] --> Investigate[Audit queries]
  Metrics --> Dash[Dashboards]
```

## Main decision

Use **CloudWatch Logs, Metrics, Alarms, Dashboards, X-Ray/ADOT, and CloudTrail** as the operational baseline from the first deployment.

Do not leave it for later: without observability, you cannot make scaling, cost, reliability, or security decisions.

## Key questions

- How do you know the user is affected?
- What is the SLO metric: latency, errors, availability?
- Which logs allow debugging without exposing secrets?
- Where do you see traces across API, Lambda/ECS, DB, and queues?
- Which alarm wakes someone up, and which only goes to a dashboard?
- How do you answer "who deleted or changed this"?

## Why these services

- **CloudWatch Logs**: centralized logs.
- **EMF/Powertools**: custom metrics without synchronous calls.
- **CloudWatch Alarms**: detection and notification.
- **X-Ray/ADOT**: distributed traces.
- **CloudTrail**: auditing.
- **SNS**: alarm notification channel.

## Pros

- Native AWS baseline.
- Easy to connect alarms to SNS/Incident Manager.
- Traces help distributed systems.
- CloudTrail provides auditability.
- Dashboards speed up operations.

## Cons

- Logs without controlled retention cost money.
- Too many custom dimensions increase cost.
- High-resolution alarms cost more.
- Traces require instrumentation.
- Poorly tuned alerts create fatigue.

## Minimum recommended alarms

- Error rate, not only raw count.
- p99 latency, not Average.
- Throttles.
- Saturation: concurrency, CPU, memory, connections.
- Backlog: SQS age/depth, stream iterator age.
- DLQ depth > 0.
- Billing/Budgets per environment.

Alarm practices:

- Use M-of-N: for example 2 out of 3.
- Choose `treatMissingData` explicitly.
- `notBreaching` is common for error metrics.
- `breaching` for heartbeats.
- Composite alarms to reduce noise.

## Natural evolution

- If there are many accounts: cross-account observability.
- If traces leave AWS: ADOT/OpenTelemetry.
- If there are canaries: CloudWatch Synthetics.
- If incidents repeat: runbooks and service dashboards.
- If logs become expensive: retention, sampling, and log levels.

## Practice exercise

Define a dashboard for an API with Lambda, SQS, and DynamoDB. Include 6 alarms, one composite alarm, and a retention policy.

