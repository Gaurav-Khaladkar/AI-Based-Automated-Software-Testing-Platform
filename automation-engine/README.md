# UI Automation Engine (Selenium & AI Self-Healing)

The **Automation Engine** is an enterprise Page Object Model (POM) Selenium automation framework featuring AI-powered locator self-healing to eliminate flaky tests caused by UI DOM changes.

---

## 1. Self-Healing Architecture (Mermaid)

```mermaid
graph TD
    A[Selenium Test Step Execution] -->|driver.findElement| B{Element Found?}
    B -->|Yes| C[Perform Action: Click / Type / Verify]
    B -->|No: NoSuchElementException| D[AI Self-Healing Interceptor]
    
    subgraph AI Engine Microservice
        D -->|Failed Selector + Element Attributes| E[Multi-Attribute Matcher]
        E -->|Semantic Test-ID / ARIA / Text| F[Generate Resilient Alternative]
    end
    
    F -->|Healed Locator + Confidence > 90%| G[Retry Element Find with Healed Selector]
    G -->|Success| H[Log Healed Telemetry & Continue Test Run]
    G -->|Failure| I[Capture Screenshot & Fail Step Gracefully]
```

---

## 2. Framework Highlights

- **Page Object Model (POM):** Decoupled UI page representations (`LoginPage`, `DashboardPage`) from test logic.
- **Headless Chrome Execution:** Configured for local dev and headless CI/CD runner pipelines.
- **AI Self-Healing Driver Wrapper:** Intercepts runtime locator breakages and resolves dynamic selectors without aborting CI builds.
- **TestNG Integration:** Parallel test execution, data-driven tests, and structured reporting.

---

## 3. Quick Execution

```bash
# Run Selenium UI Smoke Test Suite against local frontend
mvn -f automation-engine/pom.xml test -Dapp.url=http://localhost:3000
```
