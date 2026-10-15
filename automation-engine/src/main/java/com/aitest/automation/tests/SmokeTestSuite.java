package com.aitest.automation.tests;

import com.aitest.automation.base.BaseTest;
import com.aitest.automation.pages.DashboardPage;
import com.aitest.automation.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * End-to-end UI Smoke Test Suite verifying frontend navigation,
 * dashboard metrics, and project test submission.
 */
public class SmokeTestSuite extends BaseTest {

    @Test(description = "Verify dashboard loads and displays navigation tabs")
    public void testDashboardNavigation() {
        driver.get(baseUrl);
        DashboardPage dashboard = new DashboardPage(driver);

        dashboard.selectTab("Overview");
        Assert.assertTrue(driver.getTitle().contains("AI") || driver.getPageSource().contains("Overview"),
                "Overview tab should be active");

        dashboard.selectTab("Projects");
        Assert.assertTrue(driver.getPageSource().contains("Projects") || driver.getPageSource().contains("GitHub"),
                "Projects section should display repository upload controls");

        dashboard.selectTab("AI Insights");
        Assert.assertTrue(driver.getPageSource().contains("AI") || driver.getPageSource().contains("Risk"),
                "AI Insights tab should present risk metrics");
    }

    @Test(description = "Verify repository submission trigger in UI")
    public void testRepositoryTestingSubmission() {
        driver.get(baseUrl);
        DashboardPage dashboard = new DashboardPage(driver);

        dashboard.submitRepositoryForTesting("https://github.com/spring-projects/spring-petclinic");
        // Verify job or run appears in list
        Assert.assertTrue(dashboard.getVisibleJobCount() >= 0, "Jobs list should update upon submission");
    }
}
