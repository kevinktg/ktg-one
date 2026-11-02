import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

test("Skills Hub: Header navigation label is updated to 'skills'", async () => {
  const headerPath = path.resolve("src/components/Header.jsx");
  const headerContent = await fs.readFile(headerPath, "utf-8");

  assert.match(
    headerContent,
    /<Link href="\/hub\/snippets">\s*skills\s*<\/Link>/,
    "Header navigation link to /hub/snippets should display 'skills'"
  );
});

test("Skills Hub: Snippets index page title and descriptions reflect skills hub", async () => {
  const pagePath = path.resolve("src/app/hub/snippets/page.jsx");
  const pageContent = await fs.readFile(pagePath, "utf-8");

  assert.match(pageContent, /Skills Hub/i, "Page title should mention 'Skills Hub'");
  assert.match(pageContent, /skills/i, "Page copy should mention 'skills'");
  assert.match(pageContent, /No skills available yet/i, "Empty state should mention 'No skills available yet'");
});

test("Skills Hub: Snippet detail page uses 'Back to skills' and 'Skill not found'", async () => {
  const detailPath = path.resolve("src/app/hub/snippets/[id]/page.jsx");
  const detailContent = await fs.readFile(detailPath, "utf-8");

  assert.match(detailContent, /Back to skills/i, "Detail page back link should say 'Back to skills'");
  assert.match(detailContent, /Skill not found/i, "Detail page not found text should say 'Skill not found'");
});

test("Skills Hub: SnippetViewer toast has status role, aria-live, and accessible button", async () => {
  const viewerPath = path.resolve("src/components/hub/SnippetViewer.jsx");
  const viewerContent = await fs.readFile(viewerPath, "utf-8");

  assert.match(viewerContent, /Skill copied to clipboard/i, "Viewer toast should say 'Skill copied to clipboard'");
  assert.match(viewerContent, /role="status"/, "Viewer toast must have role='status'");
  assert.match(viewerContent, /aria-live="polite"/, "Viewer toast must have aria-live='polite'");
  assert.match(viewerContent, /aria-label=/, "Icon button must have aria-label");
});
