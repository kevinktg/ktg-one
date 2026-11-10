import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("SnippetViewer component contains accessibility attributes for copy buttons and live regions", () => {
  const filePath = path.resolve("src/components/hub/SnippetViewer.jsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Check header copy button aria-label
  assert.match(
    content,
    /aria-label=\{copied \? "Code snippet copied" : "Copy code snippet"\}/,
    "SnippetViewer copy button should have dynamic aria-label"
  );

  // Check icon-only copy button title and aria-label
  assert.match(
    content,
    /title=\{copied \? "Copied" : "Copy code"\}/,
    "SnippetViewer icon copy button should have title tooltip"
  );

  // Check role="status" and aria-live="polite" on copied feedback container
  assert.match(
    content,
    /role="status"\s+aria-live="polite"/,
    "SnippetViewer copied feedback container should have role='status' and aria-live='polite'"
  );
});
