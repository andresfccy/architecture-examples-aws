# Architecture Examples AWS

Biblioteca de estudio para practicar decisiones de arquitectura en AWS usando los lineamientos del proyecto `agent-toolkit-for-aws`: skills, IaC, seguridad, observabilidad, costos y operacion.

La idea no es memorizar servicios. La idea es aprender a preguntar:

- Que tipo de interaccion tengo: sincrona, asincrona, streaming, batch, tiempo real?
- Necesito SQL, NoSQL, busqueda, cache, vector search o data lake?
- Quien consume esto: usuario final, otro servicio, analistas, agentes IA?
- Que pasa cuando falla: retry, DLQ, compensacion, rollback, replay?
- Como lo mido: logs, metricas, trazas, auditoria, dashboards y alarmas?
- Como evito sorpresas de costo: budgets, anomaly detection, retencion, right-sizing, lifecycle, limites de consumo?
- Que camino de evolucion tendria si crece?

## Como estudiar esta carpeta

1. Abre un patron.
2. Lee el caso de uso y el diagrama.
3. Responde las preguntas clave antes de mirar la recomendacion.
4. Compara pros y contras.
5. Piensa que metrica te haria evolucionar a otra arquitectura.
6. Implementa un MVP con IaC, idealmente CDK o CloudFormation.
7. Agrega alarmas y presupuesto antes de declarar el ejercicio terminado.

## Catalogo de patrones

| Patron | Cuando estudiarlo | Servicios principales |
|---|---|---|
| [rest-api-serverless-crud](rest-api-serverless-crud/) | API CRUD sincrona para web/mobile | API Gateway, Lambda, DynamoDB, Cognito |
| [graphql-bff-appsync](graphql-bff-appsync/) | Frontends multiples con agregacion de datos | AppSync, DynamoDB, Lambda, Cognito |
| [grpc-internal-ecs-services](grpc-internal-ecs-services/) | Microservicios internos con contrato fuerte | ECS Fargate, ALB gRPC, Service Connect |
| [container-web-app-fargate-alb](container-web-app-fargate-alb/) | Web/API containerizada productiva | ECS Fargate, ALB, ECR, Secrets Manager |
| [async-worker-sqs-lambda](async-worker-sqs-lambda/) | Trabajo asincrono y desacople | SQS, Lambda, DLQ |
| [pubsub-notifications-sns-sqs](pubsub-notifications-sns-sqs/) | Fan-out simple de notificaciones | SNS, SQS, Lambda |
| [event-driven-domain-bus-eventbridge](event-driven-domain-bus-eventbridge/) | Eventos de dominio y routing por contenido | EventBridge, Pipes, SQS, Lambda |
| [workflow-orchestration-step-functions](workflow-orchestration-step-functions/) | Flujos multi-paso, sagas y retries | Step Functions, Lambda, SDK integrations |
| [streaming-kinesis-realtime-analytics](streaming-kinesis-realtime-analytics/) | Telemetria, clickstream, IoT | Kinesis, Firehose, Flink, S3 |
| [kafka-msk-event-streaming](kafka-msk-event-streaming/) | Ecosistema Kafka o replay avanzado | MSK, MSK Connect, Flink |
| [relational-sql-aurora-postgresql](relational-sql-aurora-postgresql/) | Transacciones, SQL, joins, reporting operacional | Aurora PostgreSQL, RDS Proxy |
| [nosql-dynamodb-single-table](nosql-dynamodb-single-table/) | Acceso por clave, escala masiva, baja latencia | DynamoDB, Streams, Lambda |
| [redis-cache-aside-elasticache](redis-cache-aside-elasticache/) | Cache, sesiones, rate limiting, leaderboard | ElastiCache Valkey/Redis |
| [search-opensearch-cdc](search-opensearch-cdc/) | Full-text search, filtros, facetas | OpenSearch, DynamoDB Streams, DMS |
| [file-processing-s3-stepfunctions](file-processing-s3-stepfunctions/) | Procesamiento de archivos y media | S3, EventBridge, SQS, Lambda, Step Functions |
| [data-lake-s3-tables-athena](data-lake-s3-tables-athena/) | Lakehouse e Iceberg administrado | S3 Tables, Glue, Athena |
| [batch-etl-glue-redshift](batch-etl-glue-redshift/) | ETL batch desde JDBC/SaaS/S3 | Glue, Step Functions, Redshift |
| [observability-cloudwatch-xray-adot](observability-cloudwatch-xray-adot/) | Operacion, alertas, trazas y auditoria | CloudWatch, X-Ray, ADOT, CloudTrail |
| [security-iam-secrets-oidc](security-iam-secrets-oidc/) | Identidad, secretos y despliegue seguro | IAM, OIDC, Secrets Manager, KMS |
| [cost-guardrails-budgets-anomaly](cost-guardrails-budgets-anomaly/) | Control de gasto y proteccion de wallet | Budgets, Cost Explorer, Anomaly Detection |
| [ai-rag-bedrock-vectors](ai-rag-bedrock-vectors/) | RAG, embeddings, agentes IA | Bedrock, S3 Vectors, OpenSearch, Lambda |
| [multi-account-networking-vpc-endpoints](multi-account-networking-vpc-endpoints/) | Aislamiento, red privada y costos NAT | Organizations, VPC, PrivateLink, Endpoints |
| [edge-static-site-cloudfront-s3](edge-static-site-cloudfront-s3/) | Frontend estatico global | CloudFront, S3, Route 53, ACM, WAF |
| [realtime-websocket-llm-streaming](realtime-websocket-llm-streaming/) | Chat, notificaciones live y streaming LLM | API Gateway WebSocket, Lambda, DynamoDB |

