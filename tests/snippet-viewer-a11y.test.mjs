import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("SnippetViewer includes accessible attributes and status announcements", () => {
  const filePath = path.resolve(process.cwd(), "src/components/hub/SnippetViewer.jsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Verify accessible aria-label on copy buttons
  assert.ok(
    content.includes('aria-label={copied ? "Copied snippet code" : "Copy snippet code"}'),
    "Expected copy buttons to have dynamic aria-label"
  );

  // Verify title tooltip on copy buttons
  assert.ok(
    content.includes('title={copied ? "Copied" : "Copy snippet code"}'),
    "Expected copy buttons to have title attribute for tooltip hover"
  );

  // Verify status announcement container
  assert.ok(
    content.includes('role="status"'),
    "Expected copied feedback notification to have role='status'"
  );
  assert.ok(
    content.includes('aria-live="polite"'),
    "Expected copied feedback notification to have aria-live='polite'"
  );
});
