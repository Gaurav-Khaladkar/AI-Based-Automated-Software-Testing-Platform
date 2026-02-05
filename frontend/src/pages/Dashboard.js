import React from "react";

const stats = [
  { label: "Active Projects", value: "12" },
  { label: "Tests Today", value: "348" },
  { label: "Failures", value: "7" },
  { label: "AI Risk Alerts", value: "3" },
];

const recentRuns = [
  { id: "RUN-1204", project: "Payments", status: "Passed", duration: "7m 12s" },
  { id: "RUN-1203", project: "Checkout", status: "Failed", duration: "5m 48s" },
  { id: "RUN-1202", project: "Accounts", status: "Passed", duration: "6m 05s" },
];

export default function Dashboard() {
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
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
