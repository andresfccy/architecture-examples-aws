# Edge Static Site with CloudFront and S3

## Use case

SPA frontend, documentation, landing page, or public portal that must load fast globally with TLS, custom domain, and a non-public bucket.

```mermaid
flowchart LR
  User[Users] --> R53[Route 53]
  R53 --> CF[CloudFront]
  CF --> WAF[AWS WAF optional]
  CF --> S3[S3 private bucket with OAC]
  CF --> Api[API origin optional]
  S3 --> Logs[Access logs optional]
```

## Main decision

Use **CloudFront + private S3 + Origin Access Control** for global static sites.

Use **Amplify Hosting** if you want a managed frontend flow with builds, previews, and branches. Use **ECS/Lambda** if there is heavy server-side rendering or dynamic backend. Use **API Gateway/ALB** as additional origins for APIs.

## Key questions

- Is it static site, SPA, or SSR?
- Do you need previews by branch?
- What cache/invalidation strategy will you use?
- Are there APIs under the same domain?
- Do you need WAF or rate limiting?
- How do you avoid a public bucket?

## Why these services

- **CloudFront**: global CDN and TLS.
- **S3**: cheap and durable origin.
- **OAC**: private access to the bucket.
- **Route 53 + ACM**: domain and certificates.
- **WAF**: edge protection.

## Pros

- Very low cost for static content.
- High global performance.
- Bucket can remain private.
- Easy to add WAF and headers.
- Good fit for SPAs.

## Cons

- Invalidations require care.
- SSR does not fit without additional compute.
- Bad cache settings serve stale content.
- Logs can grow in cost.
- CORS/API auth remain separate concerns.

## Alerts and cost

Minimum:

- CloudFront 4xx/5xx error rate.
- Origin latency.
- WAF blocked requests.
- S3 4xx/5xx.
- Budget for data transfer, invalidations, and logs.

Guardrails:

- Block Public Access on S3.
- Bucket policy only for CloudFront OAC.
- HTTPS redirect.
- Security headers.
- Lifecycle/retention for logs.

## Natural evolution

- If there is SSR: evaluate Amplify, Lambda@Edge, or containers.
- If APIs grow: separate API origin and auth.
- If consumption attacks happen: WAF rate-based rules.
- If assets are heavy: optimization and cache policies.
- If backend is multi-region: origins with failover.

## Applied Examples

### Example 1: Public university portal with admissions traffic spikes

**Context:** A university publishes news, programs, static forms, and admissions content with strong spikes near application deadlines.

**Questions and answers:**

- **Why private S3 behind CloudFront?** S3 stores assets without public exposure, and CloudFront handles cache, TLS, WAF, and edge routing.
- **Where does dynamic content go?** Forms and APIs go to API Gateway/Lambda or a separate backend; the static site must not contain secrets.
- **How is cache-safe deployment handled?** Versioned files, controlled invalidations, OAC, cache headers, and rollback to the previous build.

**Architecture by stage:**

- **Initial project:** Private S3, CloudFront with OAC, ACM in us-east-1, Route 53 alias, basic WAF, and build pipeline.
- **Middle stage:** Multi-origin for APIs, Lambda@Edge/CloudFront Functions for redirects, logging to S3, canaries, and branch previews.
- **Large-scale projection:** Multi-region origin failover, separate accounts, advanced DDoS protection, cache hit rate observability, and a log data lake.

**Migration/evolution:** If the site runs on a CMS/VM today, export the static frontend first, move media to S3, and keep the CMS as origin/API until content is decoupled.

```mermaid
flowchart LR
  User[Visitors] --> R53[Route 53]
  R53 --> Cf[CloudFront]
  Cf --> Waf[WAF]
  Cf --> S3[S3 private site]
  Cf --> Api[API Gateway forms]
  Api --> Fn[Lambda handlers]
  Cf --> Logs[S3 access logs]
  Logs --> Athena[Athena analysis]
  Pipeline[CI build] --> S3
```

**Related patterns:** [rest-api-serverless-crud](../rest-api-serverless-crud/index.md), [security-iam-secrets-oidc](../security-iam-secrets-oidc/index.md), [observability-cloudwatch-xray-adot](../observability-cloudwatch-xray-adot/index.md).

## Practice exercise

Design deployment of an SPA with private bucket, CloudFront, Route 53, ACM, WAF rate rule, and automatic invalidation.

