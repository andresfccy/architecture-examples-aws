# Glosario

Este glosario funciona como referencia cruzada del sitio. En las paginas de patrones, la primera aparicion de muchos terminos se convierte automaticamente en enlace con tooltip.

## Arquitectura y entrega

### IaC
Infrastructure as Code. Definir infraestructura en archivos versionados, por ejemplo con CDK, CloudFormation, SAM o Terraform, en vez de crear recursos manualmente en consola.

### CDK
AWS Cloud Development Kit. Permite definir infraestructura AWS usando lenguajes como TypeScript o Python. Genera CloudFormation.

### CloudFormation
Servicio nativo de AWS para declarar y desplegar infraestructura con templates YAML/JSON.

### SAM
Serverless Application Model. Extension de CloudFormation enfocada en Lambda, API Gateway, Step Functions y serverless.

### Stack
Unidad de despliegue de infraestructura. En CDK/CloudFormation agrupa recursos relacionados.

### Construct
Abstraccion de CDK para modelar recursos. L2/L3 constructs encapsulan buenas practicas.

### `cdk synth`
Genera el template CloudFormation desde codigo CDK.

### `cdk diff`
Muestra cambios antes de desplegar. Es clave para detectar reemplazos peligrosos.

### Drift
Diferencia entre lo que declara IaC y lo que existe realmente en AWS, usualmente por cambios manuales.

### Change set
Vista previa de cambios de CloudFormation antes de ejecutarlos.

### Blue/green deployment
Despliegue con dos ambientes o versiones, moviendo trafico de la version vieja a la nueva.

### Canary deployment
Despliegue gradual a un porcentaje pequeno de trafico antes de exponer a todos.

### Rollback
Revertir a una version anterior cuando el despliegue falla o degrada metricas.

### Blast radius
Alcance del dano si algo falla. Se reduce con cuentas separadas, permisos minimos y limites por ambiente.

### Workload
Sistema, aplicacion o conjunto de servicios que resuelve una necesidad de negocio.

### Well-Architected
Marco de AWS para evaluar arquitecturas en seguridad, confiabilidad, excelencia operacional, eficiencia de rendimiento, optimizacion de costos y sostenibilidad.

## APIs, frontend y computo

### REST
Estilo de API basado en recursos y verbos HTTP. Bueno para contratos simples y ampliamente compatible.

### GraphQL
Modelo de API donde el cliente pide exactamente los campos que necesita. Bueno para frontends con vistas variadas.

### BFF
Backend for Frontend. Capa backend adaptada a necesidades de un cliente especifico, como web o mobile.

### gRPC
Protocolo RPC eficiente basado en HTTP/2 y protobuf. Bueno para servicios internos con contratos fuertes.

### WebSocket
Conexion persistente bidireccional entre cliente y servidor. Util para chat, dashboards live y notificaciones.

### SSE
Server-Sent Events. Canal simple servidor-cliente para streaming unidireccional por HTTP.

### API Gateway HTTP API
Opcion simple y costo-efectiva para APIs HTTP modernas.

### API Gateway REST API
Opcion mas completa para APIs con API keys, usage plans, request validation, caching o WAF directo.

### AppSync
Servicio administrado de GraphQL en AWS con resolvers, auth y subscriptions.

### Lambda
Computo serverless por evento. Ideal para funciones cortas y trafico variable. Limite maximo de ejecucion: 15 minutos.

### Function URL
Endpoint HTTPS directo para Lambda. Debe usarse con auth segura en produccion, idealmente `AWS_IAM`.

### ECS
Elastic Container Service. Orquestador administrado de contenedores en AWS.

### Fargate
Modo serverless para ejecutar contenedores sin administrar instancias EC2.

### ECS Express Mode
Camino simplificado para desplegar apps HTTP en ECS con menos configuracion inicial.

### ECR
Elastic Container Registry. Registro privado para imagenes Docker.

