# Realtime WebSocket y LLM Streaming

## Caso de uso

Chat, notificaciones live, dashboards en vivo o respuestas LLM token-by-token.

```mermaid
flowchart LR
  Client[Browser or mobile] --> WS[API Gateway WebSocket]
  WS --> Conn[Lambda connection handler]
  Conn --> Ddb[DynamoDB connections TTL]
  Sender[Events or worker] --> Push[Lambda push message]
  Push --> WS
  Client --> Stream[Lambda Function URL streaming optional]
  Stream --> Bedrock[Bedrock ConverseStream]
```

## Decision principal

Usa **API Gateway WebSocket + Lambda + DynamoDB TTL** para comunicacion bidireccional y notificaciones. Usa **Lambda Function URL streaming + Bedrock ConverseStream** para streaming de tokens LLM.

Usa **AppSync subscriptions** si tu cliente ya usa GraphQL. Usa **SSE** si solo necesitas server-to-client simple. Usa **ECS WebSocket** si necesitas conexiones con logica persistente compleja.

## Preguntas clave

- Necesitas bidireccional o solo push?
- Cuanto dura una conexion?
- Como autenticas en `$connect`?
- Como limpias conexiones stale?
- Que pasa si el cliente se desconecta?
- Necesitas streaming de tokens o mensajes discretos?

## Por que estos servicios

- **API Gateway WebSocket**: conexiones administradas.
- **Lambda**: handlers por connect/disconnect/message.
- **DynamoDB TTL**: estado de connectionId.
- **Function URL streaming**: respuestas token streaming.
- **Bedrock ConverseStream**: generacion incremental.

## Pros

- Sin administrar servidores WebSocket.
- Escala por eventos.
- DynamoDB maneja estado de conexiones.
- Buen fit para chats y notificaciones.
- LLM streaming mejora UX.

## Contras

- Limites de timeout y tamano de mensaje.
- Estado de conexion debe mantenerse limpio.
- Auth en WebSocket requiere diseno.
- Lambda no es ideal para logica persistente larga.
- Streaming puede aumentar costo si no hay limites.

## Alertas y costos

Minimo:

- Connect/disconnect/message errors.
- Lambda Errors/Duration/Throttles.
- DynamoDB throttling y TTL cleanup.
- Bedrock token usage y throttling.
- Budget por mensajes WebSocket, Lambda y tokens.

Guardrails:

- TTL para connection records.
- Rate limit por usuario.
- Auth en `$connect`.
- No poner Function URL publica con auth `NONE` en produccion.
- Correlation ID por conversacion.

## Evolucion natural

- Si solo hay notificaciones GraphQL: AppSync subscriptions.
- Si conexiones requieren estado en memoria: ECS.
- Si LLM costo sube: semantic cache y limites de tokens.
- Si hay multi-region: pensar en estado global y routing.
- Si hay backpressure: SQS entre eventos y push.

## Ejercicio de practica

Disena chat de soporte con WebSocket y RAG streaming. Define auth, tabla de conexiones, limites por usuario, alarms y presupuesto de tokens.

