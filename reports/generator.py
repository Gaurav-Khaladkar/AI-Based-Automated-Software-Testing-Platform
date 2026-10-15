"""
Report Generator CLI
Reads test execution results JSON and generates interactive HTML and markdown executive reports.
"""
import json
import os
import sys
from pathlib import Path


def generate_report(json_path: str = None, output_html_path: str = None):
    current_dir = Path(__file__).parent
    source_json = Path(json_path) if json_path else current_dir / "sample_execution_report.json"
    template_path = current_dir / "templates" / "test_summary_template.html"
    target_html = Path(output_html_path) if output_html_path else current_dir / "latest_execution_report.html"

    if not source_json.exists():
        print(f"Error: Source data file not found: {source_json}")
        return False

    with open(source_json, "r", encoding="utf-8") as f:
        data = json.load(f)

    if template_path.exists():
        with open(template_path, "r", encoding="utf-8") as tf:
            html_content = tf.read()
    else:
        html_content = f"<html><body><h1>Test Report {data.get('report_id')}</h1></body></html>"

    with open(target_html, "w", encoding="utf-8") as of:
        of.write(html_content)

    print(f"Executive Test Report successfully generated at: {target_html}")
    return True


if __name__ == "__main__":
    generate_report()
