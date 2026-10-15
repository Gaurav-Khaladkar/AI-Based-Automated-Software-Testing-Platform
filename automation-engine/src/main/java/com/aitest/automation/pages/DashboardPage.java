package com.aitest.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * Page Object Model representing the Real-Time Automation Dashboard View.
 */
public class DashboardPage {

    private final WebDriver driver;

    private final By overviewTab = By.xpath("//button[contains(text(), 'Overview')]");
    private final By projectsTab = By.xpath("//button[contains(text(), 'Projects')]");
    private final By testRunsTab = By.xpath("//button[contains(text(), 'Test Runs')]");
    private final By aiInsightsTab = By.xpath("//button[contains(text(), 'AI Insights')]");

    private final By repoUrlInput = By.cssSelector("input[placeholder*='github.com']");
    private final By runLiveButton = By.xpath("//button[contains(text(), 'Run Tests') or contains(text(), 'Upload')]");
    private final By jobRows = By.cssSelector(".job-item, .run-card, tr");
    private final By logViewer = By.cssSelector(".log-console, pre, .terminal-body");

    public DashboardPage(WebDriver driver) {
        this.driver = driver;
    }

    public void selectTab(String tabName) {
        By locator = By.xpath("//button[contains(text(), '" + tabName + "')]");
        driver.findElement(locator).click();
    }

    public void submitRepositoryForTesting(String repoUrl) {
        selectTab("Projects");
        WebElement input = driver.findElement(repoUrlInput);
        input.clear();
        input.sendKeys(repoUrl);
        driver.findElement(runLiveButton).click();
    }

    public int getVisibleJobCount() {
        List<WebElement> elements = driver.findElements(jobRows);
        return elements.size();
    }

    public boolean isLogConsoleVisible() {
        return driver.findElements(logViewer).size() > 0;
    }
}