### ALB
Application Load Balancer. Balanceador HTTP/HTTPS/gRPC con health checks y reglas de routing.

### Service Connect
Capacidad de ECS para discovery y comunicacion servicio-a-servicio.

### Cold start
Tiempo extra cuando Lambda inicializa un entorno nuevo. Importa en APIs sensibles a latencia.

### Reserved concurrency
Limite o reserva gratuita de concurrencia Lambda. Protege downstreams y controla blast radius.

### Provisioned concurrency
Capacidad Lambda pre-inicializada para reducir cold starts. Tiene costo adicional.

### SnapStart
Optimizacion de arranque para algunos runtimes Lambda que restaura desde snapshot.

## Mensajeria, eventos y streaming

### Mensajeria
Comunicacion asincrona donde un mensaje se consume y luego desaparece. Ejemplo: SQS.

### Streaming
Log durable de eventos con retencion y replay. Ejemplo: Kinesis o Kafka/MSK.

### SQS
Cola administrada para desacoplar productores y consumidores. Ideal para workers asincronos.

### SQS Standard
Cola de alto throughput con orden best-effort y entrega at-least-once.

### SQS FIFO
Cola con orden por message group y deduplicacion, con restricciones de throughput.

### Visibility timeout
Tiempo durante el cual un mensaje SQS queda oculto mientras un worker lo procesa.

### DLQ
Dead-letter queue. Cola donde caen mensajes que fallaron despues de varios intentos.

### Redrive
Reprocesar mensajes desde una DLQ hacia la cola original o un flujo controlado.

### SNS
Pub/sub simple para fan-out a SQS, Lambda, HTTP, email o SMS.

### Step Functions
Servicio de orquestacion para workflows con pasos, retries, branching y estado visible.

### EventBridge
Bus de eventos con routing por contenido, integraciones AWS/SaaS, rules, pipes y archive/replay.

### Event bus
Canal logico donde se publican eventos. Conviene usar buses por dominio.

### Event pattern
Regla de filtrado para decidir que eventos llegan a un target.

### EventBridge Pipes
Conexion administrada source-target con filtrado/enriquecimiento sin Lambda pegamento.

### Kinesis Data Streams
Servicio AWS-native para streams con particiones/shards, retencion y consumidores.

### Firehose
Servicio de entrega administrada de datos hacia S3, OpenSearch, Redshift y otros destinos.

### Flink
Motor de procesamiento stateful para streams: ventanas, joins, agregaciones y eventos complejos.

### MSK
Managed Streaming for Apache Kafka. Kafka administrado para workloads que requieren API/ecosistema Kafka.

### Topic
Canal logico en Kafka/SNS donde productores publican y consumidores reciben.

### Partition
Unidad de paralelismo y orden en Kafka/Kinesis. La clave de particion determina distribucion.

### Shard
Unidad de capacidad/paralelismo en Kinesis.

### Consumer group
Grupo de consumidores Kafka que reparte particiones entre instancias.

### Consumer lag
Distancia entre lo producido y lo consumido. Es una metrica critica en streaming.

### Replay
Volver a leer eventos pasados desde una posicion o ventana de retencion.

### At-least-once
Garantia donde un mensaje puede procesarse mas de una vez. Requiere idempotencia.

### Idempotencia
Capacidad de repetir una operacion sin cambiar el resultado final de forma incorrecta.

## Datos, almacenamiento, busqueda y cache

### SQL
Modelo relacional con tablas, joins, constraints y transacciones. Ejemplo: Aurora PostgreSQL.

### NoSQL
Familia de bases no relacionales optimizadas para modelos especificos: key-value, documento, grafos, etc.

### OLTP
Procesamiento transaccional de la aplicacion: crear pedidos, cobrar pagos, actualizar perfiles.

### OLAP
Procesamiento analitico: reportes, agregaciones, historicos y BI.

### Aurora
Base relacional administrada compatible con PostgreSQL o MySQL, pensada para alta disponibilidad y performance.

