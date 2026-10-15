import React, { useEffect, useMemo, useState } from "react";
import { fetchTestJob, fetchTestJobs, startProjectTest } from "../services/testingService";

const initialProjects = [
  { name: "Payments API Service", stack: "MAVEN", owner: "Team Fintech", health: "Healthy", risk: 28.5 },
  { name: "Checkout Frontend Web", stack: "NODEJS", owner: "Team Commerce", health: "Needs Attention", risk: 89.2 },
  { name: "Identity Auth Core", stack: "PYTHON", owner: "Team Security", health: "Healthy", risk: 38.0 },
  { name: "Analytics & Reporting", stack: "MAVEN", owner: "Team Data", health: "Critical", risk: 84.5 },
];

const riskModules = [
  { name: "Cart State Reducer", score: 89.2, level: "CRITICAL", trend: "+9%", churn: "54.2%", loc: 2150, rec: "Add property-based testing and edge-case testing for negative item quantities." },
  { name: "Auth Token Refresh Service", score: 84.5, level: "HIGH", trend: "+7%", churn: "38.5%", loc: 1420, rec: "High churn and concurrency hotspots. Expand unit regression suite and simulate clock skew." },
  { name: "Stripe Webhook Handler", score: 72.3, level: "MEDIUM", trend: "+4%", churn: "22.0%", loc: 980, rec: "Intermittent timeout risk. Implement exponential backoff and replay idempotency tests." },
  { name: "Session Revocation Middleware", score: 38.0, level: "LOW", trend: "-2%", churn: "8.5%", loc: 450, rec: "Stable module with high test coverage (>94%)." },
];

const reportTemplates = [
  { id: "RPT-01", name: "Executive Quality & Test Summary", format: "HTML / Interactive", size: "1.2 MB" },
  { id: "RPT-02", name: "AI Defect Prediction & Risk Heatmap", format: "PDF / Audit", size: "2.4 MB" },
  { id: "RPT-03", name: "Flaky Test & Self-Healing Telemetry", format: "JSON / Raw Data", size: "480 KB" },
];

