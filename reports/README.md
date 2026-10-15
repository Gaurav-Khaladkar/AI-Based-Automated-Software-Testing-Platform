# Automated Reporting & Analytics Engine

The **Reporting Engine** aggregates test results from unit, API, and UI automation suites, integrates AI defect predictions, and compiles interactive executive dashboards in HTML, PDF, and JSON formats.

---

## 1. Analytics & Reporting Dataflow (Mermaid)

```mermaid
flowchart LR
    A[Test Engine & Runner] -->|Raw XML / JSON Results| B(Reporting Aggregator)
    C[AI Intelligence Engine] -->|Risk Scores & Healing Metrics| B
    B --> D{Format Output Target}
    D -->|Web & CI Artifacts| E[Interactive HTML Dashboard]
    D -->|Audit Compliance| F[PDF Executive Quality Brief]
    D -->|Continuous Analytics| G[Structured JSON Metrics API]
```

---

## 2. Report Formats & Features

| Format | File Pattern | Highlights |
|---|---|---|
| **HTML** | `latest_execution_report.html` | Cyber-dark theme, pass/fail metrics, AI self-healing audit log, responsive tables |
| **JSON** | `sample_execution_report.json` | Comprehensive telemetry format for CI/CD status reporting and REST API consumption |
| **CSV** | `failure_trends.csv` | Historical failure trends for root-cause statistical analysis |

---

## 3. CLI Generation

```bash
# Generate HTML report from latest execution JSON
python reports/generator.py
```