### Aurora Serverless v2
Modo de Aurora que escala capacidad en ACUs segun demanda.

### ACU
Aurora Capacity Unit. Unidad de capacidad de Aurora Serverless.

### RDS Proxy
Pool de conexiones administrado para proteger bases RDS/Aurora, muy util con Lambda.

### DynamoDB
Base NoSQL key-value/document administrada, baja latencia y escala alta.

### Single-table design
Modelar multiples entidades en una tabla DynamoDB segun patrones de acceso.

### PK/SK
Partition key y sort key. Claves principales comunes en DynamoDB para distribuir y ordenar datos.

### GSI
Global Secondary Index. Indice secundario de DynamoDB para otros patrones de acceso.

### Hot partition
Particion sobrecargada por una clave demasiado frecuente. Causa throttling.

### TTL
Time to Live. Expiracion automatica de registros u objetos despues de cierto tiempo.

### DynamoDB Streams
Flujo de cambios de una tabla DynamoDB. Se usa para CDC, proyecciones o eventos.

### CDC
Change Data Capture. Capturar cambios de una base para replicarlos a busqueda, analytics o eventos.

### S3
Object storage durable. Bueno para archivos, data lake, backups y assets estaticos.

### Presigned URL
URL temporal para subir o bajar objetos S3 sin pasar el archivo por tu backend.

### S3 Tables
Servicio para tablas Iceberg administradas sobre S3, con integracion a Glue/Athena.

### Iceberg
Formato abierto de tablas analiticas con snapshots, schema evolution y particiones.

### Glue Data Catalog
Catalogo de metadatos para tablas consultables por Athena, Glue y otros motores.

### Athena
Servicio serverless para consultar datos en S3 con SQL. Cobra principalmente por datos escaneados.

### Glue ETL
Servicio administrado para jobs de transformacion, usualmente con Spark.

### Redshift
Data warehouse administrado para BI y analitica de alto rendimiento.

### Parquet
Formato columnar eficiente para analitica. Reduce costo de escaneo frente a CSV/JSON.

### Data lake
Repositorio central de datos historicos en storage barato, normalmente S3.

### Lakehouse
Enfoque que combina data lake con capacidades de tabla, transacciones y schema evolution.

### OpenSearch
Motor de busqueda, agregaciones, logs y vector search. Bueno para texto, facetas y busqueda hibrida.

### Full-text search
Busqueda por relevancia en texto, no solo igualdad por clave.

### Facetas
Filtros agregados como categoria, precio, marca o estado en resultados de busqueda.

### ElastiCache
Servicio administrado de cache compatible con Valkey, Redis OSS o Memcached.

### Valkey
Motor in-memory compatible con Redis OSS, recomendado en varios escenarios nuevos de ElastiCache.

### Cache-aside
Patron donde la app consulta cache primero; si falla, lee DB y pobla cache.

### Cache hit rate
Porcentaje de lecturas resueltas por cache. Si es bajo, el cache no esta ayudando.

### Cache stampede
Muchos requests recalculan el mismo dato cuando expira. Se mitiga con locks, jitter o stale-while-revalidate.

## IA, RAG y vectores

### Bedrock
Servicio AWS para usar foundation models y construir aplicaciones generativas sin administrar modelos base.

### Foundation model
Modelo grande preentrenado, como modelos de texto, embeddings o multimodales.

### LLM
Large Language Model. Modelo de lenguaje usado para generar, resumir, razonar o extraer texto.

### Token
Unidad interna de texto que procesa un modelo. El costo y latencia suelen depender de tokens de entrada y salida.

### Embedding
Vector numerico que representa significado semantico de texto, imagen u otro contenido.

### Vector
Lista de numeros. En IA se usa para comparar similitud entre contenidos.

### Vector store
Almacen especializado para guardar embeddings y buscar vecinos similares. Ejemplos: S3 Vectors, OpenSearch vector, Valkey vector.

