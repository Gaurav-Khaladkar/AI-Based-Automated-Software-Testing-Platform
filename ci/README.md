# Continuous Integration & Delivery Pipeline

This directory defines automated workflows and quality gates for the **AI-Based Automated Software Testing Platform**.

---

## 1. Pipeline Stages (Mermaid)

```mermaid
flowchart TD
    Push[Git Push / Pull Request] --> ParallelStages
    
    subgraph Parallel Quality Gates
        ParallelStages --> BE[Backend Maven Test - Java 17]
        ParallelStages --> AI[AI Engine Pytest & ML Model - Python 3.11]
        ParallelStages --> FE[Frontend React Production Build - Node 20]
    end

    BE --> ComposeSmoke[Multi-Container Docker Smoke Gate]
    AI --> ComposeSmoke
    FE --> ComposeSmoke

    ComposeSmoke --> PassGate{All Passed?}
    PassGate -->|Yes| Artifacts[Publish Release Images & Docs]
    PassGate -->|No| Notify[Alert Failure to Slack / GitHub Status]
```

---

## 2. Configured Workflow Triggers

- **Mainline Branch Protection:** Triggers on all pushes to `main` and `release/*`.
- **Pull Request Gating:** Validates all pull requests before merging.
- **Docker Compose Integration:** Validates multi-service health across MySQL, Spring Boot, Flask, and React.