## Mapa rapido de decisiones

| Si necesitas... | Empieza con... | Evita empezar con... |
|---|---|---|
| API CRUD simple | HTTP API + Lambda + DynamoDB | Microservicios complejos |
| API publica con WAF, API keys o validacion avanzada | API Gateway REST API | Function URL publica sin control |
| Clientes web/mobile que piden datos distintos | AppSync GraphQL | Muchos endpoints REST pegados al frontend |
| Comunicacion interna de baja latencia y contratos fuertes | gRPC en ECS/Fargate | GraphQL interno para todo |
| Desacoplar una tarea que puede esperar | SQS + worker | Llamada sincrona encadenada |
| Un evento con muchos consumidores independientes | EventBridge o SNS | Un Lambda que llama manualmente a todos |
| Replay, orden por particion y alto volumen | Kinesis o MSK | SQS estandar |
| Workflow con pasos, compensacion y ramas | Step Functions | Lambda gigante con estado manual |
| Transacciones y consultas relacionales | Aurora/RDS | DynamoDB si no conoces patrones de acceso |
| Latencia muy baja para datos repetidos | ElastiCache | Escalar la base sin medir hit rate |
| Analitica historica | S3 Tables + Athena/Glue | Consultas pesadas sobre base OLTP |
| Busqueda textual/facetas | OpenSearch | DynamoDB scan o SQL LIKE a gran escala |
| Proteccion de presupuesto | Budgets + Anomaly Detection + quotas | Esperar a ver la factura |

## Glosario de conceptos

Esta seccion explica terminos que aparecen en los patrones. No busca ser documentacion completa de AWS, sino una guia rapida para entender por que un servicio o patron aparece en una arquitectura.

### Arquitectura y entrega

