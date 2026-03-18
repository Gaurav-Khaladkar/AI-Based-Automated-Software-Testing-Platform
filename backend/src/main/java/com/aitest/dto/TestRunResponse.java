package com.aitest.dto;

import java.time.LocalDateTime;

import com.aitest.entity.TestExecutionJob;

public class TestRunResponse {

    private Long id;
    private String repositoryUrl;
    private String projectName;
    private String status;
    private String framework;
    private String commandUsed;
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
    private Long durationMs;
    private String logOutput;

    public static TestRunResponse fromEntity(TestExecutionJob job) {
        return fromEntity(job, true);
    }

    public static TestRunResponse fromEntity(TestExecutionJob job, boolean includeLogOutput) {
        TestRunResponse response = new TestRunResponse();
        response.setId(job.getId());
        response.setRepositoryUrl(job.getRepositoryUrl());
        response.setProjectName(job.getProjectName());
        response.setStatus(job.getStatus());
        response.setFramework(job.getFramework());
        response.setCommandUsed(job.getCommandUsed());
        response.setErrorMessage(job.getErrorMessage());
        response.setCreatedAt(job.getCreatedAt());
        response.setStartedAt(job.getStartedAt());
        response.setFinishedAt(job.getFinishedAt());
        response.setDurationMs(job.getDurationMs());
        response.setLogOutput(includeLogOutput ? job.getLogOutput() : null);
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRepositoryUrl() {
        return repositoryUrl;
    }

    public void setRepositoryUrl(String repositoryUrl) {
        this.repositoryUrl = repositoryUrl;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFramework() {
        return framework;
    }

    public void setFramework(String framework) {
        this.framework = framework;
    }

    public String getCommandUsed() {
        return commandUsed;
    }

    public void setCommandUsed(String commandUsed) {
        this.commandUsed = commandUsed;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }

    public void setFinishedAt(LocalDateTime finishedAt) {
        this.finishedAt = finishedAt;
    }

    public Long getDurationMs() {
        return durationMs;
    }

    public void setDurationMs(Long durationMs) {
        this.durationMs = durationMs;
    }

    public String getLogOutput() {
        return logOutput;
    }

    public void setLogOutput(String logOutput) {
        this.logOutput = logOutput;
    }
}
