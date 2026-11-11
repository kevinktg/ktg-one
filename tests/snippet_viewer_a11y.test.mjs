import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("SnippetViewer includes accessible attributes on copy controls and feedback", () => {
  const filePath = path.resolve("src/components/hub/SnippetViewer.jsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Verify icon-only copy button and header copy button have dynamic aria-label
  assert.ok(
    content.includes('aria-label={copied ? "Copied snippet to clipboard" : "Copy snippet to clipboard"}'),
    "Expected copy button to include dynamic aria-label"
  );

  // Verify icon-only button has title attribute for visual tooltip
  assert.ok(
    content.includes('title={copied ? "Copied" : "Copy to clipboard"}'),
    "Expected icon-only button to include title attribute"
  );

  // Verify dynamic feedback notification includes role="status" and aria-live="polite"
  assert.ok(
    content.includes('role="status"'),
    "Expected feedback toast/card to include role='status'"
  );
  assert.ok(
    content.includes('aria-live="polite"'),
    "Expected feedback toast/card to include aria-live='polite'"
  );
});
