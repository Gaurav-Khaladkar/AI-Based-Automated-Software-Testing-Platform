import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import "./styles.css";

const initialRuns = [
  { id: "RUN-1204", project: "Payments API Service", status: "Passed", duration: "7m 12s" },
  { id: "RUN-1203", project: "Checkout Frontend Web", status: "Failed", duration: "5m 48s" },
  { id: "RUN-1202", project: "Identity Auth Core", status: "Passed", duration: "6m 05s" },
  { id: "RUN-1201", project: "Analytics Engine", status: "Passed", duration: "8m 30s" },
];

export default function App() {
  const [activeView, setActiveView] = useState("Overview");
  const [recentRuns, setRecentRuns] = useState(initialRuns);
  const [notice, setNotice] = useState("");
  const [currentRole, setCurrentRole] = useState("ADMIN"); // ADMIN, DEV, QA

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  const startTestRun = (project = "Platform Core") => {
    const runId = `RUN-${Date.now().toString().slice(-5)}`;
    const newRun = { id: runId, project, status: "Running", duration: "--" };

    setRecentRuns((prevRuns) => [newRun, ...prevRuns]);
    setNotice(`⚡ Test execution pipeline ${runId} launched for ${project}`);

    setTimeout(() => {
      const passed = Math.random() > 0.2;
      const minutes = 4 + Math.floor(Math.random() * 4);
      const seconds = String(Math.floor(Math.random() * 60)).padStart(2, "0");

      setRecentRuns((prevRuns) =>
        prevRuns.map((run) =>
          run.id === runId
            ? {
                ...run,
                status: passed ? "Passed" : "Failed",
                duration: `${minutes}m ${seconds}s`,
              }
            : run
        )
      );
      setNotice(`Pipeline ${runId} completed: ${passed ? "PASSED (100%)" : "FAILED (Assertions violated)"}`);
    }, 2200);
  };

  const handlePrimaryAction = () => {
    if (activeView === "Projects") {
      startTestRun("Checkout Frontend Web");
      return;
    }
    if (activeView === "Settings") {
      setNotice("✓ Cluster preferences successfully persisted");
      return;
    }
    if (activeView === "AI Studio") {
      setActiveView("AI Studio");
      setNotice("Synthesizing test scenarios from prompt...");
      return;
    }
    if (activeView === "Reports") {
      setNotice("✓ Executive Quality Report compiled and ready for download");
      return;
    }
    startTestRun();
  };

  const handleRoleChange = (role) => {
    setCurrentRole(role);
    setNotice(`Switched active RBAC context to ${role}`);
  };

  return (
    <div className="app">
      <Sidebar
        activeItem={activeView}
        onSelect={setActiveView}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
      />
      <div className="content">
        <Header
          activeView={activeView}
          onPrimaryAction={handlePrimaryAction}
          currentRole={currentRole}
        />
        {notice ? <div className="toast">{notice}</div> : null}
        <Dashboard
          activeView={activeView}
          recentRuns={recentRuns}
          onNewTestRun={startTestRun}
          currentRole={currentRole}
        />
      </div>
    </div>
  );
}
