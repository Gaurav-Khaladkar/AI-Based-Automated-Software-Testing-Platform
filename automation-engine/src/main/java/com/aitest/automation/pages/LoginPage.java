package com.aitest.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

/**
 * Page Object Model representing the Authentication & Login View.
 */
public class LoginPage {

    private final WebDriver driver;

    private final By emailInput = By.cssSelector("input[type='email'], #email");
    private final By passwordInput = By.cssSelector("input[type='password'], #password");
    private final By loginButton = By.cssSelector("button[type='submit'], .btn-login");
    private final By roleBadge = By.cssSelector(".role-badge, .badge");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }

    public void navigateTo(String baseUrl) {
        driver.get(baseUrl);
    }

    public void enterEmail(String email) {
        WebElement el = driver.findElement(emailInput);
        el.clear();
        el.sendKeys(email);
    }

    public void enterPassword(String password) {
        WebElement el = driver.findElement(passwordInput);
        el.clear();
        el.sendKeys(password);
    }

    public void clickLogin() {
        driver.findElement(loginButton).click();
    }

    public void loginAs(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        clickLogin();
    }
}
