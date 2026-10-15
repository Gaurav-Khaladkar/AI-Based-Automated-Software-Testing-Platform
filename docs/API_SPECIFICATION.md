# REST API Specification Reference

Comprehensive API reference for the **AI-Based Automated Software Testing Platform**.

Base URLs:
- **Backend Core:** `http://localhost:8080/api`
- **AI Intelligence Engine:** `http://localhost:5000`

---

## 1. Authentication & Users

### `POST /api/users/register`
Registers a new platform user with encrypted credentials.

**Request Body:**
```json
{
  "name": "Sarah Chen",
  "email": "sarah.chen@company.com",
  "password": "SecurePassword123!",
  "role": "DEV"
}
```

**Response (`201 Created`):**
```json
{
  "id": 4,
  "name": "Sarah Chen",
  "email": "sarah.chen@company.com",
  "role": "DEV",
  "status": "ACTIVE",
  "createdAt": "2026-10-15T22:30:00Z"
}
```
*(Note: Password hashes are strictly omitted from responses for security)*

---

## 2. Live Project Testing

### `POST /api/projects/test-live`
Clones a public or private GitHub repository, detects project tech stack, runs tests, and stores logs.

**Request Body:**
```json
{
  "repositoryUrl": "https://github.com/spring-projects/spring-petclinic"
}
```

**Response (`200 OK`):**
```json
{
  "id": 12,
  "repositoryUrl": "https://github.com/spring-projects/spring-petclinic",
  "status": "RUNNING",
  "techStack": "MAVEN",
  "createdAt": "2026-10-15T22:31:00Z",
  "logOutput": "Cloning repository into temporary workspace...\nDetecting build tool: pom.xml detected (MAVEN)..."
}
```

### `GET /api/test-jobs`
Retrieves all historical and live test execution jobs.

**Response (`200 OK`):**
```json
[
  {
    "id": 12,
    "repositoryUrl": "https://github.com/spring-projects/spring-petclinic",
    "status": "COMPLETED",
    "executionTimeMs": 42000,
    "createdAt": "2026-10-15T22:31:00Z"
  }
]
```

### `GET /api/test-jobs/{id}`
Fetches details and full console log stream for a specific job.

---

## 3. AI Intelligence Microservice

### `POST http://localhost:5000/predict`
Computes bug risk score and module vulnerability index.

**Request Body:**
```json
{
  "module": "CheckoutEngine",
  "loc": 1850,
  "commits": 52,
  "churn": 44.0,
  "complexity": 28
}
```

**Response (`200 OK`):**
```json
{
  "module": "CheckoutEngine",
  "risk_score": 86.4,
  "risk_level": "CRITICAL",
  "confidence": 94.2,
  "recommendation": "Immediate QA focus required. High commit churn and complexity indicate potential defect cluster.",
  "model_loaded": true
}
```

### `POST http://localhost:5000/generate-tests`
Synthesizes structured BDD/API test cases from natural language requirements.

**Request Body:**
```json
{
  "requirement": "User updates delivery address with postal code validation and geocoding lookup",
  "project_name": "LogisticsService"
}
```

**Response (`200 OK`):**
```json
{
  "status": "SUCCESS",
  "requirement": "User updates delivery address with postal code validation and geocoding lookup",
  "total_generated": 3,
  "test_cases": [
    {
      "id": "TC-AI-01",
      "title": "Verify successful execution of User updates delivery address with postal code validation and geocoding lookup...",
      "type": "API",
      "priority": "HIGH",
      "steps": [
        "1. Setup valid payload and authenticated context for 'User updates delivery address...'",
        "2. Dispatch request to target service endpoint",
        "3. Verify HTTP 200/201 response status code",
        "4. Validate response body schema matches OpenAPI specification",
        "5. Verify state persistence in database repository"
      ],
      "expected_result": "Action completes successfully with correct return data and status 200/201."
    }
  ]
}
```

### `POST http://localhost:5000/self-heal`
Recovers broken element locators dynamically.

**Request Body:**
```json
{
  "selector": "#submit-btn-legacy",
  "attributes": {
    "tag": "button",
    "data-testid": "submit-order-button",
    "text": "Place Order"
  }
}
```

**Response (`200 OK`):**
```json
{
  "original_selector": "#submit-btn-legacy",
  "healed": true,
  "recommended_selector": "[data-testid='submit-order-button']",
  "recommended_type": "CSS",
  "confidence": 0.98,
  "strategy": "Semantic Data Test ID"
}
```
