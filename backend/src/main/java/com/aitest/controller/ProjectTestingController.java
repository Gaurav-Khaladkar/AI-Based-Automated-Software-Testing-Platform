package com.aitest.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aitest.dto.TestRunRequest;
import com.aitest.dto.TestRunResponse;
import com.aitest.service.ProjectTestingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/testing")
public class ProjectTestingController {

    private final ProjectTestingService service;

    public ProjectTestingController(ProjectTestingService service) {
        this.service = service;
    }

    @PostMapping("/run")
    public ResponseEntity<TestRunResponse> runTests(@Valid @RequestBody TestRunRequest request) {
        return ResponseEntity.accepted().body(service.queueRun(request));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<TestRunResponse>> listJobs() {
        return ResponseEntity.ok(service.listJobs());
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<TestRunResponse> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(service.getJob(id));
    }
}
