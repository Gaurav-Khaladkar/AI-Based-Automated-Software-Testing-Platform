import React from "react";

const navItems = [
  { name: "Overview", icon: "📊" },
  { name: "Projects", icon: "📁" },
  { name: "AI Studio", icon: "⚡" },
  { name: "Test Runs", icon: "🚀" },
  { name: "AI Insights", icon: "🧠" },
  { name: "Reports", icon: "📑" },
  { name: "Settings", icon: "⚙️" },
];

export default function Sidebar({ activeItem, onSelect, currentRole, onRoleChange }) {
  return (
    <aside className="sidebar">
      <div>
        <div className="logo-wrapper">
          <div className="logo-icon">⚡</div>
          <div className="logo-text">AITest AI</div>
        </div>

        <div className="role-switcher-container">
          <div className="role-switcher-title">
            <span>ACTIVE ROLE</span>
            <span style={{ color: "var(--accent-cyan)", fontSize: "10px" }}>RBAC ACTIVE</span>
          </div>
          <div className="role-chips">
            {["ADMIN", "DEV", "QA"].map((role) => (
              <button
                key={role}
                type="button"
                className={`role-chip ${currentRole === role ? "active" : ""}`}
                onClick={() => onRoleChange(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <nav className="nav-group">
          {navItems.map((item) => (
            <button
              key={item.name}
              type="button"
              className={`nav-item ${activeItem === item.name ? "active" : ""}`}
              onClick={() => onSelect(item.name)}
            >
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="system-status-indicator">
          <span className="status-dot"></span>
          <span>AI Engine & Cluster Online</span>
        </div>
      </div>
    </aside>
  );
}
