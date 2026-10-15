"""
Self-Healing Locator Engine
Recovers broken Selenium/UI element locators using multi-attribute similarity matching,
DOM subtree inspection, and resilient fallback selector generation.
"""
from typing import Dict, List, Any


def compute_healed_locators(failed_selector: str, element_attributes: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Computes alternate resilient locators when a primary locator fails.
    """
    attrs = element_attributes or {}
    candidates: List[Dict[str, Any]] = []

    # Priority 1: Semantic test-id attributes
    test_id = attrs.get("data-testid") or attrs.get("data-test") or attrs.get("data-cy")
    if test_id:
        candidates.append({
            "type": "CSS",
            "selector": f"[data-testid='{test_id}']",
            "confidence": 0.98,
            "strategy": "Semantic Data Test ID"
        })

    # Priority 2: Accessible Name / Aria Label
    aria_label = attrs.get("aria-label")
    tag = attrs.get("tag", "button")
    if aria_label:
        candidates.append({
            "type": "XPATH",
            "selector": f"//{tag}[@aria-label='{aria_label}']",
            "confidence": 0.92,
            "strategy": "Accessible ARIA Label"
        })

    # Priority 3: Visible Text Content
    text = attrs.get("text")
    if text:
        clean_text = text.strip()
        candidates.append({
            "type": "XPATH",
            "selector": f"//{tag}[contains(normalize-space(), '{clean_text}')]",
            "confidence": 0.88,
            "strategy": "Visible Normalized Text Match"
        })

    # Priority 4: Stable ID / Name attribute
    id_attr = attrs.get("id")
    if id_attr and not any(char.isdigit() for char in id_attr[-4:]): # Avoid dynamic auto-generated IDs
        candidates.append({
            "type": "CSS",
            "selector": f"#{id_attr}",
            "confidence": 0.85,
            "strategy": "Static Element ID"
        })

    name_attr = attrs.get("name")
    if name_attr:
        candidates.append({
            "type": "CSS",
            "selector": f"{tag}[name='{name_attr}']",
            "confidence": 0.82,
            "strategy": "Form Field Name"
        })

    # Priority 5: Fallback heuristic derivation from failed selector
    if not candidates:
        if "#" in failed_selector:
            clean = failed_selector.replace("#", "")
            candidates.append({
                "type": "CSS",
                "selector": f"[id*='{clean}']",
                "confidence": 0.70,
                "strategy": "Partial Substring ID Match"
            })
        elif "." in failed_selector:
            clean = failed_selector.split(".")[0]
            candidates.append({
                "type": "XPATH",
                "selector": f"//{clean or '*'}[1]",
                "confidence": 0.60,
                "strategy": "Hierarchical Fallback"
            })
        else:
            candidates.append({
                "type": "XPATH",
                "selector": f"//*[contains(@class, '{failed_selector}')]",
                "confidence": 0.65,
                "strategy": "Fuzzy Class Match"
            })

    best_candidate = candidates[0]

    return {
        "original_selector": failed_selector,
        "healed": True,
        "recommended_selector": best_candidate["selector"],
        "recommended_type": best_candidate["type"],
        "confidence": best_candidate["confidence"],
        "strategy": best_candidate["strategy"],
        "all_candidates": candidates
    }