| Concepto | Significado practico |
|---|---|
| IaC | Infrastructure as Code. Definir infraestructura en archivos versionados, por ejemplo con CDK, CloudFormation, SAM o Terraform, en vez de crear recursos manualmente en consola. |
| CDK | AWS Cloud Development Kit. Permite definir infraestructura AWS usando lenguajes como TypeScript o Python. Genera CloudFormation. |
| CloudFormation | Servicio nativo de AWS para declarar y desplegar infraestructura con templates YAML/JSON. |
| SAM | Serverless Application Model. Extension de CloudFormation enfocada en Lambda, API Gateway, Step Functions y serverless. |
| Stack | Unidad de despliegue de infraestructura. En CDK/CloudFormation agrupa recursos relacionados. |
| Construct | Abstraccion de CDK para modelar recursos. L2/L3 constructs encapsulan buenas practicas. |
| `cdk synth` | Genera el template CloudFormation desde codigo CDK. |
| `cdk diff` | Muestra cambios antes de desplegar. Es clave para detectar reemplazos peligrosos. |
| Drift | Diferencia entre lo que declara IaC y lo que existe realmente en AWS, usualmente por cambios manuales. |
| Change set | Vista previa de cambios de CloudFormation antes de ejecutarlos. |
| Blue/green deployment | Despliegue con dos ambientes o versiones, moviendo trafico de la version vieja a la nueva. |
| Canary deployment | Despliegue gradual a un porcentaje pequeno de trafico antes de exponer a todos. |
| Rollback | Revertir a una version anterior cuando el despliegue falla o degrada metricas. |
| Blast radius | Alcance del dano si algo falla. Se reduce con cuentas separadas, permisos minimos y limites por ambiente. |
| Dev/staging/prod | Ambientes separados para desarrollo, pruebas previas y produccion. En AWS se recomienda separarlos incluso por cuenta. |
| Workload | Sistema, aplicacion o conjunto de servicios que resuelve una necesidad de negocio. |
| Well-Architected | Marco de AWS para evaluar arquitecturas en seguridad, confiabilidad, excelencia operacional, performance, costo y sostenibilidad. |

### APIs, frontend y computo

| Concepto | Significado practico |
|---|---|
| REST | Estilo de API basado en recursos y verbos HTTP. Bueno para contratos simples y ampliamente compatible. |
| GraphQL | Modelo de API donde el cliente pide exactamente los campos que necesita. Bueno para frontends con vistas variadas. |
| BFF | Backend for Frontend. Capa backend adaptada a necesidades de un cliente especifico, como web o mobile. |
| gRPC | Protocolo RPC eficiente basado en HTTP/2 y protobuf. Bueno para servicios internos con contratos fuertes. |
| WebSocket | Conexion persistente bidireccional entre cliente y servidor. Util para chat, dashboards live y notificaciones. |
| SSE | Server-Sent Events. Canal simple servidor-cliente para streaming unidireccional por HTTP. |
| API Gateway HTTP API | Opcion simple y costo-efectiva para APIs HTTP modernas. |
| API Gateway REST API | Opcion mas completa para APIs con API keys, usage plans, request validation, caching o WAF directo. |
| AppSync | Servicio administrado de GraphQL en AWS con resolvers, auth y subscriptions. |
| Lambda | Computo serverless por evento. Ideal para funciones cortas y trafico variable. Limite maximo de ejecucion: 15 minutos. |
| Function URL | Endpoint HTTPS directo para Lambda. Debe usarse con auth segura en produccion, idealmente `AWS_IAM`. |
| ECS | Elastic Container Service. Orquestador administrado de contenedores en AWS. |
| Fargate | Modo serverless para ejecutar contenedores sin administrar instancias EC2. |
| ECS Express Mode | Camino simplificado para desplegar apps HTTP en ECS con menos configuracion inicial. |
| ECR | Elastic Container Registry. Registro privado para imagenes Docker. |
| ALB | Application Load Balancer. Balanceador HTTP/HTTPS/gRPC con health checks y reglas de routing. |
| Service Connect | Capacidad de ECS para discovery y comunicacion servicio-a-servicio. |
| Cold start | Tiempo extra cuando Lambda inicializa un entorno nuevo. Importa en APIs sensibles a latencia. |
| Reserved concurrency | Limite o reserva gratuita de concurrencia Lambda. Protege downstreams y controla blast radius. |
| Provisioned concurrency | Capacidad Lambda pre-inicializada para reducir cold starts. Tiene costo adicional. |
| SnapStart | Optimizacion de arranque para algunos runtimes Lambda que restaura desde snapshot. |

### Mensajeria, eventos y streaming