### S3 Vectors
Servicio de AWS para almacenar y consultar vectores de forma costo-efectiva, especialmente para QPS moderado.

### Vector search
Buscar elementos semanticamente similares comparando embeddings.

### Semantic search
Busqueda por significado, no solo por palabras exactas.

### Hybrid search
Combina busqueda textual tradicional con vector search.

### RAG
Retrieval-Augmented Generation. Patron donde se recupera contexto externo y se entrega al LLM para responder mejor.

### Grounding
Anclar la respuesta del modelo a fuentes o datos concretos recuperados, reduciendo alucinaciones.

### Chunking
Dividir documentos en fragmentos para indexarlos y recuperarlos mejor en RAG.

### Reranking
Reordenar resultados recuperados para enviar al modelo el contexto mas relevante.

### Prompt
Instruccion o contexto enviado al modelo.

### Prompt injection
Ataque donde contenido externo intenta manipular instrucciones del modelo.

### Semantic cache
Cache que reutiliza respuestas cuando una nueva pregunta es semanticamente parecida a una anterior.

### Agent
Sistema que usa un modelo para razonar y llamar herramientas o APIs para completar tareas.

### Tool use
Capacidad de un modelo/agente para invocar herramientas externas como APIs, busquedas o funciones.

## Seguridad, identidad y red

### IAM
Identity and Access Management. Servicio de identidades, roles, politicas y permisos de AWS.

### Principal
Identidad que hace una accion: usuario, rol, servicio o cuenta.

### IAM role
Identidad asumible con permisos. Preferida sobre credenciales largas.

### Trust policy
Politica que define quien puede asumir un rol.

### Permission policy
Politica que define que acciones puede hacer una identidad y sobre que recursos.

### Least privilege
Dar solo permisos necesarios sobre recursos especificos.

### `iam:PassRole`
Permiso para pasar un rol a un servicio. Si es amplio puede permitir escalacion de privilegios.

### OIDC
OpenID Connect. Permite que CI/CD asuma roles AWS con tokens temporales, sin access keys estaticas.

### STS
Security Token Service. Emite credenciales temporales para roles y sesiones.

### Secrets Manager
Servicio para almacenar, rotar y auditar secretos como passwords, tokens o API keys.

### SSM Parameter Store
Servicio para parametros de configuracion y secretos simples.

### KMS
Key Management Service. Administra llaves de cifrado.

### CMK
Customer managed key. Llave KMS administrada por el cliente con politicas propias.

### CloudTrail
Registro de llamadas a APIs AWS. Responde quien hizo que, cuando y desde donde.

### GuardDuty
Deteccion administrada de amenazas en AWS.

### Security Hub
Agrega hallazgos de seguridad y controles.

### WAF
Web Application Firewall para proteger HTTP contra patrones comunes y rate limiting.

### VPC
Red virtual aislada en AWS.

### Subnet publica
Subnet con ruta a internet gateway.

### Subnet privada
Subnet sin exposicion directa a internet. Puede salir via NAT o endpoints.

### NAT Gateway
Permite salida a internet desde subnets privadas. Puede ser un costo sorpresa por hora y GB.

### VPC endpoint
Acceso privado a servicios AWS sin salir por internet. S3/DynamoDB usan gateway endpoints; otros usan interface endpoints.

### PrivateLink
Tecnologia para exponer/acceder servicios de forma privada entre VPCs/cuentas.

### Security group
Firewall stateful a nivel de recurso/ENI.

### NACL
Firewall stateless a nivel de subnet.

### Route 53
DNS administrado de AWS.

### ACM
AWS Certificate Manager. Certificados TLS administrados.

### CloudFront
CDN global para cache, TLS, edge routing y proteccion con WAF.

### OAC
Origin Access Control. Forma recomendada de permitir que CloudFront lea un bucket S3 privado.

### SCP
Service Control Policy. Politica de AWS Organizations que limita permisos maximos por cuenta/OUs.

## Observabilidad, resiliencia y operacion

