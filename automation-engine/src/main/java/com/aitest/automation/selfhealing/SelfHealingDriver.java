package com.aitest.automation.selfhealing;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

/**
 * Intelligent Wrapper for WebDriver implementing AI Self-Healing Locator Fallbacks.
 * Intercepts NoSuchElementException, queries the AI Engine microservice, and seamlessly
 * resolves alternative locators to maintain test execution continuity.
 */
public class SelfHealingDriver {

    private final WebDriver delegate;
    private final String aiEngineEndpoint;

    public SelfHealingDriver(WebDriver delegate) {
        this(delegate, "http://localhost:5000/self-heal");
    }

    public SelfHealingDriver(WebDriver delegate, String aiEngineEndpoint) {
        this.delegate = delegate;
        this.aiEngineEndpoint = aiEngineEndpoint;
    }

    public WebElement findElementWithHealing(By primaryLocator, String fallbackText, String tag) {
        try {
            return delegate.findElement(primaryLocator);
        } catch (NoSuchElementException ex) {
            System.err.println("[AI Self-Healing] Primary locator failed: " + primaryLocator);
            System.out.println("[AI Self-Healing] Querying AI Engine for healed resilient locator...");

            By healedLocator = requestHealedLocator(primaryLocator.toString(), fallbackText, tag);
            if (healedLocator != null) {
                try {
                    WebElement healedElement = delegate.findElement(healedLocator);
                    System.out.println("[AI Self-Healing] Successfully recovered element using: " + healedLocator);
                    return healedElement;
                } catch (Exception retryEx) {
                    System.err.println("[AI Self-Healing] Healed locator also failed: " + healedLocator);
                }
            }
            throw ex;
        }
    }

    private By requestHealedLocator(String failedSelector, String text, String tag) {
        try {
            URL url = new URL(aiEngineEndpoint);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            conn.setConnectTimeout(2000);
            conn.setReadTimeout(2000);

            String jsonPayload = String.format(
                "{\"selector\":\"%s\",\"attributes\":{\"tag\":\"%s\",\"text\":\"%s\",\"data-testid\":\"submit-order-btn\"}}",
                failedSelector.replace("\"", "\\\""), tag, text
            );

            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonPayload.getBytes(StandardCharsets.UTF_8));
            }

            if (conn.getResponseCode() == 200) {
                try (Scanner scanner = new Scanner(conn.getInputStream(), StandardCharsets.UTF_8)) {
                    String response = scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
                    if (response.contains("\"recommended_selector\"")) {
                        // Extract recommended selector
                        int start = response.indexOf("\"recommended_selector\":\"") + 24;
                        int end = response.indexOf("\"", start);
                        String selector = response.substring(start, end);

                        if (selector.startsWith("//")) {
                            return By.xpath(selector);
                        } else {
                            return By.cssSelector(selector);
                        }
                    }
                }
            }
        } catch (Exception ignored) {
            // Fallback to resilient text contains XPath if AI Engine offline
            if (text != null && !text.isEmpty()) {
                return By.xpath("//" + tag + "[contains(text(), '" + text + "')]");
            }
        }
        return null;
    }

    public WebDriver getDelegate() {
        return delegate;
    }
}
