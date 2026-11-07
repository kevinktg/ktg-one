import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("SnippetViewer includes accessible labels and live region attributes", () => {
  const filePath = path.join(process.cwd(), "src/components/hub/SnippetViewer.jsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Check that copy button has aria-label
  assert.ok(
    content.includes('aria-label={copied ? "Copied snippet to clipboard" : "Copy snippet to clipboard"}'),
    "Expected copy button to have dynamic aria-label"
  );

  // Check that the copied feedback card has role="status" and aria-live="polite"
  assert.ok(
    content.includes('role="status"'),
    "Expected feedback card to have role=\"status\""
  );
  assert.ok(
    content.includes('aria-live="polite"'),
    "Expected feedback card to have aria-live=\"polite\""
  );
});
