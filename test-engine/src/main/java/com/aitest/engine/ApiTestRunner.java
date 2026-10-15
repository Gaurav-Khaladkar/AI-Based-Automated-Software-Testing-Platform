package com.aitest.engine;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.HashMap;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Enterprise API Test Suite for AI Automated Testing Platform.
 * Validates backend controllers, user authentication, live job submission,
 * and AI engine machine learning endpoints.
 */
public class ApiTestRunner {

    private String backendUrl;
    private String aiEngineUrl;

    @BeforeClass
    public void setup() {
        backendUrl = System.getProperty("backend.url", "http://localhost:8080");
        aiEngineUrl = System.getProperty("ai.engine.url", "http://localhost:5000");
    }

    @Test(description = "Verify backend is responsive and live jobs endpoint returns JSON array")
    public void testBackendHealthAndLiveJobs() {
        given()
            .baseUri(backendUrl)
        .when()
            .get("/api/test-jobs")
        .then()
            .statusCode(anyOf(is(200), is(401)))
            .contentType(ContentType.JSON);
    }

    @Test(description = "Verify user registration contract handles valid payload")
    public void testUserRegistrationContract() {
        Map<String, String> userPayload = new HashMap<>();
        String testEmail = "test_qa_" + System.currentTimeMillis() + "@aitesting.io";
        userPayload.put("name", "Automation Robot");
        userPayload.put("email", testEmail);
        userPayload.put("password", "SecurePass123!");
        userPayload.put("role", "QA");

        given()
            .baseUri(backendUrl)
            .contentType(ContentType.JSON)
            .body(userPayload)
        .when()
            .post("/api/users/register")
        .then()
            .statusCode(anyOf(is(201), is(200)))
            .body("email", equalTo(testEmail))
            .body("$", not(hasKey("password"))); // Critical security assertion: password hash must never be returned
    }

    @Test(description = "Verify AI Engine health and active capabilities")
    public void testAiEngineHealth() {
        given()
            .baseUri(aiEngineUrl)
        .when()
            .get("/health")
        .then()
            .statusCode(200)
            .body("status", equalTo("UP"))
            .body("capabilities", hasItem("Bug Risk Prediction"))
            .body("capabilities", hasItem("NLP Test Case Generation"));
    }

    @Test(description = "Verify AI Bug Risk Prediction calculation")
    public void testAiRiskPrediction() {
        Map<String, Object> riskPayload = new HashMap<>();
        riskPayload.put("module", "PaymentGatewayService");
        riskPayload.put("loc", 1500);
        riskPayload.put("commits", 45);
        riskPayload.put("churn", 35.0);
        riskPayload.put("complexity", 22);

        given()
            .baseUri(aiEngineUrl)
            .contentType(ContentType.JSON)
            .body(riskPayload)
        .when()
            .post("/predict")
        .then()
            .statusCode(200)
            .body("risk_score", greaterThan(0.0f))
            .body("risk_level", isIn(new String[]{"LOW", "MEDIUM", "HIGH", "CRITICAL"}))
            .body("recommendation", notNullValue());
    }

    @Test(description = "Verify AI NLP Test Case Generation synthesizes structured test scenarios")
    public void testAiNlpTestGeneration() {
        Map<String, String> promptPayload = new HashMap<>();
        promptPayload.put("requirement", "User requests password reset link via SMS OTP verification");
        promptPayload.put("project_name", "AuthService");

        given()
            .baseUri(aiEngineUrl)
            .contentType(ContentType.JSON)
            .body(promptPayload)
        .when()
            .post("/generate-tests")
        .then()
            .statusCode(200)
            .body("status", equalTo("SUCCESS"))
            .body("total_generated", greaterThanOrEqualTo(2))
            .body("test_cases[0].steps", not(empty()));
    }

    @Test(description = "Verify Self-Healing locator recovers resilient element selector")
    public void testSelfHealingLocatorEngine() {
        Map<String, Object> healingPayload = new HashMap<>();
        healingPayload.put("selector", "#btn-payment-submit");

        Map<String, String> attributes = new HashMap<>();
        attributes.put("tag", "button");
        attributes.put("data-testid", "pay-submit-btn");
        attributes.put("text", "Authorize Payment");
        healingPayload.put("attributes", attributes);

        given()
            .baseUri(aiEngineUrl)
            .contentType(ContentType.JSON)
            .body(healingPayload)
        .when()
            .post("/self-heal")
        .then()
            .statusCode(200)
            .body("healed", equalTo(true))
            .body("recommended_selector", equalTo("[data-testid='pay-submit-btn']"))
            .body("confidence", greaterThan(0.9f));
    }
}
