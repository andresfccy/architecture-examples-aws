# Multi-Account Networking and VPC Endpoints

## Use case

Organization separates dev, staging, and prod. Private workloads need to access AWS services without exposing traffic or triggering unnecessary NAT costs.

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

## Main decision

Use **separate accounts + private VPC + endpoints** to isolate environments and control access/cost.

Use **NAT Gateway** when you need internet egress or services without endpoints. Use **PrivateLink/interface endpoints** for specific AWS or private services. Use **VPC peering/Transit Gateway** depending on number of VPCs and topology.

## Key questions

- Which environments should be isolated by account?
- Does the workload need internet or only AWS APIs?
- Which AWS services does it consume from private subnets?
- Does NAT cost per GB justify endpoints?
- Is there cross-account or on-prem connectivity?
- How do you audit flow logs and network changes?

## Why these services

- **Organizations/accounts**: smaller blast radius.
- **VPC private subnets**: network isolation.
- **Gateway endpoints**: S3/DynamoDB without hourly cost.
- **Interface endpoints**: private access to services through ENIs.
- **CloudTrail/VPC Flow Logs**: audit and diagnosis.

## Pros

- Strong isolation.
- Reduces public exposure.
- Can reduce NAT costs.
- Better environment-level control.
- Good foundation for compliance.

## Cons

- More routing complexity.
- Interface endpoints cost by AZ/hour/GB.
- Private DNS can be confusing.
- Cross-account requires governance.
- NAT is still needed for general internet.

## Alerts and cost

Minimum:

- NAT Gateway bytes processed.
- VPC endpoint errors if applicable.
- Flow Logs sampling for investigation.
- Route table changes via CloudTrail.
- Budget by account and networking.

Guardrails:

- Gateway endpoints for S3 and DynamoDB in private workloads.
- Endpoints for ECR, logs, Secrets Manager, SSM if ECS/Lambda in VPC need them.
- Security groups by flow, not unnecessary `0.0.0.0/0`.
- Separate prod in its own account.

## Natural evolution

- If there are many VPCs: Transit Gateway.
- If exposing an internal service to other accounts: PrivateLink.
- If users access globally: CloudFront at the edge.
- If NAT dominates cost: review endpoints and external traffic.
- If security grows: Network Firewall, Config, and SCPs.

## Practice exercise

Design a private VPC for ECS that needs ECR, S3, CloudWatch Logs, and Secrets Manager. Decide NAT vs endpoints and calculate the tradeoff.

