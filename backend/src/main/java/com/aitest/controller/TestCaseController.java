package com.aitest.controller;

import com.aitest.entity.TestCase;
import com.aitest.repository.TestCaseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-cases")
@CrossOrigin(origins = "*")
public class TestCaseController {

    private final TestCaseRepository testCaseRepository;

    public TestCaseController(TestCaseRepository testCaseRepository) {
        this.testCaseRepository = testCaseRepository;
    }

    @GetMapping
    public ResponseEntity<List<TestCase>> listTestCases(@RequestParam(required = false) Long projectId) {
        if (projectId != null) {
            return ResponseEntity.ok(testCaseRepository.findByProjectId(projectId));
        }
        return ResponseEntity.ok(testCaseRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<TestCase> createTestCase(@RequestBody TestCase testCase) {
        return ResponseEntity.status(HttpStatus.CREATED).body(testCaseRepository.save(testCase));
    }
}
