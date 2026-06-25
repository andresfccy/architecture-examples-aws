(function () {
  const glossary = {
    es: [
      ["API Gateway REST API", "Opcion mas completa para APIs con API keys, usage plans, request validation, caching o WAF directo."],
      ["API Gateway HTTP API", "Opcion simple y costo-efectiva para APIs HTTP modernas."],
      ["Aurora Serverless v2", "Modo de Aurora que escala capacidad en ACUs segun demanda."],
      ["Cost Anomaly Detection", "Deteccion de gastos inusuales o spikes."],
      ["DynamoDB Streams", "Flujo de cambios de una tabla DynamoDB. Se usa para CDC, proyecciones o eventos."],
      ["EventBridge Pipes", "Conexion administrada source-target con filtrado/enriquecimiento sin Lambda pegamento."],
      ["Glue Data Catalog", "Catalogo de metadatos para tablas consultables por Athena, Glue y otros motores."],
      ["Kinesis Data Streams", "Servicio AWS-native para streams con particiones/shards, retencion y consumidores."],
      ["Provisioned concurrency", "Capacidad Lambda pre-inicializada para reducir cold starts. Tiene costo adicional."],
      ["Reserved concurrency", "Limite o reserva gratuita de concurrencia Lambda. Protege downstreams y controla blast radius."],
      ["Single-table design", "Modelar multiples entidades en una tabla DynamoDB segun patrones de acceso."],
      ["Visibility timeout", "Tiempo durante el cual un mensaje SQS queda oculto mientras un worker lo procesa."],
      ["Well-Architected", "Marco de AWS para evaluar arquitecturas en seguridad, confiabilidad, excelencia operacional, performance, costo y sostenibilidad."],
      ["At-least-once", "Garantia donde un mensaje puede procesarse mas de una vez. Requiere idempotencia."],
      ["Backpressure", "Mecanismo para reducir o frenar produccion cuando consumidores no alcanzan."],
      ["Bedrock", "Servicio AWS para usar foundation models y construir aplicaciones generativas sin administrar modelos base."],
      ["Blue/green deployment", "Despliegue con dos ambientes o versiones, moviendo trafico de la version vieja a la nueva."],
      ["Blast radius", "Alcance del dano si algo falla. Se reduce con cuentas separadas, permisos minimos y limites por ambiente."],
      ["Cache hit rate", "Porcentaje de lecturas resueltas por cache. Si es bajo, el cache no esta ayudando."],
      ["Cache stampede", "Muchos requests recalculan el mismo dato cuando expira. Se mitiga con locks, jitter o stale-while-revalidate."],
      ["Cache-aside", "Patron donde la app consulta cache primero; si falla, lee DB y pobla cache."],
      ["Canary deployment", "Despliegue gradual a un porcentaje pequeno de trafico antes de exponer a todos."],
      ["Circuit breaker", "Patron que corta llamadas a un downstream fallando para evitar cascadas."],
      ["CloudFormation", "Servicio nativo de AWS para declarar y desplegar infraestructura con templates YAML/JSON."],
      ["CloudFront", "CDN global para cache, TLS, edge routing y proteccion con WAF."],
      ["CloudTrail", "Registro de llamadas a APIs AWS. Responde quien hizo que, cuando y desde donde."],
      ["Cold start", "Tiempo extra cuando Lambda inicializa un entorno nuevo. Importa en APIs sensibles a latencia."],
      ["Consumer group", "Grupo de consumidores Kafka que reparte particiones entre instancias."],
      ["Consumer lag", "Distancia entre lo producido y lo consumido. Es una metrica critica en streaming."],
      ["Cost Explorer", "Herramienta para analizar costos por servicio, cuenta, tag y periodo."],
      ["Data lake", "Repositorio central de datos historicos en storage barato, normalmente S3."],
      ["ElastiCache", "Servicio administrado de cache compatible con Valkey, Redis OSS o Memcached."],
      ["Event bus", "Canal logico donde se publican eventos. Conviene usar buses por dominio."],
      ["Event pattern", "Regla de filtrado para decidir que eventos llegan a un target."],
      ["EventBridge", "Bus de eventos con routing por contenido, integraciones AWS/SaaS, rules, pipes y archive/replay."],
      ["Foundation model", "Modelo grande preentrenado, como modelos de texto, embeddings o multimodales."],
      ["Full-text search", "Busqueda por relevancia en texto, no solo igualdad por clave."],
      ["Function URL", "Endpoint HTTPS directo para Lambda. Debe usarse con auth segura en produccion, idealmente AWS_IAM."],
      ["Grounding", "Anclar la respuesta del modelo a fuentes o datos concretos recuperados, reduciendo alucinaciones."],
      ["Health check", "Verificacion de salud usada por balanceadores/orquestadores para saber si un target sirve trafico."],
      ["Hybrid search", "Combina busqueda textual tradicional con vector search."],
      ["Idempotencia", "Capacidad de repetir una operacion sin cambiar el resultado final de forma incorrecta."],
      ["Least privilege", "Dar solo permisos necesarios sobre recursos especificos."],
      ["Log retention", "Tiempo que se guardan logs. Si queda infinito, el costo crece silenciosamente."],
      ["NAT Gateway", "Permite salida a internet desde subnets privadas. Puede ser un costo sorpresa por hora y GB."],
      ["OpenTelemetry", "Estandar abierto de telemetria para logs, metricas y trazas."],
      ["OpenSearch", "Motor de busqueda, agregaciones, logs y vector search. Bueno para texto, facetas y busqueda hibrida."],
      ["Permission policy", "Politica que define que acciones puede hacer una identidad y sobre que recursos."],
      ["Presigned URL", "URL temporal para subir o bajar objetos S3 sin pasar el archivo por tu backend."],
      ["PrivateLink", "Tecnologia para exponer/acceder servicios de forma privada entre VPCs/cuentas."],
      ["Prompt injection", "Ataque donde contenido externo intenta manipular instrucciones del modelo."],
      ["RDS Proxy", "Pool de conexiones administrado para proteger bases RDS/Aurora, muy util con Lambda."],
      ["Retry with backoff", "Reintentos con espera creciente para evitar empeorar una falla."],
      ["S3 Tables", "Servicio para tablas Iceberg administradas sobre S3, con integracion a Glue/Athena."],
      ["S3 Vectors", "Servicio de AWS para almacenar y consultar vectores de forma costo-efectiva, especialmente para QPS moderado."],
      ["Savings Plans", "Compromiso de gasto para descuentos, comun en compute y bases segun modalidad."],
      ["Secrets Manager", "Servicio para almacenar, rotar y auditar secretos como passwords, tokens o API keys."],
      ["Security group", "Firewall stateful a nivel de recurso/ENI."],
      ["Semantic cache", "Cache que reutiliza respuestas cuando una nueva pregunta es semanticamente parecida a una anterior."],
      ["Semantic search", "Busqueda por significado, no solo por palabras exactas."],
      ["Service Connect", "Capacidad de ECS para discovery y comunicacion servicio-a-servicio."],
      ["Step Functions", "Servicio de orquestacion para workflows con pasos, retries, branching y estado visible."],
      ["Structured logging", "Logs en JSON con campos consistentes como requestId, userId, orderId y errorType."],
      ["Trust policy", "Politica que define quien puede asumir un rol."],
      ["Vector search", "Buscar elementos semanticamente similares comparando embeddings."],
      ["Vector store", "Almacen especializado para guardar embeddings y buscar vecinos similares."],
      ["VPC endpoint", "Acceso privado a servicios AWS sin salir por internet."],
      ["Wallet DoS", "Consumo accidental o malicioso que no tumba el sistema por CPU, sino por factura."],
      ["WebSocket", "Conexion persistente bidireccional entre cliente y servidor."],
      ["X-Ray", "Servicio AWS para trazas distribuidas."],
      ["ACM", "AWS Certificate Manager. Certificados TLS administrados."],
      ["ACU", "Aurora Capacity Unit. Unidad de capacidad de Aurora Serverless."],
      ["ADOT", "AWS Distro for OpenTelemetry. Distribucion AWS de OpenTelemetry para metricas/trazas."],
      ["ALB", "Application Load Balancer. Balanceador HTTP/HTTPS/gRPC con health checks y reglas de routing."],
      ["AppSync", "Servicio administrado de GraphQL en AWS con resolvers, auth y subscriptions."],
      ["Athena", "Servicio serverless para consultar datos en S3 con SQL. Cobra principalmente por datos escaneados."],
      ["Aurora", "Base relacional administrada compatible con PostgreSQL o MySQL, pensada para alta disponibilidad y performance."],
      ["Budget", "Presupuesto con alertas por gasto real o forecast. No limita tecnicamente por si solo."],
      ["BFF", "Backend for Frontend. Capa backend adaptada a necesidades de un cliente especifico."],
      ["CDC", "Change Data Capture. Capturar cambios de una base para replicarlos a busqueda, analytics o eventos."],
      ["CDK", "AWS Cloud Development Kit. Permite definir infraestructura AWS usando lenguajes como TypeScript o Python."],
      ["CMK", "Customer managed key. Llave KMS administrada por el cliente con politicas propias."],
      ["CUR", "Cost and Usage Report. Datos detallados de facturacion para consultar con Athena u otros motores."],
      ["DLQ", "Dead-letter queue. Cola donde caen mensajes que fallaron despues de varios intentos."],
      ["Drift", "Diferencia entre lo que declara IaC y lo que existe realmente en AWS."],
      ["DynamoDB", "Base NoSQL key-value/document administrada, baja latencia y escala alta."],
      ["ECR", "Elastic Container Registry. Registro privado para imagenes Docker."],
      ["ECS", "Elastic Container Service. Orquestador administrado de contenedores en AWS."],
      ["EMF", "Embedded Metric Format. Forma de publicar metricas CloudWatch desde logs JSON."],
      ["Fargate", "Modo serverless para ejecutar contenedores sin administrar instancias EC2."],
      ["Firehose", "Servicio de entrega administrada de datos hacia S3, OpenSearch, Redshift y otros destinos."],
      ["Flink", "Motor de procesamiento stateful para streams: ventanas, joins, agregaciones y eventos complejos."],
      ["GSI", "Global Secondary Index. Indice secundario de DynamoDB para otros patrones de acceso."],
      ["GraphQL", "Modelo de API donde el cliente pide exactamente los campos que necesita."],
      ["gRPC", "Protocolo RPC eficiente basado en HTTP/2 y protobuf."],
      ["IAM", "Identity and Access Management. Servicio de identidades, roles, politicas y permisos de AWS."],
      ["IaC", "Infrastructure as Code. Definir infraestructura en archivos versionados."],
      ["Iceberg", "Formato abierto de tablas analiticas con snapshots, schema evolution y particiones."],
      ["KMS", "Key Management Service. Administra llaves de cifrado."],
      ["Lakehouse", "Enfoque que combina data lake con capacidades de tabla, transacciones y schema evolution."],
      ["Lambda", "Computo serverless por evento. Ideal para funciones cortas y trafico variable."],
      ["LLM", "Large Language Model. Modelo de lenguaje usado para generar, resumir, razonar o extraer texto."],
      ["MSK", "Managed Streaming for Apache Kafka. Kafka administrado para workloads Kafka."],
      ["NoSQL", "Familia de bases no relacionales optimizadas para modelos especificos."],
      ["OAC", "Origin Access Control. Forma recomendada de permitir que CloudFront lea un bucket S3 privado."],
      ["OIDC", "OpenID Connect. Permite que CI/CD asuma roles AWS con tokens temporales."],
      ["OLAP", "Procesamiento analitico: reportes, agregaciones, historicos y BI."],
      ["OLTP", "Procesamiento transaccional de la aplicacion."],
      ["Parquet", "Formato columnar eficiente para analitica."],
      ["Partition", "Unidad de paralelismo y orden en Kafka/Kinesis."],
      ["RAG", "Retrieval-Augmented Generation. Recupera contexto externo y lo entrega al LLM para responder mejor."],
      ["Redrive", "Reprocesar mensajes desde una DLQ hacia la cola original o un flujo controlado."],
      ["Redshift", "Data warehouse administrado para BI y analitica de alto rendimiento."],
      ["Replay", "Volver a leer eventos pasados desde una posicion o ventana de retencion."],
      ["REST", "Estilo de API basado en recursos y verbos HTTP."],
      ["Rollback", "Revertir a una version anterior cuando el despliegue falla o degrada metricas."],
      ["S3", "Object storage durable. Bueno para archivos, data lake, backups y assets estaticos."],
      ["SAM", "Serverless Application Model. Extension de CloudFormation enfocada en serverless."],
      ["SCP", "Service Control Policy. Politica de AWS Organizations que limita permisos maximos."],
      ["SLO", "Service Level Objective. Objetivo medible de nivel de servicio."],
      ["SLI", "Service Level Indicator. Metrica que mide un SLO."],
      ["SNS", "Pub/sub simple para fan-out a SQS, Lambda, HTTP, email o SMS."],
      ["SQL", "Modelo relacional con tablas, joins, constraints y transacciones."],
      ["SQS", "Cola administrada para desacoplar productores y consumidores."],
      ["SSE", "Server-Sent Events. Canal simple servidor-cliente para streaming unidireccional."],
      ["Stack", "Unidad de despliegue de infraestructura."],
      ["STS", "Security Token Service. Emite credenciales temporales para roles y sesiones."],
      ["TTL", "Time to Live. Expiracion automatica de registros u objetos."],
      ["Topic", "Canal logico en Kafka/SNS donde productores publican y consumidores reciben."],
      ["Trace", "Recorrido de una peticion a traves de servicios."],
      ["Valkey", "Motor in-memory compatible con Redis OSS."],
      ["Vector", "Lista de numeros. En IA se usa para comparar similitud entre contenidos."],
      ["VPC", "Red virtual aislada en AWS."],
      ["WAF", "Web Application Firewall para proteger HTTP contra patrones comunes y rate limiting."]
    ],
    en: [
      ["API Gateway REST API", "More complete option for APIs with API keys, usage plans, request validation, caching, or direct WAF."],
      ["API Gateway HTTP API", "Simpler and cost-effective option for modern HTTP APIs."],
      ["Aurora Serverless v2", "Aurora mode that scales capacity in ACUs based on demand."],
      ["Cost Anomaly Detection", "Detection of unusual spend or spikes."],
      ["DynamoDB Streams", "Change stream from a DynamoDB table. Used for CDC, projections, or events."],
      ["EventBridge Pipes", "Managed source-to-target connection with filtering/enrichment and no glue Lambda."],
      ["Glue Data Catalog", "Metadata catalog for tables queryable by Athena, Glue, and other engines."],
      ["Kinesis Data Streams", "AWS-native stream service with partitions/shards, retention, and consumers."],
      ["Provisioned concurrency", "Pre-initialized Lambda capacity to reduce cold starts. Has additional cost."],
      ["Reserved concurrency", "Free Lambda concurrency limit or reservation. Protects downstream systems and controls blast radius."],
      ["Single-table design", "Model multiple entities in one DynamoDB table based on access patterns."],
      ["Visibility timeout", "Time during which an SQS message is hidden while a worker processes it."],
      ["Well-Architected", "AWS framework for evaluating architectures across security, reliability, operational excellence, performance, cost, and sustainability."],
      ["At-least-once", "Delivery guarantee where a message can be processed more than once. Requires idempotency."],
      ["Backpressure", "Mechanism to reduce or slow producers when consumers cannot keep up."],
      ["Bedrock", "AWS service for using foundation models and building generative applications without managing base models."],
      ["Blue/green deployment", "Deployment with two environments or versions, shifting traffic from the old version to the new one."],
      ["Blast radius", "Scope of damage if something fails. Reduced with separate accounts, least privilege, and per-environment limits."],
      ["Cache hit rate", "Percentage of reads served by cache. If low, the cache is not helping."],
      ["Cache stampede", "Many requests recompute the same value when it expires. Mitigate with locks, jitter, or stale-while-revalidate."],
      ["Cache-aside", "Pattern where the app checks cache first; on miss, it reads the DB and populates cache."],
      ["Canary deployment", "Gradual deployment to a small percentage of traffic before exposing it to everyone."],
      ["Circuit breaker", "Pattern that cuts calls to a failing downstream to avoid cascades."],
      ["CloudFormation", "Native AWS service for declaring and deploying infrastructure with YAML/JSON templates."],
      ["CloudFront", "Global CDN for caching, TLS, edge routing, and WAF protection."],
      ["CloudTrail", "Record of AWS API calls. Answers who did what, when, and from where."],
      ["Cold start", "Extra time when Lambda initializes a new execution environment. Important for latency-sensitive APIs."],
      ["Consumer group", "Kafka consumer group that distributes partitions across instances."],
      ["Consumer lag", "Distance between produced and consumed data. Critical streaming metric."],
      ["Cost Explorer", "Tool for analyzing costs by service, account, tag, and period."],
      ["Data lake", "Central repository of historical data in low-cost storage, usually S3."],
      ["ElastiCache", "Managed cache service compatible with Valkey, Redis OSS, or Memcached."],
      ["Event bus", "Logical channel where events are published. Domain-specific buses are usually cleaner."],
      ["Event pattern", "Filtering rule that decides which events reach a target."],
      ["EventBridge", "Event bus with content-based routing, AWS/SaaS integrations, rules, pipes, and archive/replay."],
      ["Foundation model", "Large pretrained model, such as text, embedding, or multimodal models."],
      ["Full-text search", "Relevance-based text search, not only exact key equality."],
      ["Function URL", "Direct HTTPS endpoint for Lambda. In production, use secure auth, ideally AWS_IAM."],
      ["Grounding", "Anchoring model responses to concrete retrieved sources or data, reducing hallucinations."],
      ["Health check", "Health verification used by load balancers/orchestrators to know whether a target can serve traffic."],
      ["Hybrid search", "Combines traditional text search with vector search."],
      ["Idempotency", "Ability to repeat an operation without incorrectly changing the final result."],
      ["Least privilege", "Grant only the permissions required on specific resources."],
      ["Log retention", "How long logs are kept. If infinite, cost silently grows."],
      ["NAT Gateway", "Allows internet egress from private subnets. Can be a cost surprise by hour and GB."],
      ["OpenTelemetry", "Open standard for logs, metrics, and traces."],
      ["OpenSearch", "Search, aggregation, logs, and vector search engine. Good for text, facets, and hybrid search."],
      ["Permission policy", "Policy that defines what actions an identity can perform and on which resources."],
      ["Presigned URL", "Temporary URL to upload or download S3 objects without sending the file through your backend."],
      ["PrivateLink", "Technology to expose/access services privately across VPCs/accounts."],
      ["Prompt injection", "Attack where external content tries to manipulate model instructions."],
      ["RDS Proxy", "Managed connection pool for protecting RDS/Aurora databases, especially useful with Lambda."],
      ["Retry with backoff", "Retries with increasing wait time to avoid worsening a failure."],
      ["S3 Tables", "AWS service for managed Iceberg tables on S3, integrated with Glue/Athena."],
      ["S3 Vectors", "AWS service for cost-effective vector storage and querying, especially for moderate QPS."],
      ["Savings Plans", "Spend commitment for discounts, common in compute and databases depending on plan type."],
      ["Secrets Manager", "Service for storing, rotating, and auditing secrets such as passwords, tokens, or API keys."],
      ["Security group", "Stateful firewall at resource/ENI level."],
      ["Semantic cache", "Cache that reuses responses when a new question is semantically similar to a previous one."],
      ["Semantic search", "Search by meaning, not only exact words."],
      ["Service Connect", "ECS capability for service discovery and service-to-service communication."],
      ["Step Functions", "Workflow orchestration service for steps, retries, branching, and visible state."],
      ["Structured logging", "JSON logs with consistent fields such as requestId, userId, orderId, and errorType."],
      ["Trust policy", "Policy that defines who can assume a role."],
      ["Vector search", "Search for semantically similar items by comparing embeddings."],
      ["Vector store", "Specialized storage for embeddings and nearest-neighbor search."],
      ["VPC endpoint", "Private access to AWS services without going through the internet."],
      ["Wallet DoS", "Accidental or malicious consumption that does not take the system down by CPU, but by bill."],
      ["WebSocket", "Persistent bidirectional connection between client and server."],
      ["X-Ray", "AWS service for distributed traces."],
      ["ACM", "AWS Certificate Manager. Managed TLS certificates."],
      ["ACU", "Aurora Capacity Unit. Aurora Serverless capacity unit."],
      ["ADOT", "AWS Distro for OpenTelemetry. AWS distribution of OpenTelemetry for metrics/traces."],
      ["ALB", "Application Load Balancer. HTTP/HTTPS/gRPC load balancer with health checks and routing rules."],
      ["AppSync", "Managed GraphQL service on AWS with resolvers, auth, and subscriptions."],
      ["Athena", "Serverless service for querying S3 data with SQL. It mainly charges by data scanned."],
      ["Aurora", "Managed relational database compatible with PostgreSQL or MySQL."],
      ["Budget", "Budget with alerts for actual or forecast spend. It does not technically limit spend by itself."],
      ["BFF", "Backend for Frontend. Backend layer adapted to a specific client."],
      ["CDC", "Change Data Capture. Capture database changes to replicate them to search, analytics, or events."],
      ["CDK", "AWS Cloud Development Kit. Defines AWS infrastructure with languages like TypeScript or Python."],
      ["CMK", "Customer managed key. KMS key managed by the customer with custom policies."],
      ["CUR", "Cost and Usage Report. Detailed billing data for Athena or other query engines."],
      ["DLQ", "Dead-letter queue. Queue where messages land after failing too many attempts."],
      ["Drift", "Difference between what IaC declares and what actually exists in AWS."],
      ["DynamoDB", "Managed NoSQL key-value/document database with low latency and high scale."],
      ["ECR", "Elastic Container Registry. Private registry for Docker images."],
      ["ECS", "Elastic Container Service. Managed container orchestrator on AWS."],
      ["EMF", "Embedded Metric Format. Way to publish CloudWatch metrics from JSON logs."],
      ["Fargate", "Serverless mode for running containers without managing EC2 instances."],
      ["Firehose", "Managed data delivery service to S3, OpenSearch, Redshift, and other destinations."],
      ["Flink", "Stateful stream processing engine: windows, joins, aggregations, and complex events."],
      ["GSI", "Global Secondary Index. DynamoDB secondary index for additional access patterns."],
      ["GraphQL", "API model where the client asks for exactly the fields it needs."],
      ["gRPC", "Efficient RPC protocol based on HTTP/2 and protobuf."],
      ["IAM", "Identity and Access Management. AWS service for identities, roles, policies, and permissions."],
      ["IaC", "Infrastructure as Code. Define infrastructure in versioned files."],
      ["Iceberg", "Open analytical table format with snapshots, schema evolution, and partitioning."],
      ["KMS", "Key Management Service. Manages encryption keys."],
      ["Lakehouse", "Approach that combines data lake storage with table capabilities, transactions, and schema evolution."],
      ["Lambda", "Event-driven serverless compute. Ideal for short functions and variable traffic."],
      ["LLM", "Large Language Model. Language model used to generate, summarize, reason over, or extract text."],
      ["MSK", "Managed Streaming for Apache Kafka. Managed Kafka for Kafka workloads."],
      ["NoSQL", "Family of non-relational databases optimized for specific models."],
      ["OAC", "Origin Access Control. Recommended way to allow CloudFront to read a private S3 bucket."],
      ["OIDC", "OpenID Connect. Allows CI/CD to assume AWS roles with temporary tokens."],
      ["OLAP", "Analytical processing: reports, aggregations, historical data, and BI."],
      ["OLTP", "Transactional application processing."],
      ["Parquet", "Columnar format efficient for analytics."],
      ["Partition", "Unit of parallelism and ordering in Kafka/Kinesis."],
      ["RAG", "Retrieval-Augmented Generation. Retrieves external context and gives it to the LLM for better answers."],
      ["Redrive", "Reprocess messages from a DLQ back to the original queue or a controlled flow."],
      ["Redshift", "Managed data warehouse for high-performance BI and analytics."],
      ["Replay", "Read past events again from a position or retention window."],
      ["REST", "API style based on resources and HTTP verbs."],
      ["Rollback", "Revert to a previous version when deployment fails or metrics degrade."],
      ["S3", "Durable object storage. Good for files, data lakes, backups, and static assets."],
      ["SAM", "Serverless Application Model. A CloudFormation extension focused on serverless."],
      ["SCP", "Service Control Policy. AWS Organizations policy that limits maximum permissions."],
      ["SLO", "Service Level Objective. Measurable service level goal."],
      ["SLI", "Service Level Indicator. Metric that measures an SLO."],
      ["SNS", "Simple pub/sub for fan-out to SQS, Lambda, HTTP, email, or SMS."],
      ["SQL", "Relational model with tables, joins, constraints, and transactions."],
      ["SQS", "Managed queue for decoupling producers and consumers."],
      ["SSE", "Server-Sent Events. Simple server-to-client streaming channel over HTTP."],
      ["Stack", "Infrastructure deployment unit."],
      ["STS", "Security Token Service. Issues temporary credentials for roles and sessions."],
      ["TTL", "Time to Live. Automatic expiration of records or objects."],
      ["Topic", "Logical channel in Kafka/SNS where producers publish and consumers receive."],
      ["Trace", "Path of a request through services."],
      ["Valkey", "In-memory engine compatible with Redis OSS."],
      ["Vector", "List of numbers. In AI, used to compare similarity between content."],
      ["VPC", "Isolated virtual network in AWS."],
      ["WAF", "Web Application Firewall for protecting HTTP workloads against common patterns and rate limiting."]
    ]
  };

  const slugify = (term) =>
    term
      .toLowerCase()
      .replace(/`/g, "")
      .replace(/[:/]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const isEnglish = /\/en(\/|$)/.test(window.location.pathname);
  const lang = isEnglish ? "en" : "es";
  const terms = glossary[lang].map(([term, definition]) => ({
    term,
    definition,
    slug: slugify(term),
  })).sort((a, b) => b.term.length - a.term.length);

  const path = window.location.pathname;
  if (/\/glossary\/?$/.test(path) || /\/en\/glossary\/?$/.test(path) || /\/architecture-examples-aws\/?$/.test(path) || /\/architecture-examples-aws\/en\/?$/.test(path)) {
    return;
  }

  const root = document.querySelector(".md-content__inner");
  if (!root) return;

  const repoBase = path.startsWith("/architecture-examples-aws/") ? "/architecture-examples-aws" : "";
  const langBase = isEnglish ? `${repoBase}/en` : repoBase;
  const glossaryBase = `${langBase}/glossary/`;
  const seen = new Set();
  const termRegex = new RegExp(
    `(^|[^\\p{L}\\p{N}_])(${terms.map((item) => escapeRegExp(item.term)).join("|")})(?=$|[^\\p{L}\\p{N}_])`,
    "giu"
  );

  const skippedParents = new Set(["A", "CODE", "PRE", "SCRIPT", "STYLE", "TEXTAREA", "H1", "H2", "H3", "H4", "H5", "H6"]);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      let parent = node.parentElement;
      while (parent && parent !== root) {
        if (skippedParents.has(parent.tagName) || parent.classList.contains("mermaid") || parent.classList.contains("glossary-term")) {
          return NodeFilter.FILTER_REJECT;
        }
        parent = parent.parentElement;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  for (const node of textNodes) {
    const text = node.nodeValue;
    termRegex.lastIndex = 0;
    let match;
    let changed = false;
    let cursor = 0;
    const fragment = document.createDocumentFragment();

    while ((match = termRegex.exec(text)) !== null) {
      const prefix = match[1] || "";
      const matchedText = match[2];
      const canonical = terms.find((item) => item.term.toLowerCase() === matchedText.toLowerCase());
      if (!canonical || seen.has(canonical.term.toLowerCase())) continue;

      const start = match.index + prefix.length;
      const end = start + matchedText.length;
      fragment.append(document.createTextNode(text.slice(cursor, start)));

      const link = document.createElement("a");
      link.className = "glossary-term";
      link.href = `${glossaryBase}#${canonical.slug}`;
      link.textContent = matchedText;
      link.setAttribute("aria-label", `${matchedText}: ${canonical.definition}`);

      const tooltip = document.createElement("span");
      tooltip.className = "glossary-tooltip";
      tooltip.textContent = canonical.definition;
      link.appendChild(tooltip);

      fragment.append(link);
      seen.add(canonical.term.toLowerCase());
      cursor = end;
      changed = true;
    }

    if (changed) {
      fragment.append(document.createTextNode(text.slice(cursor)));
      node.parentNode.replaceChild(fragment, node);
    }
  }
})();

