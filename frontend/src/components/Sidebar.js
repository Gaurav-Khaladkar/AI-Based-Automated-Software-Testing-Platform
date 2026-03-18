import React from "react";

const navItems = [
  "Overview",
  "Projects",
  "Test Runs",
  "AI Insights",
  "Reports",
  "Settings",
];

export default function Sidebar({ activeItem, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="logo">AITest</div>
      <nav>
        {navItems.map((item) => (
          <button
            key={item}
            className={`nav-item ${activeItem === item ? "active" : ""}`}
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