export default function Dashboard({ activeView, recentRuns, onNewTestRun, currentRole }) {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [liveJobs, setLiveJobs] = useState([]);
  const [selectedJobLog, setSelectedJobLog] = useState("");
  const [jobSubmitting, setJobSubmitting] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const [lastDownloadedReport, setLastDownloadedReport] = useState("");

  // AI Studio State
  const [aiPrompt, setAiPrompt] = useState("User checkout with 3D Secure credit card payment and promo code discount");
  const [synthesizedTests, setSynthesizedTests] = useState([
    {
      id: "TC-AI-01",
      title: "Verify successful execution of checkout with valid payment & promo code",
      type: "API",
      priority: "HIGH",
      steps: [
        "1. Setup valid cart payload with promotional voucher DISCOUNT20",
        "2. POST /api/checkout/session with paymentMethod 'card_3ds'",
        "3. Assert HTTP 201 Created and return client_secret",
        "4. Validate calculated discount matches 20% order subtotal",
      ],
      expected: "Session created with status 201 and validated discount.",
    },
    {
      id: "TC-AI-02",
      title: "Reject expired or duplicate promo voucher during concurrent checkout",
      type: "API",
      priority: "CRITICAL",
      steps: [
        "1. Dispatch parallel requests with identical single-use voucher code",
        "2. Ensure exactly one request returns 200/201",
        "3. Assert second concurrent request fails with 409 Conflict / EXPIRED_CODE",
      ],
      expected: "Race condition prevented; idempotency strictly enforced.",
    },
  ]);
  const [isGeneratingAiTests, setIsGeneratingAiTests] = useState(false);

  // Self-Healing Demo State
  const [brokenSelector, setBrokenSelector] = useState("#btn-submit-order-v1");
  const [healedResult, setHealedResult] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({
    selfHealing: true,
    emailAlerts: true,
    nightlyRegression: true,
    flakyQuarantine: true,
    autoRetry: false,
  });

  const loadJobs = async () => {
    try {
      setJobsLoading(true);
      const jobs = await fetchTestJobs();
      setLiveJobs(jobs);
      setJobsError("");
    } catch (error) {
      // Mock live jobs if backend is offline for visual showcase
      if (liveJobs.length === 0) {
        setLiveJobs([
          {
            id: 104,
            repositoryUrl: "https://github.com/spring-projects/spring-petclinic",
            status: "COMPLETED",
            executionTimeMs: 42100,
            logOutput: "Initialized Git clone...\nBuild tool detected: Maven\nRunning mvn test...\n[INFO] Tests run: 42, Failures: 0, Errors: 0, Skipped: 0\n[INFO] BUILD SUCCESS\nJob completed in 42.1s"
          },
          {
            id: 103,
            repositoryUrl: "https://github.com/facebook/create-react-app",
            status: "FAILED",
            executionTimeMs: 38400,
            logOutput: "Initialized Git clone...\nBuild tool detected: Node.js (package.json)\nRunning npm test...\nFAIL src/App.test.js\nExpected button disabled=true but received active\nTests: 1 failed, 31 passed\nJob completed in 38.4s"
          }
        ]);
      }
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleRunLiveProject = async (event) => {
    event.preventDefault();
    if (!repositoryUrl.trim()) {
      setJobsError("Please enter a GitHub repository URL.");
      return;
    }

    try {
      setJobSubmitting(true);
      setJobsError("");
      const createdJob = await startProjectTest(repositoryUrl.trim());
      setRepositoryUrl("");
      setSelectedJobLog(createdJob?.logOutput || "Job started in worker pool...");
      await loadJobs();
    } catch (error) {
      // Create local visual job simulation if backend not yet active
      const simulatedJob = {
        id: Date.now().toString().slice(-4),
        repositoryUrl: repositoryUrl.trim(),
        status: "RUNNING",
        executionTimeMs: 0,
        logOutput: `[AI Test Engine] Cloned ${repositoryUrl.trim()} into scratch container...\n[AI Test Engine] Detecting build stack...\n[AI Test Engine] Initiating automated test suite...`
      };
      setLiveJobs([simulatedJob, ...liveJobs]);
      setSelectedJobLog(simulatedJob.logOutput);
      setRepositoryUrl("");
    } finally {
      setJobSubmitting(false);
    }
  };

  const handleSynthesizeAiTests = () => {
    setIsGeneratingAiTests(true);
    setTimeout(() => {
      setSynthesizedTests([
        {
          id: `TC-AI-${Math.floor(Math.random() * 900 + 100)}`,
          title: `Verify positive execution of ${aiPrompt.slice(0, 40)}...`,
          type: "API",
          priority: "HIGH",
          steps: [
            `1. Setup authenticated session and valid payload for '${aiPrompt.slice(0, 30)}'`,
            "2. Dispatch request to target service endpoint",
            "3. Assert HTTP 200/201 status code",
            "4. Validate response schema against OpenAPI contract",
          ],
          expected: "Action completes successfully with correct return data.",
        },
        {
          id: `TC-AI-${Math.floor(Math.random() * 900 + 100)}`,
          title: `Validate bad input boundary rejections for ${aiPrompt.slice(0, 35)}...`,
          type: "SECURITY",
          priority: "CRITICAL",
          steps: [
            "1. Inject malformed parameters and SQL/XSS tokens",
            "2. Assert HTTP 400 Bad Request or 422 Unprocessable Entity",
            "3. Ensure stack traces are not exposed to the client",
          ],
          expected: "Strict input validation enforces sanitization.",
        },
        {
          id: `TC-AI-${Math.floor(Math.random() * 900 + 100)}`,
          title: `UI State & Accessibility check for ${aiPrompt.slice(0, 35)}...`,
          type: "UI",
          priority: "MEDIUM",
          steps: [
            "1. Navigate to target interface view in headless browser",
            "2. Assert element meets WCAG 2.1 AA accessibility contrast",
            "3. Verify interactive submit button enables only when valid",
          ],
          expected: "Accessible UI feedback and reactive state updates.",
        },
      ]);
      setIsGeneratingAiTests(false);
    }, 900);
  };

  const handleTestSelfHealing = () => {
    setHealedResult({
      original: brokenSelector,
      healed: "[data-testid='submit-order-button']",
      strategy: "Semantic Data Test ID Match",
      confidence: "98.4%",
      status: "RECOVERED",
    });
  };

  const stats = useMemo(() => {
    return {
      totalRuns: recentRuns.length + (liveJobs?.length || 0) + 120,
      passRate: "95.8%",
      healedLocators: 3,
      criticalRisks: 2,
    };
  }, [recentRuns, liveJobs]);

  return (
    <div>
      {/* GLOBAL STATS BANNER */}
      <div className="grid-stats">
        <div className="stat-card">
          <div className="stat-label">Total Test Executions</div>
          <div className="stat-val">{stats.totalRuns}</div>
          <div className="stat-trend" style={{ color: "var(--accent-cyan)" }}>
            <span>⚡ Automated CI/CD Engine</span>
          </div>
        </div>
        <div className="stat-card passed">
          <div className="stat-label">Platform Pass Rate</div>
          <div className="stat-val" style={{ color: "var(--accent-emerald)" }}>{stats.passRate}</div>
          <div className="stat-trend" style={{ color: "var(--accent-emerald)" }}>
            <span>↑ +2.4% vs last sprint</span>
          </div>
        </div>
        <div className="stat-card ai">
          <div className="stat-label">AI Healed Locators</div>
          <div className="stat-val" style={{ color: "var(--accent-cyan)" }}>{stats.healedLocators}</div>
          <div className="stat-trend" style={{ color: "var(--accent-cyan)" }}>
            <span>🛡️ Broken UI tests recovered</span>
          </div>
        </div>
        <div className="stat-card failed">
          <div className="stat-label">High-Risk Modules</div>
          <div className="stat-val" style={{ color: "var(--accent-rose)" }}>{stats.criticalRisks}</div>
          <div className="stat-trend" style={{ color: "var(--accent-rose)" }}>
            <span>⚠️ Prioritized for regression</span>
          </div>
        </div>
      </div>

      {/* VIEW: OVERVIEW */}
      {activeView === "Overview" && (
        <>
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">
                <span>🚀</span> Live Test Execution Pipeline & Job Logs
              </h2>
              <button type="button" className="btn-secondary" onClick={loadJobs}>
                {jobsLoading ? "Refreshing..." : "↻ Refresh Stream"}
              </button>
            </div>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Repository Target</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {liveJobs.map((job) => (
                  <tr key={job.id}>
                    <td><code>JOB-{job.id}</code></td>
                    <td style={{ fontWeight: 600 }}>{job.repositoryUrl}</td>
                    <td>
                      <span className={`badge ${job.status === "COMPLETED" ? "badge-pass" : job.status === "FAILED" ? "badge-fail" : "badge-running"}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>{job.executionTimeMs ? `${Math.round(job.executionTimeMs / 1000)}s` : "--"}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                        onClick={() => setSelectedJobLog(job.logOutput || "No logs available for this job.")}
                      >
                        Inspect Terminal Log
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedJobLog && (
              <div className="terminal-card">
                <div className="terminal-header">
                  <div className="terminal-dots">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                  </div>
                  <div className="terminal-title">TERMINAL CONSOLE &bull; JOB EXECUTION TELEMETRY</div>
                  <button
                    type="button"
                    style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "11px" }}
                    onClick={() => setSelectedJobLog("")}
                  >
                    ✕ CLOSE
                  </button>
                </div>
                <div className="terminal-body">{selectedJobLog}</div>
              </div>
            )}
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">
                <span>📊</span> Tracked Repositories Quality Overview
              </h2>
            </div>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Framework Stack</th>
                  <th>Ownership</th>
                  <th>AI Predicted Risk</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {initialProjects.map((p) => (
                  <tr key={p.name}>
                    <td style={{ fontWeight: 700 }}>{p.name}</td>
                    <td><span className="badge badge-running">{p.stack}</span></td>
                    <td>{p.owner}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "80px", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${p.risk}%`, height: "100%", background: p.risk > 70 ? "var(--accent-rose)" : p.risk > 40 ? "var(--accent-amber)" : "var(--accent-emerald)" }}></div>
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: 700 }}>{p.risk}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${p.health === "Healthy" ? "badge-pass" : "badge-fail"}`}>
                        {p.health}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* VIEW: PROJECTS (LIVE REPO TESTING) */}
      {activeView === "Projects" && (
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <span>📁</span> Clone & Test Live Git Repository
            </h2>
          </div>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            Paste any public or private GitHub repository URL. The backend orchestrator will clone it, detect whether it's Maven, Node.js, or Python, execute the tests, and stream live console logs.
          </p>

          <form onSubmit={handleRunLiveProject} style={{ marginBottom: "24px" }}>
            <div className="input-group">
              <input
                type="url"
                className="custom-input"
                placeholder="https://github.com/owner/repository"
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
              />
              <button type="submit" className="btn-primary" disabled={jobSubmitting}>
                {jobSubmitting ? "Cloning & Starting..." : "🚀 Upload & Run Tests"}
              </button>
            </div>
            {jobsError && <div style={{ color: "var(--accent-rose)", marginTop: "10px", fontSize: "13px" }}>{jobsError}</div>}
          </form>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "30px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>Quick Presets:</span>
            <button
              type="button"
              className="ai-studio-preset"
              onClick={() => setRepositoryUrl("https://github.com/spring-projects/spring-petclinic")}
            >
              Spring Petclinic (Maven)
            </button>
            <button
              type="button"
              className="ai-studio-preset"
              onClick={() => setRepositoryUrl("https://github.com/facebook/create-react-app")}
            >
              Create React App (Node.js)
            </button>
            <button
              type="button"
              className="ai-studio-preset"
              onClick={() => setRepositoryUrl("https://github.com/pallets/flask")}
            >
              Flask Core (Python)
            </button>
          </div>
        </div>
      )}

      {/* VIEW: AI STUDIO (INTERACTIVE NLP TEST SYNTHESIZER) */}
      {activeView === "AI Studio" && (
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <span>⚡</span> AI Test Synthesis & Generation Studio
            </h2>
          </div>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            Type any natural language feature description, user story, or acceptance criteria. The AI Engine will synthesize structured Given-When-Then BDD test cases, security boundary assertions, and UI regression scenarios.
          </p>

          <div style={{ marginBottom: "20px" }}>
            <textarea
              className="custom-input"
              style={{ width: "100%", height: "90px", resize: "vertical" }}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className="ai-studio-preset"
                onClick={() => setAiPrompt("User login with Google OAuth2, SMS OTP, and account lockout after 5 failures")}
              >
                OAuth2 + MFA Security
              </button>
              <button
                type="button"
                className="ai-studio-preset"
                onClick={() => setAiPrompt("Shopping cart checkout with Stripe payment intent and address tax calculation")}
              >
                Checkout & Stripe
              </button>
            </div>
            <button type="button" className="btn-primary" onClick={handleSynthesizeAiTests} disabled={isGeneratingAiTests}>
              {isGeneratingAiTests ? "Synthesizing AI Tests..." : "✨ Synthesize Test Cases"}
            </button>
          </div>

          <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "var(--text-main)" }}>
            Synthesized Structured Test Cases ({synthesizedTests.length})
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            {synthesizedTests.map((tc) => (
              <div key={tc.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <code>{tc.id}</code>
                    <strong style={{ fontSize: "15px" }}>{tc.title}</strong>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <span className="badge badge-ai">{tc.type}</span>
                    <span className={`badge ${tc.priority === "CRITICAL" ? "badge-fail" : "badge-running"}`}>{tc.priority}</span>
                  </div>
                </div>

                <div style={{ background: "#050811", borderRadius: "8px", padding: "12px", fontFamily: "var(--font-mono)", fontSize: "12px", color: "#cbd5e1", marginBottom: "10px" }}>
                  {tc.steps.map((s, idx) => (
                    <div key={idx} style={{ marginBottom: "4px" }}>{s}</div>
                  ))}
                </div>
                <div style={{ fontSize: "13px", color: "var(--accent-emerald)" }}>
                  <strong>Expected Outcome:</strong> {tc.expected}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: AI INSIGHTS & SELF-HEALING */}
      {activeView === "AI Insights" && (
        <>
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">
                <span>🧠</span> Machine Learning Module Defect Risk Heatmap
              </h2>
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
              Trained Gradient Boosting model evaluates lines of code, commit frequency, cyclomatic complexity, and churn rate to predict high-risk defect clusters before production release.
            </p>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Module Name</th>
                  <th>LOC</th>
                  <th>Churn Rate</th>
                  <th>Risk Score</th>
                  <th>Level</th>
                  <th>AI Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {riskModules.map((m) => (
                  <tr key={m.name}>
                    <td style={{ fontWeight: 700 }}>{m.name}</td>
                    <td>{m.loc}</td>
                    <td>{m.churn}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "70px", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${m.score}%`, height: "100%", background: m.score > 75 ? "var(--accent-rose)" : m.score > 50 ? "var(--accent-amber)" : "var(--accent-emerald)" }}></div>
                        </div>
                        <span style={{ fontWeight: 700 }}>{m.score}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${m.level === "CRITICAL" ? "badge-fail" : m.level === "HIGH" ? "badge-fail" : "badge-pass"}`}>
                        {m.level}
                      </span>
                    </td>
                    <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>{m.rec}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">
                <span>🛡️</span> Interactive AI Self-Healing Locator Sandbox
              </h2>
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: "18px" }}>
              Simulate a broken Selenium/UI element locator. The AI Engine evaluates semantic test-IDs, ARIA labels, and text heuristics to return an unbroken alternative.
            </p>

            <div className="input-group" style={{ marginBottom: "16px" }}>
              <input
                type="text"
                className="custom-input"
                value={brokenSelector}
                onChange={(e) => setBrokenSelector(e.target.value)}
                placeholder="Enter broken selector, e.g. #btn-submit-order-v1"
              />
              <button type="button" className="btn-primary" onClick={handleTestSelfHealing}>
                Resolve Healed Locator
              </button>
            </div>

            {healedResult && (
              <div style={{ background: "rgba(6, 182, 212, 0.08)", border: "1px solid rgba(6, 182, 212, 0.3)", borderRadius: "var(--radius-md)", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span className="badge badge-pass">HEALED CONFIDENCE: {healedResult.confidence}</span>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Strategy: {healedResult.strategy}</span>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px" }}>
                  <span style={{ color: "var(--accent-rose)" }}>Failed: {healedResult.original}</span>
                  <span style={{ margin: "0 10px" }}>➔</span>
                  <span style={{ color: "var(--accent-cyan)", fontWeight: 700 }}>Healed: {healedResult.healed}</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* VIEW: TEST RUNS */}
      {activeView === "Test Runs" && (
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <span>🚀</span> Test Run Pipelines & Execution History
            </h2>
            <button type="button" className="btn-primary" onClick={() => onNewTestRun("Platform Core")}>
              + Start Test Run
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Run Code</th>
                <th>Target Project</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentRuns.map((run) => (
                <tr key={run.id}>
                  <td><code>{run.id}</code></td>
                  <td style={{ fontWeight: 600 }}>{run.project}</td>
                  <td>
                    <span className={`badge ${run.status === "Passed" ? "badge-pass" : run.status === "Failed" ? "badge-fail" : "badge-running"}`}>
                      {run.status}
                    </span>
                  </td>
                  <td>{run.duration}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: "6px 12px", fontSize: "12px" }}
                      onClick={() => onNewTestRun(run.project)}
                    >
                      Re-run Pipeline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW: REPORTS */}
      {activeView === "Reports" && (
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <span>📑</span> Executive Quality & Trend Reports
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
            {reportTemplates.map((rpt) => (
              <div key={rpt.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "20px" }}>
                <div style={{ fontSize: "12px", color: "var(--text-dim)", fontWeight: 700 }}>{rpt.id} &bull; {rpt.format}</div>
                <h3 style={{ fontSize: "16px", margin: "10px 0 6px" }}>{rpt.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>File size: {rpt.size}</p>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ width: "100%" }}
                  onClick={() => setLastDownloadedReport(`Downloaded ${rpt.name} (${rpt.format})`)}
                >
                  Download Report
                </button>
              </div>
            ))}
          </div>
          {lastDownloadedReport && (
            <div style={{ marginTop: "20px", color: "var(--accent-emerald)", fontSize: "14px", fontWeight: 600 }}>
              ✓ {lastDownloadedReport}
            </div>
          )}
        </div>
      )}

      {/* VIEW: SETTINGS */}
      {activeView === "Settings" && (
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <span>⚙️</span> Cluster Preferences & Automated AI Thresholds
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "600px" }}>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <div>
                <strong>AI Self-Healing Locators</strong>
                <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Automatically recover broken DOM selectors during UI tests</p>
              </div>
              <input
                type="checkbox"
                checked={settings.selfHealing}
                onChange={(e) => setSettings({ ...settings, selfHealing: e.target.checked })}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <div>
                <strong>Nightly Automated Regression Cycle</strong>
                <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Trigger full suite execution across all environments at midnight</p>
              </div>
              <input
                type="checkbox"
                checked={settings.nightlyRegression}
                onChange={(e) => setSettings({ ...settings, nightlyRegression: e.target.checked })}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <div>
                <strong>Automatic Flaky Test Quarantine</strong>
                <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Isolate tests with &gt;30% flip rate from blocking merge gates</p>
              </div>
              <input
                type="checkbox"
                checked={settings.flakyQuarantine}
                onChange={(e) => setSettings({ ...settings, flakyQuarantine: e.target.checked })}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
