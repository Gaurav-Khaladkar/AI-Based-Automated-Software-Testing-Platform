package com.aitest.controller;

import com.aitest.entity.BugPrediction;
import com.aitest.repository.BugPredictionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "*")
public class BugPredictionController {

    private final BugPredictionRepository repository;

    public BugPredictionController(BugPredictionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<BugPrediction>> listPredictions(@RequestParam(required = false) Long projectId) {
        if (projectId != null) {
            return ResponseEntity.ok(repository.findByProjectId(projectId));
        }
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    public ResponseEntity<BugPrediction> savePrediction(@RequestBody BugPrediction prediction) {
        return ResponseEntity.ok(repository.save(prediction));
    }
}
