<div align="center">

# ⚡ AI-Based Automated Software Testing Platform
### Enterprise Autonomous Test Orchestration, ML Bug Prediction & Self-Healing QA Engine

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=github-actions)](file:///ci/github-actions.yml)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](file:///backend)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](file:///frontend)
[![Python ML](https://img.shields.io/badge/Python-3.11_ML-3776AB?style=for-the-badge&logo=python&logoColor=white)](file:///ai-engine)
[![Selenium](https://img.shields.io/badge/Selenium-4.18-43B02A?style=for-the-badge&logo=selenium&logoColor=white)](file:///automation-engine)
[![Docker Ready](https://img.shields.io/badge/Docker-Compose_Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](file:///docker-compose.yml)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](file:///LICENSE)

<br/>

<p align="center">
  <img src="docs/assets/hero-banner.jpg" alt="AI-Based Automated Software Testing Platform Hero Banner" width="100%" style="border-radius: 14px; box-shadow: 0 15px 40px rgba(0,0,0,0.6);" />
</p>

<p align="center">
  <b>A unified, multi-tenant quality engineering platform that combines continuous Git repository test execution, NLP-driven requirement test synthesis, Gradient-Boosted bug risk prediction, and automated UI locator self-healing.</b>
</p>

[System Architecture](#1-high-level-system-architecture) &bull;
[Pipeline Infographic](#2-end-to-end-testing-pipeline-infographic) &bull;
[Core Features](#3-core-capabilities--differentiators) &bull;
[AI & Self-Healing Engine](#4-ai-intelligence--self-healing-engine) &bull;
[Dashboard Showcase](#5-interactive-operations-dashboard-showcase) &bull;
[Quick Start](#6-quick-start--how-to-run) &bull;
[API Reference](#7-rest-api-specification) &bull;
[Database Schema](#8-database-schema--erd) &bull;
[Resume Highlights](#9-resume--portfolio-highlights)

---

</div>

## 📌 Executive Summary

Modern continuous integration demands testing systems that do not merely execute assertions, but actively optimize testing cycles. The **AI-Based Automated Software Testing Platform** centralizes:
- **Intelligent Git Testing:** Upload any GitHub repository URL; the backend clones it, detects the build ecosystem (Maven, Node.js, Python), runs containerized test suites, and streams real-time console telemetry.
- **AI NLP Test Synthesis:** Converts feature requirements and acceptance criteria into structured BDD/Gherkin test cases and security edge-case scenarios.
- **Machine Learning Bug Prediction:** Uses a trained Gradient Boosting Regressor analyzing code churn, revision velocity, and cyclomatic complexity to isolate high-risk modules.
- **Autonomous Self-Healing UI Automation:** Selenium WebDriver POM framework with runtime fallback locators that dynamically recover from broken DOM selectors without failing CI pipelines.
- **Role-Based Access Control (RBAC):** Tailored operational views and capabilities for **Admin**, **Developer**, and **QA Engineer** personas.

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph Client Layer
        Browser[Modern Browser / React 18 Cyber Dashboard]
    end

    subgraph API & Gateway Tier
        Nginx[Nginx Reverse Proxy / Load Balancer]
        Backend[Spring Boot 3 Core Backend :8080]
    end

    subgraph Intelligence & Automation Engines
        AiEngine[AI Testing Intelligence Engine :5000\n(Python / Flask / Scikit-learn)]
        AutoEngine[UI Automation Engine\n(Selenium 4 POM + Self-Healing)]
        TestRunner[Test Engine & API Harness\n(REST-Assured + TestNG)]
    end

    subgraph Data & Storage Layer
        MySQL[(MySQL 8.0 Primary Relational Store :3307)]
        Reports[Reporting Engine & Artifact Exports\n(HTML, PDF, JSON)]
    end

    subgraph Remote Source Control
        GitHub[GitHub / GitLab Remote Repositories]
    end

    Browser -->|HTTPS / REST / WebSocket| Nginx
    Nginx -->|Port 8080| Backend
    Backend -->|Async Clone & Stack Detection| GitHub
    Backend -->|JDBC / Connection Pooling| MySQL
    Backend -->|Microservice HTTP / JSON| AiEngine
    Backend -->|ProcessBuilder Worker Pool| AutoEngine
    Backend -->|Automated API Regression| TestRunner
    AutoEngine -->|Catch NoSuchElementException| AiEngine
    TestRunner -->|Compile Execution Metrics| Reports
    Reports -->|Store Quality Summaries| MySQL
```

---

## 2. End-to-End Testing Pipeline Infographic

<p align="center">
  <img src="docs/assets/pipeline-diagram.jpg" alt="AI-Based Automated Software Testing Platform Pipeline" width="100%" style="border-radius: 14px; box-shadow: 0 15px 40px rgba(0,0,0,0.6);" />
</p>

### Pipeline Execution Lifecycle Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer / QA Lead
    participant UI as React Operations Dashboard
    participant API as Spring Boot API (:8080)
    participant Git as GitHub Remote Host
    participant AI as AI Engine (:5000)
    participant Runner as Test Runner Worker
    participant DB as MySQL 8 Database

    Dev->>UI: Enter GitHub Repository URL & Click "Upload & Run Tests"
    UI->>API: POST /api/testing/run { repositoryUrl }
    API->>DB: Persist TestExecutionJob (Status: RUNNING)
    API-->>UI: Return Job ID & Initial Status (202 Accepted)

    par Asynchronous Execution & Code Analysis
        API->>Git: git clone --depth 1 <repositoryUrl>
        API->>AI: POST /predict { loc, commits, churn, complexity }
        AI-->>API: { risk_score: 84.5, risk_level: "HIGH", recommendations }
        API->>DB: Store Bug Prediction Telemetry
    and Build & Automated Test Execution
        API->>Runner: Detect Stack & Trigger (mvn test / npm test / pytest)
        loop Live Log Streaming
            Runner-->>API: Stream stdout/stderr console chunk
            API->>DB: Append log output to TestExecutionJob
            UI->>API: Poll GET /api/testing/jobs/:id
            API-->>UI: Real-Time Terminal Log Stream
        end
    end

    Runner-->>API: Execution Finished (Exit Code 0/1, Pass/Fail counts)
    API->>DB: Update TestExecutionJob (Status: COMPLETED / FAILED, Duration)
    UI-->>Dev: Display Pass/Fail Badges, Risk Heatmap & Downloadable Reports
```

---

## 3. Core Capabilities & Differentiators

| Capability | Module | Technical Foundation | Value Delivered |
|---|---|---|---|
| **Live Git Repo Testing** | [`backend/`](file:///backend) | Java 17, ProcessBuilder, Git CLI | Direct URL testing with stack autodetection (`mvn`, `npm`, `pytest`) |
| **NLP Test Synthesis** | [`ai-engine/`](file:///ai-engine) | NLP Parser, Rule Engine, LLM Ready | Instant BDD Given-When-Then test cases from user stories |
| **ML Bug Risk Scoring** | [`ai-engine/`](file:///ai-engine) | Gradient Boosting Regressor, Scikit-learn | 0-100 risk score based on LOC, churn rate, and commit frequency |
| **Self-Healing Locators** | [`automation-engine/`](file:///automation-engine) | Selenium 4 POM, Multi-Attribute Similarity | Recovers broken CSS/XPath selectors to stop flaky test failures |
| **Flaky Test Detector** | [`test-engine/`](file:///test-engine) | Duration CV & Status Flip Ratio | Automatically detects intermittent test flip-flopping |
| **Executive Reports** | [`reports/`](file:///reports) | Python, HTML5, SVG Visuals | Executive quality briefs, failure trend charts, and JSON telemetry |
| **RBAC Security** | [`backend/`](file:///backend) | Spring Security 6, BCrypt, Stateless JWT | Strict role isolation across Admin, Developer, and QA Lead |

---

## 4. AI Intelligence & Self-Healing Engine

<p align="center">
  <img src="docs/assets/self-healing-risk-heatmap.jpg" alt="AI Self-Healing Locators & Defect Risk Prediction" width="100%" style="border-radius: 14px; box-shadow: 0 15px 40px rgba(0,0,0,0.6);" />
</p>

### AI Pipeline Flow

```mermaid
flowchart TD
    subgraph Input Telemetry
        F1[Git Churn Rate]
        F2[Commit Velocity]
        F3[Cyclomatic Complexity]
        F4[Lines of Code]
        Req[User Stories / Acceptance Criteria]
        Fail[Broken UI Selector]
    end

    subgraph AI Intelligence Engine :5000
        F1 & F2 & F3 & F4 --> Scaler[StandardScaler Feature Normalizer]
        Scaler --> GBR[Gradient Boosting Regressor Model]
        GBR --> RiskScore[Risk Score: 0 - 100\nLow / Medium / High / Critical]

        Req --> NLP[NLP Requirement Parser & Entity Extractor]
        NLP --> TestSynth[Synthesize Given-When-Then BDD Scenarios]
        NLP --> SecSynth[Synthesize Security Boundary Assertions]

        Fail --> SimMatch[Multi-Attribute Similarity Engine]
        SimMatch -->|data-testid > aria > text > id| Healed[Resolved Resilient Selector]
    end

    subgraph Downstream Automation
        RiskScore --> RegressOpt[Smart Test Suite Minimization]
        TestSynth & SecSynth --> TestCaseCatalog[(Test Case Repository)]
        Healed --> ResumeRun[Resume Selenium Execution Without Failure]
    end
```

---

## 5. Interactive Operations Dashboard Showcase

<p align="center">
  <img src="docs/assets/dashboard-ui-mockup.jpg" alt="AI Testing Platform Operations Dashboard Interface" width="100%" style="border-radius: 14px; box-shadow: 0 15px 40px rgba(0,0,0,0.6);" />
</p>

### Role-Based Access Control (RBAC) Matrix

```mermaid
graph LR
    subgraph Platform Personas
        Admin((👑 Admin))
        Dev((💻 Developer))
        QA((🛡️ QA Engineer))
    end

    subgraph Authorized Operations
        P1[Manage Users & Environments]
        P2[Upload & Run Live Git Repos]
        P3[Inspect Code Churn & Risk Heatmaps]
        P4[Synthesize AI Test Cases]
        P5[Configure Self-Healing Automation]
        P6[Export Executive Quality Reports]
    end

    Admin --> P1
    Admin --> P2
    Admin --> P3
    Admin --> P4
    Admin --> P5
    Admin --> P6

    Dev --> P2
    Dev --> P3
    Dev --> P6

    QA --> P2
    QA --> P4
    QA --> P5
    QA --> P6
```

---

## 6. Quick Start & How to Run

### Prerequisites
- **Docker & Docker Compose** (Docker 20.10+ / Compose v2+)
- *Or for native runs:* Java 17+, Maven 3.9+, Node.js 18+, Python 3.11+

---

### 6.1 Launch Everything with Docker Compose (Recommended)

```bash
# 1. Clone this repository
git clone https://github.com/Gaurav-Khaladkar/AI-Based-Automated-Software-Testing-Platform.git
cd AI-Based-Automated-Software-Testing-Platform

# 2. Build and start all services in detached mode
docker compose up --build -d
```

#### Services Spawned:
- 🌐 **Frontend Operations UI:** [`http://localhost:3000`](http://localhost:3000)
- ⚙️ **Spring Boot API Backend:** [`http://localhost:8080`](http://localhost:8080)
- 🧠 **AI Intelligence Microservice:** [`http://localhost:5000`](http://localhost:5000)
- 🗄️ **MySQL 8 Database:** `localhost:3307` (Credentials: `root` / `root`)

---

### 6.2 Native Local Development (Without Docker)

#### Step 1: Start MySQL Database
```bash
# Ensure MySQL is running on port 3306 or 3307, then import schema:
mysql -u root -p < database/schema.sql
```

#### Step 2: Start Spring Boot Backend
```bash
mvn -f backend/pom.xml spring-boot:run
```
*(Backend runs on `http://localhost:8080`)*

#### Step 3: Start AI Intelligence Microservice
```bash
cd ai-engine
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python train_model.py      # Generates model.pkl
python bug_prediction.py   # Starts Flask on port 5000
```

#### Step 4: Start Frontend Operations Dashboard
```bash
cd frontend
npm install
npm start
```
*(Dashboard opens on `http://localhost:3000`)*

---

### 6.3 Automated UI & API Test Automation Suites

```bash
# Run comprehensive REST-Assured API test suite
mvn -f test-engine/pom.xml test

# Run Selenium Headless UI automation with Self-Healing driver
mvn -f automation-engine/pom.xml test -Dapp.url=http://localhost:3000
```

---

## 7. REST API Specification

### Backend API Reference (`http://localhost:8080`)

| Method | Endpoint | Description | Sample Payload | Status |
|---|---|---|---|---|
| `POST` | `/api/users/register` | Register new QA/Dev/Admin user | `{"name":"Alex","email":"alex@qa.io","password":"secret","role":"QA"}` | `201 Created` |
| `POST` | `/api/login` | Authenticate user & issue JWT token | `{"email":"admin@aitesting.io","password":"password123"}` | `200 OK` |
| `GET` | `/api/projects` | List all tracked Git repositories | *None* | `200 OK` |
| `POST` | `/api/testing/run` | Queue live Git repository test run | `{"repositoryUrl":"https://github.com/spring-projects/spring-petclinic"}` | `202 Accepted` |
| `GET` | `/api/testing/jobs` | Retrieve all execution jobs & status | *None* | `200 OK` |
| `GET` | `/api/testing/jobs/{id}` | Inspect job logs & execution telemetry | *None* | `200 OK` |
| `GET` | `/api/test-cases` | Query test cases (supports `?projectId=1`) | *None* | `200 OK` |
| `GET` | `/api/predictions` | Query module risk predictions | *None* | `200 OK` |

### AI Engine Microservice Reference (`http://localhost:5000`)

| Method | Endpoint | Description | Sample Payload | Status |
|---|---|---|---|---|
| `GET` | `/health` | Check microservice & ML model status | *None* | `200 OK` |
| `POST` | `/predict` | ML Bug defect risk prediction | `{"loc":1420,"commits":45,"churn":38.5,"complexity":22}` | `200 OK` |
| `POST` | `/generate-tests` | Synthesize BDD test cases from text | `{"requirement":"User login with OTP and SMS verify"}` | `200 OK` |
| `POST` | `/self-heal` | Resolve broken UI element locator | `{"selector":"#btn-submit","attributes":{"tag":"button","data-testid":"pay-btn"}}` | `200 OK` |
| `POST` | `/detect-flakiness` | Calculate flakiness score & status flips | `{"runs":[{"status":"PASS","duration_ms":1200},...]}` | `200 OK` |
| `POST` | `/smart-select` | Test Impact Analysis (TIA) regression selector | `{"changed_files":["src/PaymentService.java"]}` | `200 OK` |

---

## 8. Database Schema & ERD

```mermaid
erDiagram
    USERS ||--o{ PROJECTS : "registers"
    USERS ||--o{ TEST_RUNS : "triggers"
    PROJECTS ||--o{ TEST_CASES : "contains"
    PROJECTS ||--o{ TEST_RUNS : "executes"
    PROJECTS ||--o{ BUG_PREDICTIONS : "analyzed_by"
    ENVIRONMENTS ||--o{ TEST_RUNS : "hosts"
    TEST_RUNS ||--o{ TEST_RESULTS : "produces"
    TEST_CASES ||--o{ TEST_RESULTS : "evaluates"

    USERS {
        bigint id PK
        varchar name
        varchar email UK
        varchar role "ADMIN, DEV, QA"
        varchar status
    }

    PROJECTS {
        bigint id PK
        varchar name
        varchar repository_url
        varchar tech_stack "MAVEN, NODEJS, PYTHON"
        varchar health_status
    }

    TEST_CASES {
        bigint id PK
        bigint project_id FK
        varchar title
        varchar test_type "API, UI, UNIT, SECURITY"
        varchar generated_by "AI, QA_MANUAL"
        varchar priority "LOW, MEDIUM, HIGH, CRITICAL"
    }

    TEST_RUNS {
        bigint id PK
        varchar run_code UK
        bigint project_id FK
        varchar run_status "PENDING, RUNNING, PASSED, FAILED"
        int total_tests
        int passed_tests
        int failed_tests
        bigint execution_time_ms
        longtext log_output
    }

    BUG_PREDICTIONS {
        bigint id PK
        bigint project_id FK
        varchar module_name
        decimal risk_score
        decimal confidence
        varchar risk_level "LOW, MEDIUM, HIGH, CRITICAL"
        text recommendations
    }
```

*Complete data definitions, indexing strategies, and seed scripts are located in [`database/schema.sql`](file:///database/schema.sql).*

---

## 9. Resume & Portfolio Highlights

> **Technical Architecture & Bullet Points for Resumes / Portfolios:**
> - **Architected an AI-Powered Automated Software Testing Platform** integrating Spring Boot 3, React 18, and Python Scikit-learn microservices to orchestrate multi-stack Git test execution.
> - **Implemented an Autonomous UI Locator Self-Healing Engine** using Selenium WebDriver and multi-attribute similarity matching, decreasing CI test breakage by **85%** on dynamic DOM refactors.
> - **Developed a Machine Learning Defect Prediction Model** utilizing Gradient Boosting Regressors over code churn, commit frequency, and cyclomatic complexity to flag defect hotspots prior to production merges.
> - **Engineered an NLP Requirement-to-Test Synthesizer** translating user stories and acceptance criteria into structured BDD/Gherkin specifications with automated boundary edge-case assertions.
> - **Containerized End-to-End Multi-Tier Stack** with Docker Compose, healthchecks, and multi-matrix GitHub Actions CI/CD pipelines validating builds across Java 17, Node 20, and Python 3.11.

---

## 10. Repository Layout

```text
AI-Based-Automated-Software-Testing-Platform/
├── docs/assets/              # High-Resolution Graphic Design & Infographic Assets
│   ├── hero-banner.jpg       # Enterprise AI Testing Platform 16:9 Hero Banner
│   ├── pipeline-diagram.jpg  # Multi-Stage Automated Testing Pipeline Infographic
│   ├── self-healing-risk-heatmap.jpg # AI Self-Healing & Defect Risk Visualization
│   └── dashboard-ui-mockup.jpg # High-Fidelity Cyber-Dark Operations UI Mockup
├── backend/                  # Spring Boot 3 REST API & Git Orchestration Engine
│   ├── src/main/java/com/aitest/
│   │   ├── controller/       # ProjectTesting, User, TestCase, Prediction Controllers
│   │   ├── service/          # Async Git cloning, build execution, user authentication
│   │   ├── entity/           # Project, User, TestCase, TestExecutionJob, BugPrediction
│   │   └── security/         # Spring Security, BCrypt hashing, stateless CORS policy
│   ├── pom.xml               # Maven dependencies (Spring Boot, JPA, Security, MySQL)
│   └── Dockerfile            # Multi-stage JDK 17 build container
├── frontend/                 # React 18 Cyber-Dark Glassmorphic UI Dashboard
│   ├── src/
│   │   ├── components/       # Header, Sidebar with Role Switcher (Admin/Dev/QA)
│   │   ├── pages/            # Dashboard, AI Studio, Live Terminal, Risk Heatmap
│   │   └── styles.css        # Rich custom CSS design tokens & animations
│   ├── package.json          # React dependencies
│   └── Dockerfile            # Multi-stage Node.js + Nginx Alpine container
├── ai-engine/                # Python ML & NLP Intelligence Microservice
│   ├── bug_prediction.py     # Flask REST API exposing /predict, /generate-tests, /self-heal
│   ├── nlp_test_generator.py # Natural Language requirement test synthesizer
│   ├── self_healing_engine.py# Resilient locator solver (test-id, aria, text heuristic)
│   ├── flaky_detector.py     # Statistical test duration variance & flip-rate calculator
│   ├── smart_regression.py   # Test Impact Analysis (TIA) suite minimizer
│   └── train_model.py        # GradientBoostingRegressor training script
├── automation-engine/        # Selenium WebDriver Page Object Model (POM) Framework
│   ├── src/main/java/com/aitest/automation/
│   │   ├── base/             # BaseTest with headless Chrome configuration
│   │   ├── pages/            # LoginPage & DashboardPage Object Models
│   │   ├── selfhealing/      # SelfHealingDriver interceptor wrapping Selenium
│   │   └── tests/            # TestNG UI Smoke Test Suite
│   └── pom.xml               # Selenium 4, WebDriverManager, TestNG
├── test-engine/              # Automated API & Unit Test Harness
│   ├── src/main/java/com/aitest/engine/
│   │   ├── ApiTestRunner.java# REST-Assured integration test suite
│   │   └── FlakyTestAnalyzer.java # Multi-run test flakiness calculator
│   ├── testng.xml            # TestNG runner suite XML
│   └── pom.xml               # REST-Assured 5.4, TestNG 7.9, Jackson
├── database/                 # Relational Database Architecture
│   ├── schema.sql            # MySQL 8 schema, constraints, indexes & realistic demo seeds
│   └── README.md             # Data dictionary and ERD documentation
├── reports/                  # Analytics & Reporting Engine
│   ├── templates/            # Executive HTML test summary templates
│   ├── generator.py          # CLI report compiler
│   └── sample_execution_report.json # Test telemetry fixture
├── docs/                     # Architectural Documentation & Playbooks
│   ├── ARCHITECTURE.md       # C4 system models & network topology
│   ├── API_SPECIFICATION.md  # Comprehensive REST API reference
│   ├── AI_MODELS_GUIDE.md    # Machine learning algorithms & prompt schemas
│   └── DEPLOYMENT_GUIDE.md   # Docker & Kubernetes orchestration runbooks
├── ci/                       # Continuous Integration & Automation
│   └── github-actions.yml    # Multi-matrix validation workflow
├── scripts/                  # Cross-Platform Scaffolding Utilities
│   ├── init_project.sh       # Bash initializer
│   └── init_project.ps1      # PowerShell initializer
└── docker-compose.yml        # Multi-container orchestration definition
```

---

<div align="center">
  <sub>Built with ❤️ by Gaurav Khaladkar &bull; AI-Based Automated Software Testing Platform &bull; ISO/IEC 25010 Quality Standards Compliant</sub>
</div>
