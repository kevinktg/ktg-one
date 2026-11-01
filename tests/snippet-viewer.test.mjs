import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("SnippetViewer includes accessible attributes and screen reader live region", () => {
  const filePath = path.resolve("src/components/hub/SnippetViewer.jsx");
  const fileContent = fs.readFileSync(filePath, "utf-8");

  // Verify icon-only button in the Card header has aria-label and title
  assert.ok(
    fileContent.includes('aria-label={copied ? "Copied snippet code" : "Copy snippet code"}'),
    "Card header icon-only button should have dynamic aria-label"
  );
  assert.ok(
    fileContent.includes('title={copied ? "Copied" : "Copy code"}'),
    "Card header icon-only button should have title for hover tooltip"
  );

  // Verify icons are marked aria-hidden
  assert.ok(
    fileContent.includes('<Check className="h-4 w-4 mr-2" aria-hidden="true" />'),
    "Check icon in header button should have aria-hidden='true'"
  );
  assert.ok(
    fileContent.includes('<Copy className="h-4 w-4 mr-2" aria-hidden="true" />'),
    "Copy icon in header button should have aria-hidden='true'"
  );
  assert.ok(
    fileContent.includes('<Check className="h-4 w-4" aria-hidden="true" />'),
    "Check icon in icon-only button should have aria-hidden='true'"
  );
  assert.ok(
    fileContent.includes('<Copy className="h-4 w-4" aria-hidden="true" />'),
    "Copy icon in icon-only button should have aria-hidden='true'"
  );

  // Verify live region for copy confirmation
  assert.ok(
    fileContent.includes('role="status" aria-live="polite"'),
    "Copied confirmation Card should include role='status' and aria-live='polite'"
  );

  // Verify clipboard error handling
  assert.ok(
    fileContent.includes("try {") && fileContent.includes("catch (err) {"),
    "handleCopy should wrap clipboard API call in try/catch"
  );
});
