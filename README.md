# AWS ECS Demo

A simple full-stack application demonstrating a production-style AWS container deployment.

**Stack:** React · Flask · PostgreSQL · Docker · ECS Fargate · ALB · ECR · RDS · Secrets Manager · CloudWatch · CodePipeline

## Architecture

```text
                              Internet
                                  |
                                  v
                           BigRock DNS
                                  |
                     +------------+------------+
                     |                         |
             web.noelav.space          api.noelav.space
                     |                         |
                     +------------+------------+
                                  |
                                  v
                       Internet-facing ALB
                            HTTPS :443
                         ACM Certificate
                                  |
                 +----------------+----------------+
                 |                                 |
                 v                                 v
        Frontend Target Group              Backend Target Group
                 |                                 |
                 v                                 v
        Frontend ECS Service              Backend ECS Service
          Private Subnet                    Private Subnet
                                                   |
                              +--------------------+------------------+
                              |                                       |
                              v                                       v
                       Secrets Manager                          Amazon RDS
                       DB credentials                           PostgreSQL
                              |
                              v
                       Backend Container

        Frontend ECS ──────────┐
        Backend ECS ───────────┼──> CloudWatch Logs
        ALB ───────────────────┘

        Internet → ALB → ECS → RDS
```

**ECS tasks have no public IPs. ALB is the only public entry point.**

| Component | URL                                 |
| --------- | ----------------------------------- |
| Frontend  | `http://localhost:8080`             |
| Backend   | `http://localhost:8081`             |
| Health    | `http://localhost:8081/health`      |
| API       | `http://localhost:8081/api/message` |

## Production

```text
Frontend: https://web.noelav.space
Backend:  https://api.noelav.space
```

* HTTPS terminates at the ALB using ACM.
* Host-based routing separates frontend and backend.
* ECS services run in private subnets.
* RDS runs in private subnets.
* Database credentials are injected from Secrets Manager.
* Container logs are sent to CloudWatch.
* Security groups allow only required traffic.

## IAM

**Task Execution Role**

* Pull images from ECR
* Send logs to CloudWatch
* Retrieve Secrets Manager secrets for ECS injection

**Task Role**

* IAM identity available to the application itself
* Used only when the application needs to call AWS APIs

## CI/CD

```text
GitHub
   |
   v
CodePipeline
   |
   v
CodeBuild
   |
   +--> Build frontend/backend
   |
   +--> Push images to ECR
   |
   v
Manual Approval
   |
   v
ECS Deployment
   |
   v
Rolling Update
```

Image repositories:

```text
ecs-demo-frontend
ecs-demo-backend
```
# Technologies

| Component          | Technology                   |
| ------------------ | ---------------------------- |
| Frontend           | React + Vite                 |
| Web Server         | Nginx                        |
| Backend            | Python + Flask               |
| Application Server | Gunicorn                     |
| Database           | PostgreSQL                   |
| Containers         | Docker                       |
| Container Platform | Amazon ECS Fargate           |
| Registry           | Amazon ECR                   |
| Load Balancer      | Application Load Balancer    |
| TLS                | AWS Certificate Manager      |
| Secrets            | AWS Secrets Manager          |
| Database Hosting   | Amazon RDS                   |
| Logging            | Amazon CloudWatch            |
| CI/CD              | AWS CodePipeline + CodeBuild |
| Notifications      | Amazon SNS                   |
| DNS                | BigRock                      |
| Infrastructure     | AWS                          |

#



# Future Improvements

Possible future enhancements include:

* AWS WAF
* CloudFront
* Route 53 hosted zone
* ECS Service Connect
* Cloud Map service discovery
* Auto Scaling
* Application Auto Scaling
* RDS Multi-AZ
* RDS backups
* ECR image scanning
* Trivy/Gitleaks/SonarQube security checks
* Terraform infrastructure
* GitHub Actions
* Blue/green ECS deployments
* CloudWatch alarms
* SNS alerting
* AWS X-Ray / distributed tracing
* Centralized dashboards
* Cost monitoring

These are intentionally kept separate from the initial implementation so the core ECS architecture and CI/CD pipeline remain easy to understand.

---

