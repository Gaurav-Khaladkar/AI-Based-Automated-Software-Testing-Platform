package com.aitest.engine;

import java.util.List;

/**
 * Evaluates execution logs and status transitions across consecutive runs
 * to quantify test flakiness risk.
 */
public class FlakyTestAnalyzer {

    public static class FlakinessVerdict {
        public String testName;
        public double flakinessScore; // 0 to 100
        public boolean isFlaky;
        public int statusFlips;
        public String recommendation;
    }

    public static FlakinessVerdict evaluate(String testName, List<String> statuses) {
        FlakinessVerdict verdict = new FlakinessVerdict();
        verdict.testName = testName;

        if (statuses == null || statuses.size() < 2) {
            verdict.flakinessScore = 0.0;
            verdict.isFlaky = false;
            verdict.recommendation = "Insufficient data points to assess flakiness.";
            return verdict;
        }

        int flips = 0;
        for (int i = 1; i < statuses.size(); i++) {
            if (!statuses.get(i).equalsIgnoreCase(statuses.get(i - 1))) {
                flips++;
            }
        }

        verdict.statusFlips = flips;
        double flipRatio = (double) flips / (statuses.size() - 1);
        verdict.flakinessScore = Math.min(100.0, Math.round(flipRatio * 100.0 * 10.0) / 10.0);
        verdict.isFlaky = verdict.flakinessScore >= 30.0;

        if (verdict.isFlaky) {
            verdict.recommendation = "Quarantine test from blocker gates. Investigate async await timers or shared state pollution.";
        } else {
            verdict.recommendation = "Test shows stable, repeatable assertions.";
        }

        return verdict;
    }
}