### Observabilidad
Capacidad de entender el estado interno del sistema a partir de logs, metricas y trazas.

### Log
Registro de eventos textuales o JSON generados por la app o infraestructura.

### Structured logging
Logs en JSON con campos consistentes como requestId, userId, orderId y errorType.

### Metric
Medida numerica en el tiempo: errores, latencia, CPU, cola, costo.

### Custom metric
Metrica definida por la aplicacion, como pedidos fallidos o cache hit rate.

### EMF
Embedded Metric Format. Forma de publicar metricas CloudWatch desde logs JSON.

### Trace
Recorrido de una peticion a traves de servicios. Ayuda a encontrar cuellos de botella.

### X-Ray
Servicio AWS para trazas distribuidas.

### ADOT
AWS Distro for OpenTelemetry. Distribucion AWS de OpenTelemetry para metricas/trazas.

### OpenTelemetry
Estandar abierto de telemetria para logs, metricas y trazas.

### Dashboard
Vista operacional con metricas relevantes de un servicio o sistema.

### Alarm
Regla que cambia de estado cuando una metrica cruza un umbral.

### Composite alarm
Alarma que combina otras alarmas para reducir ruido.

### M-of-N
Configuracion donde M de N datapoints deben incumplir para disparar una alarma.

### `treatMissingData`
Configuracion de CloudWatch para decidir si datos faltantes cuentan como OK, ALARM, missing o ignore.

### p90/p99
Percentiles de latencia. p99 muestra la experiencia de los requests mas lentos; mejor que Average para alarmas.

### SLO
Service Level Objective. Objetivo medible, por ejemplo 99.9% de requests exitosos bajo 300 ms.

### SLI
Service Level Indicator. Metrica que mide un SLO, como error rate o latency p99.

### Runbook
Guia operativa para responder a una alarma o incidente.

### Circuit breaker
Patron que corta llamadas a un downstream fallando para evitar cascadas.

### Backpressure
Mecanismo para reducir o frenar produccion cuando consumidores no alcanzan.

### Throttling
Rechazo o limitacion de requests por superar capacidad o cuota.

### Retry with backoff
Reintentos con espera creciente para evitar empeorar una falla.

### Timeout
Limite de espera antes de cancelar una operacion. Debe ser explicito.

### Health check
Verificacion de salud usada por balanceadores/orquestadores para saber si un target sirve trafico.

## Costos y gobierno financiero

### Budget
Presupuesto con alertas por gasto real o forecast. No limita tecnicamente por si solo.

### Cost Explorer
Herramienta para analizar costos por servicio, cuenta, tag y periodo.

### Cost Anomaly Detection
Deteccion de gastos inusuales o spikes.

### CUR
Cost and Usage Report. Datos detallados de facturacion para consultar con Athena u otros motores.

### Billing view
Vista que acota datos de facturacion a un subconjunto, util para equipos o unidades.

### Compute Optimizer
Servicio que recomienda right-sizing para EC2, Lambda, EBS, RDS y otros.

### Cost Optimization Hub
Agrega oportunidades de ahorro entre servicios.

### Savings Plans
Compromiso de gasto para descuentos, comun en compute y bases segun modalidad.

### Reserved Instances
Reserva de capacidad/uso para descuento en servicios compatibles.

### Right-sizing
Ajustar CPU, memoria, capacidad o clase de recurso a uso real.

### On-demand
Pago por uso sin compromiso. Bueno al inicio o con trafico incierto.

### Provisioned
Capacidad configurada. Puede ser mas barato con trafico estable, pero requiere tuning.

### Lifecycle policy
Regla para mover o borrar datos segun edad, por ejemplo en S3 o ECR.

### Log retention
Tiempo que se guardan logs. Si queda infinito, el costo crece silenciosamente.

### Wallet DoS
Consumo accidental o malicioso que no tumba el sistema por CPU, sino por factura. Se mitiga con budgets, quotas, throttling y WAF.
