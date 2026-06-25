# GraphQL BFF con AppSync

## Caso de uso

Una aplicacion web y mobile necesitan pantallas diferentes sobre los mismos datos: usuario, perfil, ordenes, recomendaciones, inventario y notificaciones.

```mermaid
flowchart LR
  Web[Web app] --> AppSync[AWS AppSync GraphQL API]
  Mobile[Mobile app] --> AppSync
  AppSync --> Auth[Cognito OIDC or IAM]
  AppSync --> Ddb[DynamoDB resolvers]
  AppSync --> Fn[Lambda resolvers]
  Fn --> Aurora[Aurora or external APIs]
  AppSync --> Events[EventBridge optional]
```

## Decision principal

Usa **AppSync GraphQL** cuando el cliente necesita elegir forma de datos, combinar varias fuentes y evolucionar pantallas sin crear muchos endpoints REST.

Prefiere **REST** cuando los recursos son simples, el contrato esta muy estable o quieres menor curva de aprendizaje. Prefiere un **BFF en ECS/Lambda** si necesitas logica de agregacion compleja, librerias especificas o control completo de runtime.

## Preguntas clave

- Los clientes web y mobile tienen necesidades de datos diferentes?
- Hay muchas pantallas que hacen over-fetching o under-fetching con REST?
- Quieres subscriptions en tiempo real?
- Puedes gobernar bien el schema GraphQL?
- Tus resolvers pueden ser simples o necesitas mucha logica?
- Como vas a resolver autorizacion campo por campo?

## Por que estos servicios

- **AppSync**: GraphQL administrado, auth integrada, resolvers y subscriptions.
- **DynamoDB**: baja latencia para entidades consultadas por clave.
- **Lambda resolvers**: adaptan logica compleja o integraciones externas.
- **Cognito/OIDC/IAM**: auth segun tipo de cliente.
- **EventBridge**: desacopla mutaciones de efectos secundarios.

## Pros

- Frontend obtiene exactamente lo que necesita.
- Menos endpoints especificos por pantalla.
- Subscriptions nativas para cambios.
- Buen patron BFF administrado.
- Puede integrar multiples fuentes.

## Contras

- Schema governance se vuelve critica.
- Riesgo de queries caras o N+1.
- Observabilidad debe incluir resolvers, no solo API.
- Autorizacion granular puede ser compleja.
- Caching requiere diseno cuidadoso.

## Alertas y costos

Minimo:

- AppSync 4xx/5xx, latency, resolver errors.
- Lambda resolver Errors y Duration p99.
- DynamoDB throttling y hot partitions.
- Budget por API y alertas de request spikes.

Cost drivers:

- Requests GraphQL y subscriptions.
- Resolvers Lambda.
- Lecturas DynamoDB generadas por queries anidadas.
- Logs detallados si se dejan siempre activos.

## Evolucion natural

- Si queries son caras: limitar profundidad, complexity score o persisted queries.
- Si una vista requiere busqueda/facetas: agregar OpenSearch.
- Si hay mutaciones con pasos: mover a Step Functions.
- Si el dominio crece: dividir schema por bounded contexts.
- Si solo quedan endpoints simples: considerar REST para reducir complejidad.

## Ejercicio de practica

Modela un schema GraphQL para `Customer`, `Order` y `Product`. Decide que resolver va directo a DynamoDB, cual usa Lambda y que campos requieren autorizacion.