| Concepto | Significado practico |
|---|---|
| Mensajeria | Comunicacion asincrona donde un mensaje se consume y luego desaparece. Ejemplo: SQS. |
| Streaming | Log durable de eventos con retencion y replay. Ejemplo: Kinesis o Kafka/MSK. |
| SQS | Cola administrada para desacoplar productores y consumidores. Ideal para workers asincronos. |
| SQS Standard | Cola de alto throughput con orden best-effort y entrega at-least-once. |
| SQS FIFO | Cola con orden por message group y deduplicacion, con restricciones de throughput. |
| Visibility timeout | Tiempo durante el cual un mensaje SQS queda oculto mientras un worker lo procesa. |
| DLQ | Dead-letter queue. Cola donde caen mensajes que fallaron despues de varios intentos. |
| Redrive | Reprocesar mensajes desde una DLQ hacia la cola original o un flujo controlado. |
| SNS | Pub/sub simple para fan-out a SQS, Lambda, HTTP, email o SMS. |
| EventBridge | Bus de eventos con routing por contenido, integraciones AWS/SaaS, rules, pipes y archive/replay. |
| Event bus | Canal logico donde se publican eventos. Conviene usar buses por dominio. |
| Event pattern | Regla de filtrado para decidir que eventos llegan a un target. |
| EventBridge Pipes | Conexion administrada source-target con filtrado/enriquecimiento sin Lambda pegamento. |
| Kinesis Data Streams | Servicio AWS-native para streams con particiones/shards, retencion y consumidores. |
| Firehose | Servicio de entrega administrada de datos hacia S3, OpenSearch, Redshift y otros destinos. |
| Flink | Motor de procesamiento stateful para streams: ventanas, joins, agregaciones y eventos complejos. |
| MSK | Managed Streaming for Apache Kafka. Kafka administrado para workloads que requieren API/ecosistema Kafka. |
| Topic | Canal logico en Kafka/SNS donde productores publican y consumidores reciben. |
| Partition/shard | Unidad de paralelismo y orden en Kafka/Kinesis. La clave de particion determina distribucion. |
| Consumer group | Grupo de consumidores Kafka que reparte particiones entre instancias. |
| Consumer lag | Distancia entre lo producido y lo consumido. Es una metrica critica en streaming. |
| Replay | Volver a leer eventos pasados desde una posicion o ventana de retencion. |
| At-least-once | Garantia donde un mensaje puede procesarse mas de una vez. Requiere idempotencia. |
| Idempotencia | Capacidad de repetir una operacion sin cambiar el resultado final de forma incorrecta. |

### Datos, almacenamiento, busqueda y cache

| Concepto | Significado practico |
|---|---|
| SQL | Modelo relacional con tablas, joins, constraints y transacciones. Ejemplo: Aurora PostgreSQL. |
| NoSQL | Familia de bases no relacionales optimizadas para modelos especificos: key-value, documento, grafos, etc. |
| OLTP | Procesamiento transaccional de la aplicacion: crear pedidos, cobrar pagos, actualizar perfiles. |
| OLAP | Procesamiento analitico: reportes, agregaciones, historicos y BI. |
| Aurora | Base relacional administrada compatible con PostgreSQL o MySQL, pensada para alta disponibilidad y performance. |
| Aurora Serverless v2 | Modo de Aurora que escala capacidad en ACUs segun demanda. |
| ACU | Aurora Capacity Unit. Unidad de capacidad de Aurora Serverless. |
| RDS Proxy | Pool de conexiones administrado para proteger bases RDS/Aurora, muy util con Lambda. |
| DynamoDB | Base NoSQL key-value/document administrada, baja latencia y escala alta. |
| Single-table design | Modelar multiples entidades en una tabla DynamoDB segun patrones de acceso. |
| PK/SK | Partition key y sort key. Claves principales comunes en DynamoDB para distribuir y ordenar datos. |
| GSI | Global Secondary Index. Indice secundario de DynamoDB para otros patrones de acceso. |
| Hot partition | Particion sobrecargada por una clave demasiado frecuente. Causa throttling. |
| TTL | Time to Live. Expiracion automatica de registros u objetos despues de cierto tiempo. |
| DynamoDB Streams | Flujo de cambios de una tabla DynamoDB. Se usa para CDC, proyecciones o eventos. |
| CDC | Change Data Capture. Capturar cambios de una base para replicarlos a busqueda, analytics o eventos. |
| S3 | Object storage durable. Bueno para archivos, data lake, backups y assets estaticos. |
| Presigned URL | URL temporal para subir o bajar objetos S3 sin pasar el archivo por tu backend. |
| S3 Tables | Servicio para tablas Iceberg administradas sobre S3, con integracion a Glue/Athena. |
| Iceberg | Formato abierto de tablas analiticas con snapshots, schema evolution y particiones. |
| Glue Data Catalog | Catalogo de metadatos para tablas consultables por Athena, Glue y otros motores. |
| Athena | Servicio serverless para consultar datos en S3 con SQL. Cobra principalmente por datos escaneados. |
| Glue ETL | Servicio administrado para jobs de transformacion, usualmente con Spark. |
| Redshift | Data warehouse administrado para BI y analitica de alto rendimiento. |
| Parquet | Formato columnar eficiente para analitica. Reduce costo de escaneo frente a CSV/JSON. |
| Data lake | Repositorio central de datos historicos en storage barato, normalmente S3. |
| Lakehouse | Enfoque que combina data lake con capacidades de tabla, transacciones y schema evolution. |
| OpenSearch | Motor de busqueda, agregaciones, logs y vector search. Bueno para texto, facetas y busqueda hibrida. |
| Full-text search | Busqueda por relevancia en texto, no solo igualdad por clave. |
| Facetas | Filtros agregados como categoria, precio, marca o estado en resultados de busqueda. |
| ElastiCache | Servicio administrado de cache compatible con Valkey, Redis OSS o Memcached. |
| Valkey | Motor in-memory compatible con Redis OSS, recomendado en varios escenarios nuevos de ElastiCache. |
| Cache-aside | Patron donde la app consulta cache primero; si falla, lee DB y pobla cache. |
| Cache hit rate | Porcentaje de lecturas resueltas por cache. Si es bajo, el cache no esta ayudando. |
| Cache stampede | Muchos requests recalculan el mismo dato cuando expira. Se mitiga con locks, jitter o stale-while-revalidate. |

