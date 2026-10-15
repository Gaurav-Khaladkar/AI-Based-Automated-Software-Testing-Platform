"""
Smart Regression Test Selector
Performs Test Impact Analysis (TIA) by mapping modified source files
to relevant test cases, prioritizing high-risk modules and minimizing execution time.
"""
from typing import Dict, List, Any


def select_impacted_tests(changed_files: List[str], all_test_cases: List[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Given a list of changed files from git diff, e.g. ['src/payments/PaymentService.java']
    returns the optimized minimal regression test suite.
    """
    default_tests = all_test_cases or [
        {"id": "TC-PAY-01", "name": "PaymentIntentTest", "module": "payments", "priority": "HIGH"},
        {"id": "TC-PAY-02", "name": "StripeWebhookIntegrationTest", "module": "payments", "priority": "CRITICAL"},
        {"id": "TC-AUTH-01", "name": "JwtTokenRefreshTest", "module": "auth", "priority": "HIGH"},
        {"id": "TC-AUTH-02", "name": "RateLimitingSecurityTest", "module": "auth", "priority": "CRITICAL"},
        {"id": "TC-CART-01", "name": "CartCheckoutFlowTest", "module": "cart", "priority": "MEDIUM"},
        {"id": "TC-USER-01", "name": "UserProfileUpdateTest", "module": "user", "priority": "LOW"},
    ]

    selected_tests = []
    impacted_modules = set()

    for file_path in changed_files:
        path_lower = file_path.lower()
        if "payment" in path_lower or "billing" in path_lower or "stripe" in path_lower:
            impacted_modules.add("payments")
        if "auth" in path_lower or "jwt" in path_lower or "security" in path_lower or "user" in path_lower:
            impacted_modules.add("auth")
            impacted_modules.add("user")
        if "cart" in path_lower or "checkout" in path_lower or "order" in path_lower:
            impacted_modules.add("cart")

    if not impacted_modules:
        # If no specific module detected, select smoke test set
        impacted_modules.add("payments")
        impacted_modules.add("auth")

    for tc in default_tests:
        if tc.get("module") in impacted_modules or tc.get("priority") == "CRITICAL":
            selected_tests.append(tc)

    total_available = len(default_tests)
    selected_count = len(selected_tests)
    time_saved_percent = round((1.0 - (selected_count / max(total_available, 1))) * 100, 1)

    return {
        "changed_files_count": len(changed_files),
        "impacted_modules": list(impacted_modules),
        "total_test_suite_size": total_available,
        "selected_test_count": selected_count,
        "time_saved_percent": max(time_saved_percent, 0.0),
        "recommended_tests": selected_tests
    }
