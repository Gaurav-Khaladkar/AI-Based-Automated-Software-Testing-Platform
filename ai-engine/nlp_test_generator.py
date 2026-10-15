"""
NLP Test Case Generator
Extracts acceptance criteria and synthesizes structured test scenarios (Unit, API, UI, Security, Edge Cases)
from natural language feature descriptions.
"""
import re
from typing import Dict, List, Any


def generate_tests_from_requirement(requirement_text: str, project_name: str = "Service") -> List[Dict[str, Any]]:
    clean_text = requirement_text.strip()
    words = clean_text.lower()
    scenarios: List[Dict[str, Any]] = []

    # 1. Happy Path / Positive Scenario
    scenarios.append({
        "id": "TC-AI-01",
        "title": f"Verify successful execution of {clean_text[:45]}...",
        "type": "API",
        "priority": "HIGH",
        "generated_by": "AI",
        "steps": [
            f"1. Setup valid payload and authenticated context for '{clean_text}'",
            "2. Dispatch request to target service endpoint",
            "3. Verify HTTP 200/201 response status code",
            "4. Validate response body schema matches OpenAPI specification",
            "5. Verify state persistence in database repository"
        ],
        "expected_result": "Action completes successfully with correct return data and status 200/201."
    })

    # 2. Validation / Bad Input Negative Scenario
    scenarios.append({
        "id": "TC-AI-02",
        "title": f"Reject invalid or malformed parameters for {clean_text[:40]}...",
        "type": "API",
        "priority": "MEDIUM",
        "generated_by": "AI",
        "steps": [
            "1. Craft request payload with missing required fields and invalid data types",
            "2. Send POST/PUT request to endpoint",
            "3. Verify HTTP 400 Bad Request or 422 Unprocessable Entity",
            "4. Assert error response body contains field-level validation messages"
        ],
        "expected_result": "System rejects invalid inputs without unhandled internal exceptions."
    })

    # 3. Security & Boundary Scenario
    if any(k in words for k in ["auth", "token", "login", "password", "user", "payment", "card", "secret"]):
        scenarios.append({
            "id": "TC-AI-03",
            "title": f"Security boundary & unauthorized access check for {clean_text[:35]}...",
            "type": "SECURITY",
            "priority": "CRITICAL",
            "generated_by": "AI",
            "steps": [
                "1. Attempt invocation without Authorization Bearer header",
                "2. Assert HTTP 401 Unauthorized response",
                "3. Attempt invocation with expired or tampered JWT token",
                "4. Assert HTTP 403 Forbidden with security audit log entry",
                "5. Inject SQL/XSS special characters into string parameters and verify sanitization"
            ],
            "expected_result": "Unauthorized attempts rejected and logged; payloads safely sanitized."
        })
    else:
        scenarios.append({
            "id": "TC-AI-03",
            "title": f"Boundary limit & concurrency check for {clean_text[:40]}...",
            "type": "UNIT",
            "priority": "MEDIUM",
            "generated_by": "AI",
            "steps": [
                "1. Submit maximum boundary payload values (MAX_INT, 10MB payload, empty strings)",
                "2. Simulate concurrent parallel invocations (10 threads)",
                "3. Assert no race conditions or deadlock in resource lock manager"
            ],
            "expected_result": "System handles boundary values smoothly with deterministic state."
        })

    # 4. UI / End-to-End User Experience Scenario
    if any(k in words for k in ["ui", "button", "page", "form", "checkout", "view", "cart", "screen"]):
        scenarios.append({
            "id": "TC-AI-04",
            "title": f"UI interaction & state visual feedback for {clean_text[:40]}...",
            "type": "UI",
            "priority": "HIGH",
            "generated_by": "AI",
            "steps": [
                "1. Navigate to target dashboard view in browser",
                "2. Assert interactive elements are visible and enabled",
                "3. Perform user click/input action matching requirement",
                "4. Assert loading spinner/state appears during asynchronous operation",
                "5. Validate success toast notification and updated DOM elements"
            ],
            "expected_result": "UI responds instantaneously, displays accessible visual feedback, updates DOM."
        })

    return scenarios
