# AI-Based Automated Software Testing Platform

## Project Overview
The AI-Based Automated Software Testing Platform centralizes intelligent test generation, automated execution, and analytics into one role-based system. It combines a modern web UI, scalable backend APIs, an automation engine, and ML-driven insights to accelerate testing and improve software quality.

---

## Quick Start (Project Scaffold)
Run the bootstrap script to create the baseline application structure:

```bash
./scripts/init_project.sh
```

## How to Run (End-to-End)
### Prerequisites
- Java 17
- Maven 3.9+
- Node.js 18+
- Python 3.11+
- Docker + Docker Compose

### 1) Start core services with Docker
```bash
docker-compose up --build
```

This launches:
- **MySQL** on `localhost:3306`
- **Backend** on `localhost:8080`
- **AI Engine** on `localhost:5000`

### 2) Run the backend locally (optional)
```bash
mvn -f backend/pom.xml spring-boot:run
```

### 3) Run the AI engine locally (optional)
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r ai-engine/requirements.txt
python ai-engine/bug_prediction.py
```
If `model.pkl` is not present, the AI engine returns a lightweight heuristic score until you add a trained model.

### 4) Run the frontend locally (optional)
```bash
cd frontend
npm install
npm start
```

### 5) Database initialization (optional)
```bash
mysql -u root -p < database/schema.sql
```

### 6) Automation engine sample
```bash
javac automation-engine/TestRunner.java
java TestRunner
```

### Repository Structure
```
backend/      # REST APIs, auth, orchestration
frontend/     # UI dashboard
ai-engine/    # ML/NLP services
automation-engine/  # Selenium/UI automation
database/     # schema + migrations
docker-compose.yml  # local dev services
ci/           # GitHub Actions pipeline
docs/         # project documentation assets
reports/      # generated analytics outputs
```

### Example Configs & Scripts
* `backend/src/main/resources/application.properties`
* `backend/pom.xml`
* `backend/Dockerfile`
* `database/schema.sql`
* `ai-engine/bug_prediction.py`
* `ai-engine/requirements.txt`
* `ai-engine/Dockerfile`
* `automation-engine/TestRunner.java`
* `frontend/src/services/authService.js`
* `frontend/package.json`
* `docker-compose.yml`
* `ci/github-actions.yml`

---

## 1. Complete Project Architecture

```
                ┌──────────────────────────┐
                │        Frontend UI       │
                │ (React / Angular / Web)  │
                └─────────────┬────────────┘
                              │ REST APIs
                ┌─────────────▼────────────┐
                │        Backend API        │
                │   (Spring Boot / Node)    │
                └─────────────┬────────────┘
                              │
      ┌───────────────────────┼────────────────────────┐
      │                       │                        │
┌─────▼─────┐        ┌───────▼────────┐        ┌──────▼──────┐
│ Auth/RBAC  │        │ Test Engine     │        │ AI Engine    │
│ Service    │        │ (Selenium/API)  │        │ (ML/NLP)     │
└─────┬─────┘        └───────┬────────┘        └──────┬──────┘
      │                      │                         │
      └──────────────┬───────┴──────────────┬──────────┘
                     │                      │
              ┌──────▼───────┐       ┌──────▼────────┐
              │ CI/CD Engine │       │ Report Engine  │
              │ (GitHub/Jenkins) │    │ PDF/Analytics  │
              └──────┬────────┘       └──────┬────────┘
                     │                      │
                ┌────▼──────────────────────▼────┐
                │           Database              │
                │   (MySQL / PostgreSQL)         │
                └────────────────────────────────┘
```

### Architecture Layers
1. **Presentation Layer** – UI Dashboard
2. **Application Layer** – REST APIs
3. **Business Layer** – Test execution logic
4. **AI Layer** – Test case generation & bug prediction
5. **Data Layer** – Database

---

## 2. Module Breakdown (RBAC – Role Based Access Control)

### 🔐 1. Admin Module
- Manage users (QA, Developer)
- Assign projects
- Configure testing environments
- View overall analytics
- Manage CI/CD integrations
- Role management

### 👨‍💻 2. Developer Module
- Upload project repository (Git link)
- Trigger automated test run
- View bug reports
- See code coverage report
- View AI-predicted risk modules
- Download failure logs

### 🧪 3. QA Module
- Create manual test cases
- Approve AI-generated test cases
- Configure automation scripts
- Monitor regression tests
- Validate bug reports
- Track test history

---

## 2.1 Module Implementation Notes
### Backend (Spring Boot)
- REST APIs for auth, user management, projects, and test orchestration
- Stateless security with BCrypt password hashing and input validation
- JPA entities stored in MySQL/PostgreSQL

### Frontend (React)
- Role-based navigation for Admin, Developer, and QA
- Analytics and AI insights dashboards
- Auth flows and secure API client integration

### AI Engine (Python)
- Flask service for risk prediction and NLP-driven test generation
- Model loading via `joblib` with pandas input features

### Automation Engine (Selenium)
- Java-based UI regression runner
- Collects logs and screenshots for reporting

### CI/CD
- GitHub Actions pipeline for backend build validation
- Dockerized local dev via `docker-compose.yml`

---

## 3. Database Schema (Core Tables)

### users
```
user_id (PK)
name
email
password
role (ADMIN / DEV / QA)
created_at
status
```

### projects
```
project_id (PK)
project_name
repository_url
created_by (FK -> users)
created_at
status
```

### test_cases
```
test_id (PK)
project_id (FK)
test_type (UI/API/Unit)
generated_by (AI / QA)
description
priority
status
created_at
```

### test_runs
```
run_id (PK)
project_id (FK)
triggered_by (FK -> users)
run_status
execution_time
started_at
completed_at
```

### test_results
```
result_id (PK)
run_id (FK)
test_id (FK)
status (PASS/FAIL)
error_log
screenshot_path
```

### bug_predictions
```
prediction_id (PK)
project_id (FK)
module_name
risk_score
confidence
predicted_at
```

### environments
```
env_id (PK)
env_name
browser
os
version
```

---

## 4. AI Features
- NLP-based requirement → test case generation
- Machine learning bug prediction (based on commit history)
- Self-healing test scripts
- Flaky test detection
- Smart regression selection

---

## 5. Technology Stack Suggestion
- **Backend:** Spring Boot
- **Frontend:** React
- **Database:** MySQL
- **AI Engine:** Python (Scikit-learn / TensorFlow)
- **Automation:** Selenium + TestNG
- **CI/CD:** GitHub Actions

---

## 6. Security Practices (Baseline)
- BCrypt password hashing and validation on input payloads
- CORS restricted to trusted frontend origins
- Security headers for CSP/frame protections
- Centralized exception handling for validation and conflicts

---

## 7. Resume-Ready Project Description
> Developed an AI-Based Automated Software Testing Platform that integrates machine learning for intelligent test case generation, automated UI/API testing using Selenium, and predictive bug analysis. Implemented role-based access control (Admin, Developer, QA), CI/CD integration, automated regression execution, and dynamic test reporting with analytics dashboard. Designed scalable REST APIs using Spring Boot and integrated AI models for risk-based module prediction and smart test optimization.

---

### Next Enhancements
- API endpoint structure
- Microservices architecture
- Deployment blueprint (Docker + Cloud)
- ER diagram
- Spring Boot folder structure
