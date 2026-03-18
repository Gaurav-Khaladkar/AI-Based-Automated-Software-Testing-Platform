import React, { useEffect, useMemo, useState } from "react";
import { fetchTestJob, fetchTestJobs, startProjectTest } from "../services/testingService";

const projects = [
  { name: "Payments", owner: "Team Fintech", health: "Healthy" },
  { name: "Checkout", owner: "Team Commerce", health: "Needs Attention" },
  { name: "Accounts", owner: "Team Identity", health: "Healthy" },
];

const riskModules = [
  { name: "Auth Service", score: 82, trend: "+7%" },
  { name: "Payments API", score: 74, trend: "+4%" },
  { name: "UI Checkout", score: 69, trend: "-2%" },
];

const reportTemplates = [
  { id: "RPT-01", name: "Weekly Quality Summary", format: "PDF" },
  { id: "RPT-02", name: "Failure Trend Analysis", format: "CSV" },
  { id: "RPT-03", name: "Environment Coverage", format: "PDF" },
];

export default function Dashboard({ activeView, recentRuns, onNewTestRun }) {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [liveJobs, setLiveJobs] = useState([]);
  const [selectedJobLog, setSelectedJobLog] = useState("");
  const [jobSubmitting, setJobSubmitting] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const [lastDownloadedReport, setLastDownloadedReport] = useState("");
  const [settings, setSettings] = useState({
    emailAlerts: true,
    nightlyRegression: true,
    autoRetry: false,
  });
  const [savedAt, setSavedAt] = useState("");

  const loadJobs = async () => {
    try {
      setJobsLoading(true);
      const jobs = await fetchTestJobs();
      setLiveJobs(jobs);
      setJobsError("");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Unable to load live jobs. Ensure backend is running on localhost:8080.";
      setJobsError(message);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 5000);
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
      setSelectedJobLog(createdJob?.logOutput || "");
      await loadJobs();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Could not start project testing job. Check the repository URL and try again.";
      setJobsError(message);
    } finally {
      setJobSubmitting(false);
    }
  };

  const handleViewJobLog = async (jobId) => {
    try {
      const job = await fetchTestJob(jobId);
      setSelectedJobLog(job?.logOutput || "No logs available.");
    } catch (error) {
      setSelectedJobLog("Could not load logs for this job.");
    }
  };

  const formatDuration = (durationMs) => {
    if (!durationMs && durationMs !== 0) return "--";
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
  };

  const stats = useMemo(() => {
    const failures = recentRuns.filter((run) => run.status === "Failed").length;
    return [
      { label: "Active Projects", value: "12" },
      { label: "Tests Today", value: String(320 + recentRuns.length) },
      { label: "Failures", value: String(failures) },
      { label: "AI Risk Alerts", value: String(Math.max(1, Math.ceil(failures / 2))) },
    ];
  }, [recentRuns]);

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (activeView === "Projects") {
    return (
      <main className="dashboard">
        <section className="card">
          <h2>Upload Live Project For Testing</h2>
          <p>Paste a GitHub repository URL and launch automated test execution.</p>
          <form className="repo-form" onSubmit={handleRunLiveProject}>
            <input
              className="repo-input"
              type="text"
              placeholder="https://github.com/owner/repository"
              value={repositoryUrl}
              onChange={(event) => setRepositoryUrl(event.target.value)}
            />
            <button className="primary" type="submit" disabled={jobSubmitting}>
              {jobSubmitting ? "Starting..." : "Upload & Run Tests"}
            </button>
          </form>
          {jobsError ? <p className="error-text">{jobsError}</p> : null}
        </section>

        <section className="card">
          <h2>Live Execution Jobs</h2>
          {jobsLoading ? <p>Loading jobs...</p> : null}
          <table className="table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Project</th>
                <th>Status</th>
                <th>Framework</th>
                <th>Duration</th>
                <th>Logs</th>
              </tr>
            </thead>
            <tbody>
              {liveJobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.projectName}</td>
                  <td>
                    <span className={`status ${String(job.status || "").toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>{job.framework}</td>
                  <td>{formatDuration(job.durationMs)}</td>
                  <td>
                    <button className="secondary compact" onClick={() => handleViewJobLog(job.id)}>
                      View Log
                    </button>
                  </td>
                </tr>
              ))}
              {!jobsLoading && liveJobs.length === 0 ? (
                <tr>
                  <td colSpan="6">No jobs yet. Start one using the form above.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
          {selectedJobLog ? (
            <pre className="log-output">{selectedJobLog}</pre>
          ) : null}
        </section>

        <section className="grid">
          {projects.map((project) => (
            <div key={project.name} className="card">
              <h2>{project.name}</h2>
              <p>{project.owner}</p>
              <p>
                Health: <strong>{project.health}</strong>
              </p>
              <button className="secondary" onClick={() => onNewTestRun(project.name)}>
                Run Tests
              </button>
            </div>
          ))}
        </section>
      </main>
    );
  }

  if (activeView === "Test Runs") {
    return (
      <main className="dashboard">
        <section className="card">
          <h2>Live Project Jobs</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Project</th>
                <th>Status</th>
                <th>Framework</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {liveJobs.slice(0, 8).map((job) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.projectName}</td>
                  <td>
                    <span className={`status ${String(job.status || "").toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>{job.framework}</td>
                  <td>{formatDuration(job.durationMs)}</td>
                </tr>
              ))}
              {liveJobs.length === 0 ? (
                <tr>
                  <td colSpan="5">No live jobs found. Start one in Projects view.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>

        <section className="card">
          <h2>Recent Test Runs</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentRuns.map((run) => (
                <tr key={run.id}>
                  <td>{run.id}</td>
                  <td>{run.project}</td>
                  <td>
                    <span className={`status ${run.status.toLowerCase()}`}>
                      {run.status}
                    </span>
                  </td>
                  <td>{run.duration}</td>
                  <td>
                    <button className="secondary compact" onClick={() => onNewTestRun(run.project)}>
                      Re-run
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    );
  }

  if (activeView === "AI Insights") {
    return (
      <main className="dashboard">
        <section className="grid">
          {riskModules.map((module) => (
            <div key={module.name} className="card">
              <h2>{module.name}</h2>
              <p>Risk score: {module.score}</p>
              <p>Weekly trend: {module.trend}</p>
              <button className="secondary" onClick={() => onNewTestRun(module.name)}>
                Run Focused Tests
              </button>
            </div>
          ))}
        </section>
      </main>
    );
  }

  if (activeView === "Reports") {
    return (
      <main className="dashboard">
        <section className="card">
          <h2>Available Reports</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Format</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reportTemplates.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.name}</td>
                  <td>{report.format}</td>
                  <td>
                    <button
                      className="secondary compact"
                      onClick={() => setLastDownloadedReport(report.id)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {lastDownloadedReport ? (
            <p className="note">Downloaded report: {lastDownloadedReport}</p>
          ) : null}
        </section>
      </main>
    );
  }

  if (activeView === "Settings") {
    return (
      <main className="dashboard">
        <section className="card">
          <h2>Execution Preferences</h2>
          <label className="setting-row">
            <input
              type="checkbox"
              checked={settings.emailAlerts}
              onChange={() => toggleSetting("emailAlerts")}
            />
            <span>Email alerts for failed runs</span>
          </label>
          <label className="setting-row">
            <input
              type="checkbox"
              checked={settings.nightlyRegression}
              onChange={() => toggleSetting("nightlyRegression")}
            />
            <span>Nightly regression trigger</span>
          </label>
          <label className="setting-row">
            <input
              type="checkbox"
              checked={settings.autoRetry}
              onChange={() => toggleSetting("autoRetry")}
            />
            <span>Auto-retry failed tests once</span>
          </label>
          <button className="primary inline" onClick={() => setSavedAt(new Date().toLocaleTimeString())}>
            Save Preferences
          </button>
          {savedAt ? <p className="note">Saved at {savedAt}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <section className="stats">
        {stats.map((item) => (
          <div key={item.label} className="card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </section>

      <section className="grid">
        <div className="card wide">
          <h2>AI Risk Heatmap</h2>
          <p>Top modules with elevated risk scores this week.</p>
          <div className="chip-row">
            <span className="chip">Auth Service</span>
            <span className="chip">Payments API</span>
            <span className="chip">UI Checkout</span>
          </div>
        </div>
        <div className="card">
          <h2>Environment Coverage</h2>
          <ul>
            <li>Chrome 120 · 68%</li>
            <li>Firefox 119 · 22%</li>
            <li>Safari 17 · 10%</li>
          </ul>
        </div>
      </section>

      <section className="card">
        <h2>Recent Test Runs</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project</th>
              <th>Status</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {recentRuns.slice(0, 5).map((run) => (
              <tr key={run.id}>
                <td>{run.id}</td>
                <td>{run.project}</td>
                <td>
                  <span className={`status ${run.status.toLowerCase()}`}>
                    {run.status}
                  </span>
                </td>
                <td>{run.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
