import React from "react";

const viewContent = {
  Overview: {
    title: "Testing Operations & AI Telemetry",
    subtitle: "Real-time orchestration of automated test pipelines, self-healing locators, and ML risk scores.",
    action: "Launch Full Regression",
  },
  Projects: {
    title: "Project Repository Registry",
    subtitle: "Connect Git repositories, detect project build frameworks, and execute live tests.",
    action: "Test Repository",
  },
  "AI Studio": {
    title: "AI Test Synthesis & Generator Studio",
    subtitle: "Transform requirements into Given-When-Then BDD test cases with automatic edge cases.",
    action: "Synthesize New Tests",
  },
  "Test Runs": {
    title: "Continuous Test Run Pipelines",
    subtitle: "Inspect historical executions, duration timelines, and flaky test quarantine statuses.",
    action: "Trigger Pipeline",
  },
  "AI Insights": {
    title: "Machine Learning Defect Insights",
    subtitle: "Predictive vulnerability scoring based on code churn, commit frequency, and complexity.",
    action: "Recalculate Risk",
  },
  Reports: {
    title: "Executive Quality Analytics & Reports",
    subtitle: "Export executive quality briefs, compliance audits, and defect trend dashboards.",
    action: "Export Quality Report",
  },
  Settings: {
    title: "Cluster Preferences & Integrations",
    subtitle: "Configure Selenium grid matrix, webhooks, and AI self-healing sensitivity thresholds.",
    action: "Save Configuration",
  },
};

export default function Header({ activeView, onPrimaryAction, currentRole }) {
  const content = viewContent[activeView] ?? viewContent.Overview;

  return (
    <header className="header">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <h1>{content.title}</h1>
          <span className="badge badge-ai" style={{ fontSize: "11px" }}>
            {currentRole} WORKSPACE
          </span>
        </div>
        <p>{content.subtitle}</p>
      </div>
      <div className="header-actions">
        <button type="button" className="btn-primary" onClick={onPrimaryAction}>
          <span>⚡</span>
          <span>{content.action}</span>
        </button>
      </div>
    </header>
  );
}
