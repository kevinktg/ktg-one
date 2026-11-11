import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("SnippetViewer includes accessible aria-labels and status live region", () => {
  const fileContent = fs.readFileSync(
    path.resolve(process.cwd(), "src/components/hub/SnippetViewer.jsx"),
    "utf-8"
  );

  // Check aria-label on the header copy button
  assert.ok(
    fileContent.includes('aria-label={copied ? "Copied snippet to clipboard" : "Copy snippet to clipboard"}'),
    "Header button should have aria-label"
  );

  // Check aria-label on the card header icon button
  assert.ok(
    fileContent.includes('aria-label={copied ? "Copied snippet to clipboard" : "Copy code to clipboard"}'),
    "Card header icon button should have aria-label"
  );

  // Check role="status" and aria-live="polite"
  assert.ok(
    fileContent.includes('role="status"'),
    "Toast card should have role='status'"
  );
  assert.ok(
    fileContent.includes('aria-live="polite"'),
    "Toast card should have aria-live='polite'"
  );
});
