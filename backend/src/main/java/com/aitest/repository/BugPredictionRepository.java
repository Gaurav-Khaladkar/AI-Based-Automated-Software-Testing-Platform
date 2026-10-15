package com.aitest.repository;

import com.aitest.entity.BugPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BugPredictionRepository extends JpaRepository<BugPrediction, Long> {
    List<BugPrediction> findByProjectId(Long projectId);
}