### IA, RAG y vectores

| Concepto | Significado practico |
|---|---|
| Bedrock | Servicio AWS para usar foundation models y construir aplicaciones generativas sin administrar modelos base. |
| Foundation model | Modelo grande preentrenado, como modelos de texto, embeddings o multimodales. |
| LLM | Large Language Model. Modelo de lenguaje usado para generar, resumir, razonar o extraer texto. |
| Token | Unidad interna de texto que procesa un modelo. El costo y latencia suelen depender de tokens de entrada y salida. |
| Embedding | Vector numerico que representa significado semantico de texto, imagen u otro contenido. |
| Vector | Lista de numeros. En IA se usa para comparar similitud entre contenidos. |
| Vector store | Almacen especializado para guardar embeddings y buscar vecinos similares. Ejemplos: S3 Vectors, OpenSearch vector, Valkey vector. |
| S3 Vectors | Servicio de AWS para almacenar y consultar vectores de forma costo-efectiva, especialmente para QPS moderado. |
| Vector search | Buscar elementos semanticamente similares comparando embeddings. |
| Semantic search | Busqueda por significado, no solo por palabras exactas. |
| Hybrid search | Combina busqueda textual tradicional con vector search. |
| RAG | Retrieval-Augmented Generation. Patron donde se recupera contexto externo y se entrega al LLM para responder mejor. |
| Grounding | Anclar la respuesta del modelo a fuentes o datos concretos recuperados, reduciendo alucinaciones. |
| Chunking | Dividir documentos en fragmentos para indexarlos y recuperarlos mejor en RAG. |
| Reranking | Reordenar resultados recuperados para enviar al modelo el contexto mas relevante. |
| Prompt | Instruccion o contexto enviado al modelo. |
| Prompt injection | Ataque donde contenido externo intenta manipular instrucciones del modelo. |
| Semantic cache | Cache que reutiliza respuestas cuando una nueva pregunta es semanticamente parecida a una anterior. |
| Agent | Sistema que usa un modelo para razonar y llamar herramientas o APIs para completar tareas. |
| Tool use | Capacidad de un modelo/agente para invocar herramientas externas como APIs, busquedas o funciones. |

### Seguridad, identidad y red

