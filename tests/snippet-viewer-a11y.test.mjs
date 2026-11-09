import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("SnippetViewer includes accessible attributes for copy buttons and notification", () => {
  const filePath = path.resolve("src/components/hub/SnippetViewer.jsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Icon-only copy button must have an aria-label
  assert.ok(
    content.includes('aria-label={copied ? "Copied snippet code" : "Copy snippet code"}') ||
    content.includes('aria-label="Copy snippet code"'),
    "Icon-only copy button must have aria-label"
  );

  // Icon-only copy button should have a title for native tooltip
  assert.ok(
    content.includes('title={copied ? "Copied" : "Copy code"}') ||
    content.includes('title="Copy code"'),
    "Icon-only copy button must have title for tooltip"
  );

  // Dynamic feedback notification must have role="status" and aria-live="polite"
  assert.ok(
    content.includes('role="status"'),
    "Feedback notification should include role=\"status\""
  );
  assert.ok(
    content.includes('aria-live="polite"'),
    "Feedback notification should include aria-live=\"polite\""
  );
});
