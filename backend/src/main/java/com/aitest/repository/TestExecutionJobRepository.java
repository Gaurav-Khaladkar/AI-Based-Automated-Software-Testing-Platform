package com.aitest.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aitest.entity.TestExecutionJob;

public interface TestExecutionJobRepository extends JpaRepository<TestExecutionJob, Long> {
    List<TestExecutionJob> findTop50ByOrderByCreatedAtDesc();
}
