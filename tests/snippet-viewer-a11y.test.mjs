import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("SnippetViewer component provides accessible copy buttons and status announcements", () => {
  const filePath = path.resolve("src/components/hub/SnippetViewer.jsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Verify icon-only copy button has aria-label and title
  assert.ok(
    content.includes('aria-label={copied ? "Copied snippet" : "Copy snippet"}'),
    "SnippetViewer buttons must have descriptive aria-label"
  );
  assert.ok(
    content.includes('title={copied ? "Copied" : "Copy snippet"}'),
    "Icon-only copy button must have tooltip title attribute"
  );

  // Verify status alert attributes for screen readers
  assert.ok(
    content.includes('role="status" aria-live="polite"'),
    "Copied feedback notification must have role='status' and aria-live='polite'"
  );
});
