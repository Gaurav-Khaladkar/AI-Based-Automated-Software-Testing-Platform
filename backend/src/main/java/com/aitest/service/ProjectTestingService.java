package com.aitest.service;

import java.io.File;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.aitest.dto.TestRunRequest;
import com.aitest.dto.TestRunResponse;
import com.aitest.entity.TestExecutionJob;
import com.aitest.repository.TestExecutionJobRepository;

@Service
public class ProjectTestingService {

    private static final int MAX_LOG_CHARS = 120_000;
    private static final Duration CLONE_TIMEOUT = Duration.ofMinutes(3);
    private static final Duration INSTALL_TIMEOUT = Duration.ofMinutes(10);
    private static final Duration TEST_TIMEOUT = Duration.ofMinutes(20);

    private final TestExecutionJobRepository repository;
    private final Path workspaceRoot;

    public ProjectTestingService(TestExecutionJobRepository repository) {
        this.repository = repository;
        this.workspaceRoot = Paths.get(System.getProperty("java.io.tmpdir"), "aitest-testing-workspaces");
    }

    public TestRunResponse queueRun(TestRunRequest request) {
        String repositoryUrl = normalizeGithubUrl(request.getRepositoryUrl());

        TestExecutionJob job = new TestExecutionJob();
        job.setRepositoryUrl(repositoryUrl);
        job.setProjectName(extractProjectName(repositoryUrl));
        job.setStatus("QUEUED");
        job.setFramework("PENDING");
        job.setCreatedAt(LocalDateTime.now());
        job.setLogOutput("Job queued.\n");
        repository.save(job);

        CompletableFuture.runAsync(() -> executeJob(job.getId()));
        return TestRunResponse.fromEntity(job);
    }

    public List<TestRunResponse> listJobs() {
        return repository.findTop50ByOrderByCreatedAtDesc()
            .stream()
            .map(job -> TestRunResponse.fromEntity(job, false))
            .toList();
    }

    public TestRunResponse getJob(Long jobId) {
        TestExecutionJob job = repository.findById(jobId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        return TestRunResponse.fromEntity(job);
    }

    private void executeJob(Long jobId) {
        Optional<TestExecutionJob> optionalJob = repository.findById(jobId);
        if (optionalJob.isEmpty()) {
            return;
        }

        TestExecutionJob job = optionalJob.get();
        long startedEpochMs = System.currentTimeMillis();
        Path jobDirectory = workspaceRoot.resolve("job-" + jobId + "-" + startedEpochMs);
        Path repositoryDirectory = jobDirectory.resolve("repo");

        try {
            Files.createDirectories(workspaceRoot);
            Files.createDirectories(jobDirectory);

            job.setStatus("RUNNING");
            job.setStartedAt(LocalDateTime.now());
            appendLog(job, "Starting execution...\n");
            repository.save(job);

            CommandResult cloneResult = runCommand(
                List.of("git", "clone", "--depth", "1", job.getRepositoryUrl(), repositoryDirectory.toString()),
                jobDirectory,
                CLONE_TIMEOUT,
                Map.of()
            );
            appendLog(job, formatCommandOutput(List.of("git", "clone", "--depth", "1", job.getRepositoryUrl(), "repo"), cloneResult));
            repository.save(job);

            if (cloneResult.timedOut() || cloneResult.exitCode() != 0) {
                markFailed(job, "ERROR", "Repository clone failed", startedEpochMs);
                return;
            }

            ExecutionPlan plan = detectExecutionPlan(repositoryDirectory);
            job.setFramework(plan.framework());
            job.setCommandUsed(String.join(" ", plan.testCommand()));
            appendLog(job, "Detected framework " + plan.framework() + " in " + plan.workingDirectory() + "\n");
            repository.save(job);

            if (!plan.installCommand().isEmpty()) {
                CommandResult installResult = runCommand(plan.installCommand(), plan.workingDirectory(), INSTALL_TIMEOUT, plan.env());
                appendLog(job, formatCommandOutput(plan.installCommand(), installResult));
                repository.save(job);

                if (installResult.timedOut() || installResult.exitCode() != 0) {
                    markFailed(job, "FAILED", "Dependency installation failed", startedEpochMs);
                    return;
                }
            }

            CommandResult testResult = runCommand(plan.testCommand(), plan.workingDirectory(), TEST_TIMEOUT, plan.env());
            appendLog(job, formatCommandOutput(plan.testCommand(), testResult));

            if (testResult.timedOut()) {
                markFailed(job, "FAILED", "Test execution timed out", startedEpochMs);
                return;
            }

            job.setStatus(testResult.exitCode() == 0 ? "PASSED" : "FAILED");
            job.setErrorMessage(testResult.exitCode() == 0 ? null : "One or more tests failed");
            job.setFinishedAt(LocalDateTime.now());
            job.setDurationMs(System.currentTimeMillis() - startedEpochMs);
            repository.save(job);
        } catch (IllegalArgumentException ex) {
            markFailed(job, "ERROR", ex.getMessage(), startedEpochMs);
        } catch (Exception ex) {
            appendLog(job, "Unexpected error: " + ex.getMessage() + "\n");
            markFailed(job, "ERROR", "Unexpected executor error", startedEpochMs);
        } finally {
            cleanupDirectory(jobDirectory);
        }
    }

    private ExecutionPlan detectExecutionPlan(Path repositoryDirectory) {
        Path pom = findFirstFile(repositoryDirectory, "pom.xml", 4);
        Path packageJson = findFirstFile(repositoryDirectory, "package.json", 4);
        Path requirements = findFirstFile(repositoryDirectory, "requirements.txt", 4);
        Path pyproject = findFirstFile(repositoryDirectory, "pyproject.toml", 4);

        if (pom != null) {
            Path workingDirectory = pom.getParent();
            List<String> command = Files.exists(workingDirectory.resolve("mvnw"))
                ? List.of("./mvnw", "test")
                : List.of("mvn", "test");
            return new ExecutionPlan("MAVEN", workingDirectory, List.of(), command, Map.of());
        }

        if (packageJson != null) {
            Path workingDirectory = packageJson.getParent();
            return new ExecutionPlan(
                "NODE",
                workingDirectory,
                List.of("npm", "install", "--no-audit", "--no-fund"),
                List.of("npm", "test", "--", "--watch=false"),
                Map.of("CI", "true")
            );
        }

        if (requirements != null || pyproject != null) {
            Path workingDirectory = requirements != null ? requirements.getParent() : pyproject.getParent();
            List<String> install = requirements != null
                ? List.of("pip3", "install", "-r", "requirements.txt")
                : List.of();

            return new ExecutionPlan(
                "PYTHON",
                workingDirectory,
                install,
                List.of("python3", "-m", "pytest"),
                Map.of()
            );
        }

        throw new IllegalArgumentException("Unsupported project type. Expected pom.xml, package.json, or requirements.txt/pyproject.toml");
    }

    private CommandResult runCommand(List<String> command, Path workingDirectory, Duration timeout, Map<String, String> env)
        throws IOException, InterruptedException {
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.directory(workingDirectory.toFile());
        processBuilder.redirectErrorStream(true);
        processBuilder.environment().putAll(env);

        Process process = processBuilder.start();
        StringBuilder output = new StringBuilder();

        Thread reader = new Thread(() -> {
            try (BufferedReader bufferedReader = new BufferedReader(
                new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = bufferedReader.readLine()) != null) {
                    appendText(output, line + System.lineSeparator());
                }
            } catch (IOException ignored) {
            }
        });
        reader.setDaemon(true);
        reader.start();

        boolean finished = process.waitFor(timeout.toSeconds(), TimeUnit.SECONDS);
        if (!finished) {
            process.destroyForcibly();
        }

        reader.join(2000);
        int exitCode = finished ? process.exitValue() : -1;
        return new CommandResult(exitCode, output.toString(), !finished);
    }

