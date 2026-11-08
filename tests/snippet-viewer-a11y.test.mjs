import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("SnippetViewer includes proper accessibility attributes for copy buttons and announcements", () => {
  const componentPath = path.resolve("src/components/hub/SnippetViewer.jsx");
  const content = fs.readFileSync(componentPath, "utf-8");

  // Check for dynamic aria-label on copy buttons
  assert.match(
    content,
    /aria-label=\{copied \? ["']Copied snippet to clipboard["'] : ["']Copy snippet to clipboard["']\}/,
    "Expected copy button to have dynamic aria-label"
  );

  // Check for title attribute on icon-only copy button
  assert.match(
    content,
    /title=\{copied \? ["']Copied["'] : ["']Copy code["']\}/,
    "Expected icon-only button to have informative title tooltip"
  );

  // Check for role="status" and aria-live="polite" on feedback toast
  assert.match(
    content,
    /role=["']status["']/,
    "Expected copied feedback element to have role='status'"
  );
  assert.match(
    content,
    /aria-live=["']polite["']/,
    "Expected copied feedback element to have aria-live='polite'"
  );
});
