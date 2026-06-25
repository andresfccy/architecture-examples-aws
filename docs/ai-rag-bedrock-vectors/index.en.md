# RAG with Bedrock and Vector Stores

## Use case

Support application or internal agent answers questions using private documents, tickets, wikis, and knowledge bases.

```mermaid
flowchart LR
  Docs[Documents] --> Ingest[Ingestion Lambda or Glue]
  Ingest --> S3[S3 source documents]
  Ingest --> Embed[Bedrock embeddings]
  Embed --> Vectors[S3 Vectors or OpenSearch]
  User[User] --> Api[API Lambda or ECS]
  Api --> Retrieve[Vector retrieval]
  Retrieve --> Bedrock[Bedrock model]
  Api --> Cache[ElastiCache semantic cache optional]
```

## Main decision

Use **Bedrock + vector store** when you need grounding over private knowledge.

Use **S3 Vectors** for cost-effective vector storage and moderate queries. Use **OpenSearch** for high QPS, hybrid search, facets, or aggregations. Use **ElastiCache semantic cache** if repeated questions increase cost/latency.

## Key questions

- Which documents are the source of truth?
- How often do they change?
- Which embedding model and dimension will you use?
- Do you need filters by tenant, permission, or metadata?
- What is the expected QPS?
- Do you need to explain sources/citations?
- How will you prevent data leakage across tenants?

## Why these services

- **Bedrock**: managed models.
- **S3**: source documents.
- **S3 Vectors**: economical vector storage.
- **OpenSearch**: hybrid search and high throughput.
- **DynamoDB**: sessions and metadata.
- **ElastiCache**: semantic cache or agent memory.

## Pros

- Reduces need for initial fine-tuning.
- Documents remain updateable.
- Can grow by layers.
- Good serverless fit.
- Enables source traceability.

## Cons

- Quality depends on chunking and metadata.
- Token costs can grow quickly.
- Multi-tenant security is critical.
- Automated evaluation requires work.
- Latency can rise due to retrieval + generation.

## Alerts and cost

Minimum:

- p95/p99 latency for retrieval and generation.
- Bedrock throttling errors.
- Tokens/input-output per request.
- Cache hit rate if using semantic cache.
- Vector query errors.
- Budget for Bedrock, embeddings, vector store, and logs.

Guardrails:

- Tenant filters in metadata.
- Do not store prompts with secrets.
- Quality and safety evaluations.
- Rate limits per user/API key.
- Cost anomaly by model.

## Natural evolution

- If QPS rises: OpenSearch or cache.
- If token cost rises: prompt compression, caching, smaller model.
- If answers fail: improve chunking, metadata, and reranking.
- If data is sensitive: ABAC and tenant separation.
- If agents execute actions: IAM permissions per tool and audit.

## Applied Examples

### Example 1: Internal legal assistant for corporate documents

**Context:** A legal department wants to query contracts, policies, and minutes with cited answers, access control, and low retrieval cost.

**Questions and answers:**

- **What is the trusted source?** S3 stores canonical documents, Bedrock Knowledge Bases retrieves chunks, and the LLM answers only with grounding.
- **S3 Vectors or OpenSearch?** S3 Vectors for moderate QPS and low cost; OpenSearch when hybrid search, facets, or hundreds of sustained QPS are required.
- **How is prompt injection mitigated?** Sanitize documents, separate instructions from context, use Guardrails, and filter by permission metadata.

**Architecture by stage:**

- **Initial project:** S3 documents, ingestion pipeline, Bedrock embeddings, S3 Vectors, Lambda API, and Cognito.
- **Middle stage:** Semantic chunking for long documents, metadata filtering by department, reranking, semantic cache in ElastiCache, and audit of prompts/responses.
- **Large-scale projection:** OpenSearch for hybrid search, separate data accounts, automated evaluations, cost attribution by team, and AgentCore/Agents if actions are enabled.

**Migration/evolution:** If keyword search exists today, keep textual OpenSearch, add vectors by collection, and enable RAG first for reading, not actions.

```mermaid
flowchart LR
  Docs[S3 legal documents] --> Ingest[Ingestion pipeline]
  Ingest --> Embed[Bedrock embeddings]
  Embed --> Vectors[S3 Vectors]
  User[Authenticated user] --> Api[Lambda RAG API]
  Api --> Vectors
  Api --> Model[Bedrock LLM]
  Api --> Guard[Guardrails]
  Api --> Cache[Semantic cache]
  Vectors --> Cite[Citations]
```

**Related patterns:** [search-opensearch-cdc](../search-opensearch-cdc/index.md), [file-processing-s3-stepfunctions](../file-processing-s3-stepfunctions/index.md), [redis-cache-aside-elasticache](../redis-cache-aside-elasticache/index.md).

## Practice exercise

Design RAG for an internal wiki. Define ingestion, chunking, permission metadata, vector store, budget per user, and quality metrics.

