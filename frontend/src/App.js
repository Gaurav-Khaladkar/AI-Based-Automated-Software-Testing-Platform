import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import "./styles.css";

const initialRuns = [
  { id: "RUN-1204", project: "Payments", status: "Passed", duration: "7m 12s" },
  { id: "RUN-1203", project: "Checkout", status: "Failed", duration: "5m 48s" },
  { id: "RUN-1202", project: "Accounts", status: "Passed", duration: "6m 05s" },
];

export default function App() {
  const [activeView, setActiveView] = useState("Overview");
  const [recentRuns, setRecentRuns] = useState(initialRuns);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  const startTestRun = (project = "Platform Core") => {
    const runId = `RUN-${Date.now().toString().slice(-5)}`;
    const newRun = { id: runId, project, status: "Running", duration: "--" };

    setRecentRuns((prevRuns) => [newRun, ...prevRuns]);
    setNotice(`${project} run started`);

    setTimeout(() => {
      const passed = Math.random() > 0.25;
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
      setNotice(`${project} run ${passed ? "passed" : "failed"}`);
    }, 2000);
  };

  const handlePrimaryAction = () => {
    if (activeView === "Projects") {
      startTestRun("Checkout");
      return;
    }
    if (activeView === "Settings") {
      setNotice("Settings saved");
      return;
    }
    startTestRun();
  };

  return (
    <div className="app">
      <Sidebar activeItem={activeView} onSelect={setActiveView} />
      <div className="content">
        <Header activeView={activeView} onPrimaryAction={handlePrimaryAction} />
        {notice ? <div className="toast">{notice}</div> : null}
        <Dashboard
          activeView={activeView}
          recentRuns={recentRuns}
          onNewTestRun={startTestRun}
        />
      </div>
    </div>
  );
}
