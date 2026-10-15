# Database Architecture & Data Dictionary

Comprehensive relational database model supporting the **AI-Based Automated Software Testing Platform**. Engineered for multi-tenant scalability, ACID transactions, and sub-millisecond query performance on test execution logs and AI analytics.

---

## 1. Entity-Relationship Diagram (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ PROJECTS : "creates"
    USERS ||--o{ TEST_RUNS : "triggers"
    USERS ||--o{ AUDIT_LOGS : "generates"
    PROJECTS ||--o{ TEST_CASES : "contains"
    PROJECTS ||--o{ TEST_RUNS : "executes"
    PROJECTS ||--o{ BUG_PREDICTIONS : "analyzed_by"
    ENVIRONMENTS ||--o{ TEST_RUNS : "runs_on"
    TEST_RUNS ||--o{ TEST_RESULTS : "yields"
    TEST_CASES ||--o{ TEST_RESULTS : "evaluated_in"

    USERS {
        bigint id PK
        varchar name
        varchar email UK
        varchar password
        enum role "ADMIN, DEV, QA"
        varchar status
        timestamp created_at
    }

    PROJECTS {
        bigint id PK
        varchar name
        text description
        varchar repository_url
        varchar default_branch
        varchar tech_stack
        enum health_status
        bigint created_by FK
    }

    ENVIRONMENTS {
        bigint id PK
        varchar name
        varchar browser
        varchar os
        varchar base_url
        boolean is_active
    }

    TEST_CASES {
        bigint id PK
        bigint project_id FK
        varchar title
        enum test_type "UI, API, UNIT, REGRESSION, SECURITY"
        enum generated_by "AI, QA_MANUAL, AUTOMATION"
        enum priority "LOW, MEDIUM, HIGH, CRITICAL"
        json steps_json
        text expected_result
    }

    TEST_RUNS {
        bigint id PK
        varchar run_code UK
        bigint project_id FK
        bigint environment_id FK
        bigint triggered_by FK
        enum run_status "PENDING, RUNNING, PASSED, FAILED, ABORTED"
        int total_tests
        int passed_tests
        int failed_tests
        bigint execution_time_ms
        longtext log_output
    }

    TEST_RESULTS {
        bigint id PK
        bigint test_run_id FK
        bigint test_case_id FK
        varchar test_name
        enum status "PASS, FAIL, SKIPPED"
        int duration_ms
        text error_message
        longtext stack_trace
    }

    BUG_PREDICTIONS {
        bigint id PK
        bigint project_id FK
        varchar module_name
        decimal risk_score
        decimal confidence
        int lines_of_code
        int commits_count
        enum risk_level
        text recommendations
    }

    AUDIT_LOGS {
        bigint id PK
        bigint user_id FK
        varchar action
        varchar entity_name
        bigint entity_id
        timestamp created_at
    }
```

---

## 2. Table Catalog

| Table | Primary Role | Indexing Key |
|---|---|---|
| `users` | Secure identity, BCrypt credentials, RBAC permissions | `email (UNIQUE)`, `role` |
| `projects` | Git repository registry, technology stack identification | `name` |
| `environments` | Matrix of execution browsers, OS, and remote endpoints | `id` |
| `test_cases` | Catalog of manual and AI-synthesized test specifications | `project_id`, `test_type`, `generated_by` |
| `test_runs` | Orchestrated suite execution runs, status, and aggregated metrics | `run_code (UNIQUE)`, `run_status`, `project_id` |
| `test_results` | Granular per-test outcome, failure traces, execution latency | `test_run_id`, `status` |
| `bug_predictions`| ML risk assessment, churn metrics, and AI recommendations | `project_id`, `risk_level` |
| `audit_logs` | Compliance tracking and user interaction audit trail | `user_id`, `created_at` |

---

## 3. Quick Initialization

```bash
# Via Docker Compose (Recommended)
docker-compose exec db mysql -u root -proot ai_testing < database/schema.sql

# Native MySQL CLI
mysql -h localhost -P 3307 -u root -p < database/schema.sql
```
