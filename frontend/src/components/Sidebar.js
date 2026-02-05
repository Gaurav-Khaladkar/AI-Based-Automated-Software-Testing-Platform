import React from "react";

const navItems = [
  "Overview",
  "Projects",
  "Test Runs",
  "AI Insights",
  "Reports",
  "Settings",
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">AITest</div>
      <nav>
        {navItems.map((item) => (
          <button key={item} className="nav-item">
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
