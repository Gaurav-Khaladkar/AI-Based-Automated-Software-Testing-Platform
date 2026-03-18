import React from "react";

const viewContent = {
  Overview: {
    title: "AI Testing Platform",
    subtitle: "Monitor automated runs, AI insights, and quality trends.",
    action: "New Test Run",
  },
  Projects: {
    title: "Projects",
    subtitle: "Track project quality and launch test runs directly.",
    action: "Run Selected Project",
  },
  "Test Runs": {
    title: "Test Runs",
    subtitle: "Inspect recent runs and trigger a fresh regression cycle.",
    action: "Run Regression",
  },
  "AI Insights": {
    title: "AI Insights",
    subtitle: "Review high-risk modules and predictive quality indicators.",
    action: "Analyze Risk",
  },
  Reports: {
    title: "Reports",
    subtitle: "Generate and review exportable quality and trend reports.",
    action: "Generate Report",
  },
  Settings: {
    title: "Settings",
    subtitle: "Tune notifications and execution preferences.",
    action: "Save Settings",
  },
};

export default function Header({ activeView, onPrimaryAction }) {
  const content = viewContent[activeView] ?? viewContent.Overview;

  return (
    <header className="header">
      <div>
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
      </div>
      <button className="primary" onClick={onPrimaryAction}>
        {content.action}
      </button>
    </header>
  );
}
