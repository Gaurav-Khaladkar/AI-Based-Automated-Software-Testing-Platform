# System Architecture Specification

This document provides a comprehensive technical blueprint of the **AI-Based Automated Software Testing Platform**, covering system topology, component interactions, scalability models, and fault-tolerance boundaries.

---

## 1. High-Level System Architecture (C4 Container Diagram)

```mermaid
graph TB
    subgraph Client Layer
        Browser[Modern Web Browser / SPA React Dashboard]
    end

    subgraph Edge & Gateway
        Nginx[Reverse Proxy & TLS Termination]
    end

    subgraph Application Tier
        Backend[Spring Boot Backend Core :8080]
        AiEngine[AI Testing Intelligence Engine :5000]
        TestRunner[Test Engine & Selenium Automation Engine]
    end

    subgraph Data & Storage Tier
        MySQL[(MySQL 8.0 Primary Store :3306)]
        Artifacts[Reports & Artifact Storage / Local & S3]
    end

    subgraph Target Repositories & CI
        GitHost[GitHub / GitLab / Bitbucket API]
        CI[GitHub Actions CI/CD Pipeline]
    end

    Browser -->|HTTPS / REST / JSON| Nginx
    Nginx -->|Port 8080| Backend
    Backend -->|JDBC / Connection Pool| MySQL
    Backend -->|HTTP / JSON Microservice Call| AiEngine
    Backend -->|Process Fork & Orchestration| TestRunner
    Backend -->|Git Clone / Webhook Trigger| GitHost
    TestRunner -->|HTTP API Tests| Backend
    TestRunner -->|Self-Healing Requests| AiEngine
    TestRunner -->|Execution Artifacts & HTML| Artifacts
    CI -->|Matrix Validation & Image Build| Backend
```

---

## 2. Layered Architecture Principles

### 1. Presentation Layer (React 18 Dashboard)
- **Role-Based Views:** Admin, Developer, and QA views with contextual action buttons.
- **Real-Time Telemetry:** Continuous polling and asynchronous job status stream.
- **Glassmorphic Cyber-Aesthetic:** Designed for maximum visual impact with glowing status cards, dark cyber palette, and animated state transitions.

### 2. Application Core (Spring Boot 3.2.x)
- **Modular Monolith Architecture:** Decoupled into `controller`, `service`, `entity`, `repository`, and `security`.
- **Security:** Spring Security 6 with BCrypt credential hashing, stateless JWT session tokens, and strict CORS policies.
- **Live Project Testing Service:** Clones Git repositories asynchronously, detects project build stack (`pom.xml`, `package.json`, `pyproject.toml`), runs containerized tests, and pipes console output.

### 3. AI Intelligence Layer (Python 3.11 / Flask)
- **Predictive Risk Modeling:** Scikit-learn Gradient Boosting regressor assessing defect probability from code churn and complexity.
- **NLP Test Synthesis:** Natural Language requirements parser transforming user stories into executable Given-When-Then BDD scenarios.
- **Self-Healing Locator Resolver:** Dynamic attribute distance and CSS/XPath fallback generator that rescues broken UI tests.

### 4. Automation & Execution Layer (Selenium 4 + TestNG)
- **Page Object Model (POM):** Decoupled page elements from execution logic.
- **SelfHealingDriver:** Automatic catch-and-recover wrapper intercepting `NoSuchElementException`.

### 5. Persistence Layer (MySQL 8.0)
- Fully normalized relational schema with foreign key cascading, unique constraints, and composite indexes on query paths.

---

## 3. End-to-End Test Execution Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Developer / QA
    participant Web as Frontend UI
    participant API as Spring Boot API
    participant Git as Remote Git Repo
    participant AI as AI Engine
    participant Runner as Test Engine
    participant DB as MySQL Database

    User->>Web: Enter Git URL & Click 'Upload & Run Tests'
    Web->>API: POST /api/projects/test-live
    API->>DB: Insert TestExecutionJob (Status: RUNNING)
    API-->>Web: Return Job ID & Initial Status

    par Async Execution & AI Analysis
        API->>Git: git clone --depth 1 <repo_url>
        API->>AI: POST /predict (Git Churn & Complexity Metrics)
        AI-->>API: Bug Risk Score & Module Recommendations
    and Build & Test
        API->>Runner: Detect Stack & Run (mvn test / npm test)
        Runner-->>API: Stream Logs & Execution Telemetry
    end

    API->>DB: Update TestExecutionJob (Status: COMPLETED / FAILED, Logs)
    Web->>API: Poll GET /api/test-jobs/:id/logs
    API-->>Web: Real-time Terminal Log Stream
    Web-->>User: Display Formatted Results, Pass/Fail Badges, & AI Insights
```
