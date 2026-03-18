package com.aitest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class TestRunRequest {

    @NotBlank(message = "repositoryUrl is required")
    @Pattern(regexp = "^https://github\\.com/.+", message = "Only GitHub https URLs are supported")
    private String repositoryUrl;

    public String getRepositoryUrl() {
        return repositoryUrl;
    }

    public void setRepositoryUrl(String repositoryUrl) {
        this.repositoryUrl = repositoryUrl;
    }
}
