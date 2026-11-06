import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("SnippetViewer includes proper ARIA labels and live region attributes", () => {
  const content = fs.readFileSync("src/components/hub/SnippetViewer.jsx", "utf-8");

  // Verify aria-label on both copy buttons
  assert.match(
    content,
    /aria-label=\{copied \? "Copied snippet content" : "Copy snippet content"\}/,
    "Expected aria-label for copy buttons"
  );

  // Verify role="status" and aria-live="polite" on feedback notification
  assert.match(
    content,
    /<Card role="status" aria-live="polite"/,
    "Expected role='status' and aria-live='polite' on feedback Card"
  );
});
