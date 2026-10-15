-- =====================================================================
-- AI-Based Automated Software Testing Platform - Database Schema
-- Dialect: MySQL 8.0+ / MariaDB 10.5+
-- =====================================================================

CREATE DATABASE IF NOT EXISTS ai_testing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ai_testing;

-- ---------------------------------------------------------------------
-- 1. USERS & ROLE-BASED ACCESS CONTROL (RBAC)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'DEV', 'QA') NOT NULL DEFAULT 'DEV',
    avatar_url VARCHAR(255) DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 2. PROJECTS & REPOSITORY REGISTRY
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    repository_url VARCHAR(255) NOT NULL,
    default_branch VARCHAR(50) DEFAULT 'main',
    tech_stack VARCHAR(50) DEFAULT 'MAVEN', -- MAVEN, NODEJS, PYTHON, GRADLE
    health_status ENUM('HEALTHY', 'NEEDS_ATTENTION', 'CRITICAL') DEFAULT 'HEALTHY',
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_project_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 3. TEST ENVIRONMENTS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS environments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    browser VARCHAR(50) DEFAULT 'Chrome Headless',
    os VARCHAR(50) DEFAULT 'Linux x86_64',
    base_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 4. TEST CASES (MANUAL & AI GENERATED)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS test_cases (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    test_type ENUM('UI', 'API', 'UNIT', 'REGRESSION', 'SECURITY') NOT NULL DEFAULT 'API',
    generated_by ENUM('AI', 'QA_MANUAL', 'AUTOMATION') NOT NULL DEFAULT 'AI',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    status ENUM('ACTIVE', 'DRAFT', 'DEPRECATED') NOT NULL DEFAULT 'ACTIVE',
    steps_json JSON,
    expected_result TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_tc_project (project_id),
    INDEX idx_tc_type (test_type),
    INDEX idx_tc_generated (generated_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 5. TEST RUNS & JOBS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS test_runs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    run_code VARCHAR(50) UNIQUE NOT NULL,
    project_id BIGINT NOT NULL,
    environment_id BIGINT,
    triggered_by BIGINT,
    run_status ENUM('PENDING', 'RUNNING', 'PASSED', 'FAILED', 'ABORTED') NOT NULL DEFAULT 'PENDING',
    total_tests INT DEFAULT 0,
    passed_tests INT DEFAULT 0,
    failed_tests INT DEFAULT 0,
    skipped_tests INT DEFAULT 0,
    execution_time_ms BIGINT DEFAULT 0,
    log_output LONGTEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (environment_id) REFERENCES environments(id) ON DELETE SET NULL,
    FOREIGN KEY (triggered_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_run_status (run_status),
    INDEX idx_run_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 6. TEST EXECUTION RESULTS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS test_results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    test_run_id BIGINT NOT NULL,
    test_case_id BIGINT,
    test_name VARCHAR(200) NOT NULL,
    status ENUM('PASS', 'FAIL', 'SKIPPED') NOT NULL,
    duration_ms INT DEFAULT 0,
    error_message TEXT,
    stack_trace LONGTEXT,
    screenshot_url VARCHAR(255),
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_run_id) REFERENCES test_runs(id) ON DELETE CASCADE,
    FOREIGN KEY (test_case_id) REFERENCES test_cases(id) ON DELETE SET NULL,
    INDEX idx_tr_run (test_run_id),
    INDEX idx_tr_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 7. BUG PREDICTIONS (AI ENGINE OUTPUTS)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bug_predictions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    module_name VARCHAR(120) NOT NULL,
    risk_score DECIMAL(5, 2) NOT NULL, -- 0.00 to 100.00
    confidence DECIMAL(5, 2) NOT NULL, -- 0.00 to 100.00
    lines_of_code INT DEFAULT 0,
    commits_count INT DEFAULT 0,
    churn_rate DECIMAL(5, 2) DEFAULT 0.00,
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    recommendations TEXT,
    predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_bp_project (project_id),
    INDEX idx_bp_risk (risk_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 8. AUDIT & ACTIVITY LOGS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- SEED DATA FOR DEMO & ENTERPRISE TESTING
-- =====================================================================

-- Default users (Passwords are BCrypt hashed: 'password123')
INSERT INTO users (id, name, email, password, role, status) VALUES
(1, 'Admin Lead', 'admin@aitesting.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiMhBv4yQ.1qTqQW6i5U8K/v/N3C36C', 'ADMIN', 'ACTIVE'),
(2, 'Sarah Chen (Dev)', 'sarah@aitesting.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiMhBv4yQ.1qTqQW6i5U8K/v/N3C36C', 'DEV', 'ACTIVE'),
(3, 'Alex Mercer (QA)', 'alex@aitesting.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiMhBv4yQ.1qTqQW6i5U8K/v/N3C36C', 'QA', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Environments
INSERT INTO environments (id, name, browser, os, base_url, is_active) VALUES
(1, 'Staging US-East', 'Chrome 122 Headless', 'Ubuntu 22.04 LTS', 'https://staging.app.io', TRUE),
(2, 'Pre-Prod EU-Central', 'Firefox 120 Headless', 'Debian 12', 'https://preprod.app.io', TRUE),
(3, 'Cross-Browser Edge', 'MS Edge 121', 'Windows Server 2022', 'https://staging.app.io', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Projects
INSERT INTO projects (id, name, description, repository_url, tech_stack, health_status, created_by) VALUES
(1, 'Payments API Service', 'High-throughput payment gateway orchestrator with Stripe & PayPal integration', 'https://github.com/spring-projects/spring-petclinic', 'MAVEN', 'HEALTHY', 1),
(2, 'Checkout Frontend Web', 'Next.js & React customer purchasing flow with cart validation', 'https://github.com/facebook/create-react-app', 'NODEJS', 'NEEDS_ATTENTION', 2),
(3, 'Identity Auth Core', 'OAuth2, JWT authentication and RBAC entitlement engine', 'https://github.com/pallets/flask', 'PYTHON', 'HEALTHY', 1),
(4, 'Analytics & Reporting Engine', 'Asynchronous data processing pipeline and PDF generation', 'https://github.com/spring-projects/spring-boot', 'MAVEN', 'CRITICAL', 3)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Test Cases
INSERT INTO test_cases (id, project_id, title, description, test_type, generated_by, priority, status, steps_json, expected_result) VALUES
(1, 1, 'Verify Payment Intent Creation with Valid Currency', 'Ensures payment intent returns 201 with client_secret', 'API', 'AI', 'CRITICAL', 'ACTIVE', '["POST /api/payments/intent with amount 5000", "Validate status 201", "Ensure client_secret is not null"]', 'Returns 201 Created with valid payload'),
(2, 1, 'Reject Card Expiration in Past', 'Negative test for expired credit cards', 'API', 'AI', 'HIGH', 'ACTIVE', '["POST /api/payments/charge with exp_year 2020", "Expect 422 Unprocessable Entity"]', 'HTTP 422 with EXPIRED_CARD code'),
(3, 2, 'Checkout Button Disabled on Empty Cart', 'UI validation for cart state', 'UI', 'QA_MANUAL', 'MEDIUM', 'ACTIVE', '["Navigate to /cart", "Ensure item count is 0", "Check submit button is disabled"]', 'Button attribute disabled=true'),
(4, 3, 'Rate Limit Brute Force Login Attempts', 'Security test for 5 consecutive failed logins', 'SECURITY', 'AI', 'CRITICAL', 'ACTIVE', '["Trigger 6 failed POST /login requests", "Verify 429 Too Many Requests on 6th"]', 'HTTP 429 with Retry-After header'),
(5, 2, 'Self-Healing Checkout Address Auto-fill', 'Checks address suggestion dropdown locator resilience', 'UI', 'AI', 'HIGH', 'ACTIVE', '["Type address fragment", "Locate suggestion popup", "Click first option"]', 'Input field populated accurately')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Test Runs
INSERT INTO test_runs (id, run_code, project_id, environment_id, triggered_by, run_status, total_tests, passed_tests, failed_tests, skipped_tests, execution_time_ms, started_at, completed_at) VALUES
(1, 'RUN-94812', 1, 1, 1, 'PASSED', 42, 42, 0, 0, 184500, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR - INTERVAL 56 MINUTE),
(2, 'RUN-94811', 2, 1, 2, 'FAILED', 36, 31, 5, 0, 245000, NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 4 HOUR - INTERVAL 55 MINUTE),
(3, 'RUN-94810', 3, 2, 3, 'PASSED', 58, 58, 0, 0, 312000, NOW() - INTERVAL 12 HOUR, NOW() - INTERVAL 11 HOUR - INTERVAL 54 MINUTE),
(4, 'RUN-94809', 4, 1, 1, 'FAILED', 24, 18, 6, 0, 198000, NOW() - INTERVAL 24 HOUR, NOW() - INTERVAL 23 HOUR - INTERVAL 56 MINUTE)
ON DUPLICATE KEY UPDATE run_code=VALUES(run_code);

-- Test Results
INSERT INTO test_results (id, test_run_id, test_case_id, test_name, status, duration_ms, error_message) VALUES
(1, 1, 1, 'Verify Payment Intent Creation with Valid Currency', 'PASS', 1240, NULL),
(2, 1, 2, 'Reject Card Expiration in Past', 'PASS', 890, NULL),
(3, 2, 3, 'Checkout Button Disabled on Empty Cart', 'FAIL', 3420, 'AssertionError: expected button to be disabled but was active'),
(4, 2, 5, 'Self-Healing Checkout Address Auto-fill', 'FAIL', 4510, 'NoSuchElementException: locator #shipping-dropdown-v2 failed (healed by AI engine to [data-testid=shipping-dropdown])'),
(5, 3, 4, 'Rate Limit Brute Force Login Attempts', 'PASS', 2150, NULL)
ON DUPLICATE KEY UPDATE test_name=VALUES(test_name);

-- Bug Predictions
INSERT INTO bug_predictions (id, project_id, module_name, risk_score, confidence, lines_of_code, commits_count, churn_rate, risk_level, recommendations) VALUES
(1, 1, 'Auth Token Refresh Service', 84.50, 92.00, 1420, 48, 38.5, 'HIGH', 'High churn and concurrency hotspots detected. Expand unit regression suite and simulate clock skew.'),
(2, 1, 'Stripe Webhook Handler', 72.30, 88.50, 980, 32, 22.0, 'MEDIUM', 'Intermittent network timeout risk. Implement exponential backoff and replay idempotency tests.'),
(3, 2, 'Cart State Reducer', 89.20, 95.00, 2150, 74, 54.2, 'CRITICAL', 'Multiple recent refactors. Add property-based testing and edge-case testing for negative item quantities.'),
(4, 3, 'Session Revocation Middleware', 38.00, 85.00, 450, 11, 8.5, 'LOW', 'Stable module with high test coverage (>94%).')
ON DUPLICATE KEY UPDATE module_name=VALUES(module_name);
