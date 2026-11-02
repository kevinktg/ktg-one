import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

test("Header component links to /hub/snippets with 'skills' label", () => {
  const headerContent = fs.readFileSync(
    path.join(rootDir, "src/components/Header.jsx"),
    "utf-8"
  );
  assert.match(
    headerContent,
    /<Link\s+href="\/hub\/snippets">\s*skills\s*<\/Link>/i,
    "Header should display 'skills' for /hub/snippets link"
  );
});

test("Snippets page title and description reflect Skills Hub", () => {
  const pageContent = fs.readFileSync(
    path.join(rootDir, "src/app/hub/snippets/page.jsx"),
    "utf-8"
  );
  assert.match(
    pageContent,
    /KTG Skills Hub/i,
    "Page title should reflect Skills Hub"
  );
  assert.match(
    pageContent,
    /Browse KTG v30 skills/i,
    "Page description should mention skills"
  );
});

test("Snippet detail page navigation links back to skills", () => {
  const detailPageContent = fs.readFileSync(
    path.join(rootDir, "src/app/hub/snippets/[id]/page.jsx"),
    "utf-8"
  );
  assert.match(
    detailPageContent,
    /Back to skills/i,
    "Back link should say 'Back to skills'"
  );
});

test("SnippetViewer component provides accessible copy toast notification", () => {
  const viewerContent = fs.readFileSync(
    path.join(rootDir, "src/components/hub/SnippetViewer.jsx"),
    "utf-8"
  );
  assert.match(
    viewerContent,
    /Skill copied to clipboard/i,
    "Toast text should say 'Skill copied to clipboard'"
  );
  assert.match(
    viewerContent,
    /role="status"/,
    "Toast should include role='status'"
  );
  assert.match(
    viewerContent,
    /aria-live="polite"/,
    "Toast should include aria-live='polite'"
  );
});
