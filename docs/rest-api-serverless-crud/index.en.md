# Serverless REST API CRUD

## Use case

Backend for a web or mobile application: users create orders, browse a catalog, upload images, and receive synchronous responses.

```mermaid
flowchart LR
  Client[Web or mobile] --> Api[API Gateway HTTP API]
  Api --> Auth[Cognito or JWT authorizer]
  Api --> Fn[Lambda per route]
  Fn --> Db[DynamoDB]
  Fn --> Obj[S3 presigned URLs]
  Fn --> Bus[EventBridge optional]
  Fn --> Logs[CloudWatch Logs and X-Ray]
```

## Main decision

Start with **API Gateway HTTP API + Lambda + DynamoDB** when the domain is CRUD, traffic is variable, and you want low operational overhead.

Use **API Gateway REST API** if you need direct WAF, API keys, usage plans, request validation, or native caching. Use **ECS/Fargate** if you need long connections, processes longer than 15 minutes, heavy dependencies, or runtime control.

## Key questions

- Does the response need to be immediate, or can it be asynchronous?
- Are the access patterns key-based and known?
- Are there joins, complex reports, or multi-table transactions?
- Does the payload exceed 10 MB?
- Do you need WAF, API keys, advanced throttling, or caching?
- Does the team prefer one function per route or a lambdalith such as Express/FastAPI?

## Why these services

- **HTTP API**: lower complexity for modern APIs.
- **Lambda**: scales on demand and reduces administration.
- **DynamoDB on-demand**: good starting point when traffic is unclear.
- **S3 presigned URLs**: avoids sending large files through API Gateway.
- **EventBridge**: publishes domain events without coupling consumers.

## Pros

- Fast time-to-market.
- Low cost with irregular traffic.
- Scales without server management.
- Granular IAM per function if you use micro-Lambda.
- Easy to add SQS, EventBridge, or Step Functions later.

## Cons

- Possible cold starts.
- 15-minute Lambda limit.
- Distributed debugging requires good observability.
- DynamoDB requires access-pattern design.
- APIs tightly coupled to the frontend can become messy.

## Alerts and cost

Minimum:

- API Gateway 4xx, 5xx, and p99 latency.
- Lambda Errors, Throttles, p99 Duration, ConcurrentExecutions.
- DynamoDB ThrottledRequests, ConsumedRead/WriteCapacity, SystemErrors.
- DLQ depth if there are async invocations.
- Monthly budget per environment and Cost Anomaly Detection.

Cost drivers:

- API Gateway requests.
- Lambda duration and memory.
- DynamoDB RCU/WCU or on-demand requests.
- CloudWatch Logs without retention.

## Natural evolution

- If an operation takes too long: move it to SQS + worker or Step Functions.
- If several consumers react to an order: publish an event to EventBridge.
- If there are repeated reads: add ElastiCache or DAX depending on the case.
- If relational queries appear: move that part to Aurora, not necessarily the whole system.
- If the frontend needs many aggregations: evaluate AppSync GraphQL.

## Practice exercise

Design an orders API with endpoints `POST /orders`, `GET /orders/{id}`, and `GET /customers/{id}/orders`. Define the DynamoDB table, alarms, budget, and an `OrderCreated` event.

