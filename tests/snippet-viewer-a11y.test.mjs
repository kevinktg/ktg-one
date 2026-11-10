import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("SnippetViewer component provides accessible copy buttons and live announcement toast", () => {
  const filePath = path.resolve(process.cwd(), "src/components/hub/SnippetViewer.jsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Verify aria-label on both copy buttons (header button and card toolbar button)
  assert.match(
    content,
    /aria-label=\{copied \? ["']Copied snippet to clipboard["'] : ["']Copy snippet code["']\}/,
    "SnippetViewer must include an explicit aria-label on copy buttons"
  );

  // Verify toast container uses role="status" and aria-live="polite"
  assert.match(
    content,
    /role="status"/,
    "Toast notification must include role='status' for assistive tech"
  );
  assert.match(
    content,
    /aria-live="polite"/,
    "Toast notification must include aria-live='polite' for screen reader announcements"
  );
});
