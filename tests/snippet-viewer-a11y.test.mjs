import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("SnippetViewer includes accessible attributes on copy controls and feedback", () => {
  const filePath = path.resolve("src/components/hub/SnippetViewer.jsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Verify icon-only copy button has aria-label and title
  assert.match(
    content,
    /aria-label=\{copied \? "Copied snippet to clipboard" : "Copy snippet code"\}/,
    "SnippetViewer should set an accessible aria-label on copy buttons"
  );
  assert.match(
    content,
    /title=\{copied \? "Copied" : "Copy code"\}/,
    "SnippetViewer should set a title tooltip on the icon-only copy button"
  );

  // Verify dynamic feedback has role="status" and aria-live="polite"
  assert.match(
    content,
    /role="status"\s+aria-live="polite"/,
    "SnippetViewer should have role='status' and aria-live='polite' on copied feedback banner"
  );
});
