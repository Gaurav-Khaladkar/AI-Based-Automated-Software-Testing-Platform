import React from "react";

export default function Header() {
  return (
    <header className="header">
      <div>
        <h1>AI Testing Platform</h1>
        <p>Monitor automated runs, AI insights, and quality trends.</p>
      </div>
      <button className="primary">New Test Run</button>
    </header>
  );
}