    private Path findFirstFile(Path root, String fileName, int maxDepth) {
        try (Stream<Path> pathStream = Files.walk(root, maxDepth)) {
            return pathStream
                .filter(path -> Files.isRegularFile(path) && path.getFileName().toString().equals(fileName))
                .filter(path -> !path.toString().contains(File.separator + ".git" + File.separator))
                .findFirst()
                .orElse(null);
        } catch (IOException ex) {
            return null;
        }
    }

    private void appendText(StringBuilder target, String text) {
        int remaining = MAX_LOG_CHARS - target.length();
        if (remaining <= 0) {
            return;
        }
        if (text.length() <= remaining) {
            target.append(text);
        } else {
            target.append(text, 0, remaining);
        }
    }

    private void appendLog(TestExecutionJob job, String addition) {
        String current = job.getLogOutput() == null ? "" : job.getLogOutput();
        String combined = current + addition;
        if (combined.length() > MAX_LOG_CHARS) {
            combined = combined.substring(combined.length() - MAX_LOG_CHARS);
        }
        job.setLogOutput(combined);
    }

    private String formatCommandOutput(List<String> command, CommandResult result) {
        StringBuilder builder = new StringBuilder();
        builder.append("$ ").append(String.join(" ", command)).append("\n");
        builder.append(result.output());
        if (result.timedOut()) {
            builder.append("\nCommand timed out.\n");
        } else {
            builder.append("\nExit code: ").append(result.exitCode()).append("\n");
        }
        return builder.toString();
    }

    private void markFailed(TestExecutionJob job, String status, String errorMessage, long startedEpochMs) {
        job.setStatus(status);
        job.setErrorMessage(errorMessage);
        job.setFinishedAt(LocalDateTime.now());
        job.setDurationMs(System.currentTimeMillis() - startedEpochMs);
        repository.save(job);
    }

    private String normalizeGithubUrl(String repositoryUrl) {
        String trimmed = repositoryUrl == null ? "" : repositoryUrl.trim();
        if (!trimmed.startsWith("https://github.com/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Repository URL must start with https://github.com/");
        }
        return trimmed.endsWith(".git") ? trimmed : trimmed + ".git";
    }

    private String extractProjectName(String repositoryUrl) {
        String normalized = repositoryUrl.endsWith(".git")
            ? repositoryUrl.substring(0, repositoryUrl.length() - 4)
            : repositoryUrl;
        int index = normalized.lastIndexOf('/');
        if (index < 0 || index == normalized.length() - 1) {
            return "unknown-project";
        }
        return normalized.substring(index + 1);
    }

    private void cleanupDirectory(Path directory) {
        if (directory == null || !Files.exists(directory)) {
            return;
        }
        try (Stream<Path> pathStream = Files.walk(directory)) {
            pathStream
                .sorted(Comparator.reverseOrder())
                .forEach(path -> {
                    try {
                        Files.deleteIfExists(path);
                    } catch (IOException ignored) {
                    }
                });
        } catch (IOException ignored) {
        }
    }

    private record CommandResult(int exitCode, String output, boolean timedOut) {
    }

    private record ExecutionPlan(
        String framework,
        Path workingDirectory,
        List<String> installCommand,
        List<String> testCommand,
        Map<String, String> env
    ) {
    }
}
