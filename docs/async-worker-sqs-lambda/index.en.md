# Asynchronous Worker with SQS and Lambda

## Use case

Process work that does not need an immediate response: sending emails, generating PDFs, syncing inventory, deferred payment processing, or small batch jobs.

```mermaid
flowchart LR
  Api[API or Producer] --> Queue[SQS Queue]
  Queue --> Lambda[Lambda Worker]
  Lambda --> Db[DynamoDB Aurora or S3]
  Queue --> Dlq[SQS DLQ]
  Lambda --> Metrics[CloudWatch Metrics and Logs]
```

## Main decision

Use **SQS + Lambda** when you want to decouple producer and consumer, absorb spikes, and process messages with managed retries.

Use **SQS FIFO** if ordering by group or deduplication matters. Use **Kinesis/MSK** if you need replay, multiple independent consumers, or continuous high volume. Use an **ECS worker** if each task lasts more than 15 minutes or needs heavy binaries.

## Key questions

- Can the user wait, or do they only need an acknowledgment?
- Is the task idempotent?
- What happens if it is processed twice?
- Does ordering matter?
- How long does processing take at p95/p99?
- How will you handle poison messages?

## Why these services

- **SQS**: durable buffer with retries and DLQ.
- **Lambda event source mapping**: scales workers based on queue depth.
- **DLQ**: separates permanent failures.
- **CloudWatch alarms**: detects backlog and errors.

## Pros

- Decouples spikes.
- Reduces cascading failures.
- No worker administration.
- Easy to limit concurrency to protect downstreams.
- DLQ enables recovery.

## Cons

- At-least-once semantics require idempotency.
- Latency is not always immediate.
- No global ordering in SQS Standard.
- Large messages should go to S3.
- Debugging requires correlation IDs.

## Alerts and cost

Minimum:

- SQS ApproximateAgeOfOldestMessage.
- SQS ApproximateNumberOfMessagesVisible.
- DLQ depth > 0.
- Lambda Errors, Throttles, p99 Duration.
- ConcurrentExecutions against reserved limit.

Practical rules:

- Visibility timeout at least 6x the Lambda timeout.
- Enable partial batch failure reporting.
- Use reserved concurrency to protect databases.
- Explicit log retention.

## Natural evolution

- If you need fan-out: SNS or EventBridge before SQS.
- If you need orchestration: Step Functions.
- If you need replay and parallel consumers: Kinesis or MSK.
- If workers are CPU-heavy: ECS/Fargate.
- If backlog keeps growing: review downstream capacity and batch size.

## Practice exercise

Design a PDF invoice generation flow. Define queue, DLQ, idempotency key, alarms, and redrive strategy.

