CREATE DATABASE ai_testing;
USE ai_testing;

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255),
    role VARCHAR(20)
);

CREATE TABLE projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    repository_url VARCHAR(255),
    created_by BIGINT,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE test_cases (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT,
    description TEXT,
    test_type VARCHAR(20),
    status VARCHAR(20),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE test_runs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT,
    status VARCHAR(20),
    execution_time INT,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);
