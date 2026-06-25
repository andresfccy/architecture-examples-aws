# Multi-Account Networking y VPC Endpoints

## Caso de uso

Organizacion separa dev, staging y prod. Workloads privados necesitan acceder a AWS services sin exponer trafico ni disparar costos innecesarios de NAT.

```mermaid
flowchart LR
  Org[AWS Organizations] --> Dev[Dev Account]
  Org --> Stg[Staging Account]
  Org --> Prod[Prod Account]
  Prod --> VPC[Production VPC private subnets]
  VPC --> EpS3[S3 Gateway Endpoint]
  VPC --> EpDdb[DynamoDB Gateway Endpoint]
  VPC --> EpIf[Interface Endpoints]
  VPC --> Nat[NAT Gateway optional]
```

## Decision principal

Usa **cuentas separadas + VPC privada + endpoints** para aislar ambientes y controlar acceso/costo.

Usa **NAT Gateway** cuando necesitas salida a internet o servicios sin endpoint. Usa **PrivateLink/interface endpoints** para servicios AWS o privados especificos. Usa **VPC peering/Transit Gateway** segun numero de VPCs y topologia.

## Preguntas clave

- Que ambientes deben estar aislados por cuenta?
- El workload necesita internet o solo AWS APIs?
- Que servicios AWS consume desde subnets privadas?
- El costo NAT por GB justifica endpoints?
- Hay conectividad cross-account o on-prem?
- Como auditas flow logs y cambios de red?

## Por que estos servicios

- **Organizations/accounts**: blast radius menor.
- **VPC private subnets**: aislamiento de red.
- **Gateway endpoints**: S3/DynamoDB sin costo por hora.
- **Interface endpoints**: acceso privado a servicios via ENI.
- **CloudTrail/VPC Flow Logs**: auditoria y diagnostico.

## Pros

- Aislamiento fuerte.
- Reduce exposicion publica.
- Puede reducir costos NAT.
- Mejor control por ambiente.
- Buen fundamento para compliance.

## Contras

- Mas complejidad de routing.
- Interface endpoints tienen costo por AZ/hora/GB.
- DNS privado puede confundir.
- Cross-account requiere gobierno.
- NAT sigue siendo necesario para internet general.

## Alertas y costos

Minimo:

- NAT Gateway bytes procesados.
- VPC endpoint errors si aplica.
- Flow Logs sampling para investigacion.
- Route table changes via CloudTrail.
- Budget por cuenta y por networking.

Guardrails:

- Endpoints gateway para S3 y DynamoDB en workloads privados.
- Endpoints para ECR, logs, Secrets Manager, SSM si ECS/Lambda en VPC los necesita.
- Security groups por flujo, no `0.0.0.0/0` innecesario.
- Separar prod en cuenta propia.

## Evolucion natural

- Si hay muchas VPCs: Transit Gateway.
- Si expones servicio interno a otras cuentas: PrivateLink.
- Si usuarios acceden globalmente: CloudFront en el borde.
- Si NAT domina costo: revisar endpoints y trafico externo.
- Si seguridad crece: Network Firewall, Config y SCPs.

## Ejemplos aplicados

### Ejemplo 1: Empresa regulada con workloads privados y menor NAT

**Contexto:** Una empresa de salud separa cuentas por ambiente y dominio. Sus cargas privadas llaman S3, DynamoDB, ECR, Secrets Manager y CloudWatch sin necesitar internet general.

**Preguntas y respuestas:**

- **Que se centraliza y que no?** Networking compartido, DNS y endpoints comunes pueden centralizarse; datos sensibles y roles de app quedan por cuenta de workload.
- **Que endpoints reducen NAT?** Gateway endpoints para S3/DynamoDB; interface endpoints para ECR, logs, Secrets Manager, SSM, KMS y STS.
- **Como se controla acceso entre cuentas?** Organizations, SCP, RAM, endpoint policies, security groups y PrivateLink para servicios internos.

**Diseno por etapa:**

- **Proyecto inicial:** Organizations con cuentas dev/staging/prod, VPC multi-AZ, public/private subnets, NAT solo donde se justifique y endpoints basicos.
- **Etapa media:** Cuenta de networking, Transit Gateway o peering segun topologia, Route 53 Resolver, centralizacion de logs y endpoints por servicio.
- **Gran escala:** Landing zone, OUs por dominio, PrivateLink para APIs internas, egress controlado, inspeccion central y costos NAT monitoreados por cuenta.

**Migracion/evolucion:** Si todo vive en una cuenta, separar primero prod, mover logs/security a cuentas centrales y luego extraer dominios con VPC endpoint strategy.

```mermaid
flowchart LR
  Org[AWS Organizations] --> Net[Networking account]
  Org --> Workload[Workload accounts]
  Net --> Tgw[Transit Gateway]
  Workload --> Vpc[Private VPCs]
  Vpc --> S3Ep[S3 gateway endpoint]
  Vpc --> DdbEp[DynamoDB gateway endpoint]
  Vpc --> Iface[Interface endpoints]
  Iface --> Services[ECR Logs Secrets KMS STS]
  Vpc --> Pl[PrivateLink services]
  Net --> Logs[Central logs]
```

**Patrones relacionados:** [security-iam-secrets-oidc](../security-iam-secrets-oidc/index.md), [container-web-app-fargate-alb](../container-web-app-fargate-alb/index.md), [cost-guardrails-budgets-anomaly](../cost-guardrails-budgets-anomaly/index.md).

## Ejercicio de practica

Disena una VPC privada para ECS que necesita ECR, S3, CloudWatch Logs y Secrets Manager. Decide NAT vs endpoints y calcula tradeoff.

