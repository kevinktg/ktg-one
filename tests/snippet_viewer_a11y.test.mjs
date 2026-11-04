import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("SnippetViewer includes accessible attributes for icon-only button and dynamic feedback", () => {
  const fileContent = fs.readFileSync("src/components/hub/SnippetViewer.jsx", "utf8");

  // Ensure aria-label is present on the icon-only copy button
  assert.ok(
    fileContent.includes('aria-label={copied ? "Copied snippet to clipboard" : "Copy snippet to clipboard"}'),
    "Expected icon-only copy button to have dynamic aria-label"
  );

  // Ensure role="status" and aria-live="polite" are present on the dynamic feedback notification
  assert.ok(
    fileContent.includes('role="status"'),
    "Expected copied toast/card to have role='status'"
  );
  assert.ok(
    fileContent.includes('aria-live="polite"'),
    "Expected copied toast/card to have aria-live='polite'"
  );
});