| Concepto | Significado practico |
|---|---|
| IAM | Identity and Access Management. Servicio de identidades, roles, politicas y permisos de AWS. |
| Principal | Identidad que hace una accion: usuario, rol, servicio o cuenta. |
| IAM role | Identidad asumible con permisos. Preferida sobre credenciales largas. |
| Trust policy | Politica que define quien puede asumir un rol. |
| Permission policy | Politica que define que acciones puede hacer una identidad y sobre que recursos. |
| Least privilege | Dar solo permisos necesarios sobre recursos especificos. |
| `iam:PassRole` | Permiso para pasar un rol a un servicio. Si es amplio puede permitir escalacion de privilegios. |
| OIDC | OpenID Connect. Permite que CI/CD asuma roles AWS con tokens temporales, sin access keys estaticas. |
| STS | Security Token Service. Emite credenciales temporales para roles y sesiones. |
| Secrets Manager | Servicio para almacenar, rotar y auditar secretos como passwords, tokens o API keys. |
| SSM Parameter Store | Servicio para parametros de configuracion y secretos simples. |
| KMS | Key Management Service. Administra llaves de cifrado. |
| CMK | Customer managed key. Llave KMS administrada por el cliente con politicas propias. |
| CloudTrail | Registro de llamadas a APIs AWS. Responde quien hizo que, cuando y desde donde. |
| GuardDuty | Deteccion administrada de amenazas en AWS. |
| Security Hub | Agrega hallazgos de seguridad y controles. |
| WAF | Web Application Firewall para proteger HTTP contra patrones comunes y rate limiting. |
| VPC | Red virtual aislada en AWS. |
| Subnet publica | Subnet con ruta a internet gateway. |
| Subnet privada | Subnet sin exposicion directa a internet. Puede salir via NAT o endpoints. |
| NAT Gateway | Permite salida a internet desde subnets privadas. Puede ser un costo sorpresa por hora y GB. |
| VPC endpoint | Acceso privado a servicios AWS sin salir por internet. S3/DynamoDB usan gateway endpoints; otros usan interface endpoints. |
| PrivateLink | Tecnologia para exponer/acceder servicios de forma privada entre VPCs/cuentas. |
| Security group | Firewall stateful a nivel de recurso/ENI. |
| NACL | Firewall stateless a nivel de subnet. |
| Route 53 | DNS administrado de AWS. |
| ACM | AWS Certificate Manager. Certificados TLS administrados. |
| CloudFront | CDN global para cache, TLS, edge routing y proteccion con WAF. |
| OAC | Origin Access Control. Forma recomendada de permitir que CloudFront lea un bucket S3 privado. |
| SCP | Service Control Policy. Politica de AWS Organizations que limita permisos maximos por cuenta/OUs. |

### Observabilidad, resiliencia y operacion

| Concepto | Significado practico |
|---|---|
| Observabilidad | Capacidad de entender el estado interno del sistema a partir de logs, metricas y trazas. |
| Log | Registro de eventos textuales o JSON generados por la app o infraestructura. |
| Structured logging | Logs en JSON con campos consistentes como requestId, userId, orderId y errorType. |
| Metric | Medida numerica en el tiempo: errores, latencia, CPU, cola, costo. |
| Custom metric | Metrica definida por la aplicacion, como pedidos fallidos o cache hit rate. |
| EMF | Embedded Metric Format. Forma de publicar metricas CloudWatch desde logs JSON. |
| Trace | Recorrido de una peticion a traves de servicios. Ayuda a encontrar cuellos de botella. |
| X-Ray | Servicio AWS para trazas distribuidas. |
| ADOT | AWS Distro for OpenTelemetry. Distribucion AWS de OpenTelemetry para metricas/trazas. |
| OpenTelemetry | Estandar abierto de telemetria para logs, metricas y trazas. |
| Dashboard | Vista operacional con metricas relevantes de un servicio o sistema. |
| Alarm | Regla que cambia de estado cuando una metrica cruza un umbral. |
| Composite alarm | Alarma que combina otras alarmas para reducir ruido. |
| M-of-N | Configuracion donde M de N datapoints deben incumplir para disparar una alarma. |
| `treatMissingData` | Configuracion de CloudWatch para decidir si datos faltantes cuentan como OK, ALARM, missing o ignore. |
| p90/p99 | Percentiles de latencia. p99 muestra la experiencia de los requests mas lentos; mejor que Average para alarmas. |
| SLO | Service Level Objective. Objetivo medible, por ejemplo 99.9% de requests exitosos bajo 300 ms. |
| SLI | Service Level Indicator. Metrica que mide un SLO, como error rate o latency p99. |
| Runbook | Guia operativa para responder a una alarma o incidente. |
| Circuit breaker | Patron que corta llamadas a un downstream fallando para evitar cascadas. |
| Backpressure | Mecanismo para reducir o frenar produccion cuando consumidores no alcanzan. |
| Throttling | Rechazo o limitacion de requests por superar capacidad o cuota. |
| Retry with backoff | Reintentos con espera creciente para evitar empeorar una falla. |
| Timeout | Limite de espera antes de cancelar una operacion. Debe ser explicito. |
| Health check | Verificacion de salud usada por balanceadores/orquestadores para saber si un target sirve trafico. |

### Costos y gobierno financiero

| Concepto | Significado practico |
|---|---|
| Budget | Presupuesto con alertas por gasto real o forecast. No limita tecnicamente por si solo. |
| Cost Explorer | Herramienta para analizar costos por servicio, cuenta, tag y periodo. |
| Cost Anomaly Detection | Deteccion de gastos inusuales o spikes. |
| CUR | Cost and Usage Report. Datos detallados de facturacion para consultar con Athena u otros motores. |
| Billing view | Vista que acota datos de facturacion a un subconjunto, util para equipos o unidades. |
| Compute Optimizer | Servicio que recomienda right-sizing para EC2, Lambda, EBS, RDS y otros. |
| Cost Optimization Hub | Agrega oportunidades de ahorro entre servicios. |
| Savings Plans | Compromiso de gasto para descuentos, comun en compute y bases segun modalidad. |
| Reserved Instances | Reserva de capacidad/uso para descuento en servicios compatibles. |
| Right-sizing | Ajustar CPU, memoria, capacidad o clase de recurso a uso real. |
| On-demand | Pago por uso sin compromiso. Bueno al inicio o con trafico incierto. |
| Provisioned | Capacidad configurada. Puede ser mas barato con trafico estable, pero requiere tuning. |
| Lifecycle policy | Regla para mover o borrar datos segun edad, por ejemplo en S3 o ECR. |
| Log retention | Tiempo que se guardan logs. Si queda infinito, el costo crece silenciosamente. |
| Wallet DoS | Consumo accidental o malicioso que no tumba el sistema por CPU, sino por factura. Se mitiga con budgets, quotas, throttling y WAF. |

## Guardrails comunes

- Define infraestructura con CDK, CloudFormation o SAM.
- Corre `synth`, `diff` y validaciones antes de desplegar.
- Usa cuentas separadas para dev, staging y prod.
- Usa OIDC para CI/CD, no access keys largas.
- Usa roles por workload, con permisos a ARNs concretos.
- Guarda secretos en Secrets Manager o SSM Parameter Store, no en env vars planas.
- Habilita CloudTrail para auditoria.
- Pon retencion explicita en CloudWatch Logs.
- Usa alarmas M-of-N y `p99` para latencia.
- Configura DLQ/on-failure para invocaciones asincronas.
- Usa VPC endpoints para S3/DynamoDB y otros servicios cuando el trafico lo justifique.
- Activa Budgets, Cost Anomaly Detection y tags de costo desde el primer dia.
- Revisa Compute Optimizer y Cost Optimization Hub cuando ya haya trafico real.

## Skills del proyecto usados como base

- `aws-serverless`
- `aws-containers`
- `aws-messaging-and-streaming`
- `aws-observability`
- `aws-billing-and-cost-management`
- `aws-iam`
- `aws-cdk`
- `aws-cloudformation`
- `creating-data-lake-table`
- `ingesting-into-data-lake`
- `querying-data-lake`
- `securing-s3-buckets`
- `storing-and-querying-vectors`
- `amazon-aurora-postgresql`
- `amazon-elasticache`
- `setting-up-cloudwatch-alarm-notifications`
