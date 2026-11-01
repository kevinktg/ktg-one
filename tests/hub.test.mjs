import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Skills Hub page content and branding", () => {
  const snippetsPagePath = path.resolve("src/app/hub/snippets/page.jsx");
  const content = fs.readFileSync(snippetsPagePath, "utf-8");

  // Check that the heading and descriptions reference skills hub
  assert.match(
    content,
    /skills hub/i,
    "Snippets page should feature 'skills hub' in heading"
  );
  assert.match(
    content,
    /skills/i,
    "Snippets page should describe skills and techniques"
  );
  assert.match(
    content,
    /No skills available yet/i,
    "Empty state should refer to skills"
  );
});

test("Header navigation contains link to skills hub", () => {
  const headerPath = path.resolve("src/components/Header.jsx");
  const content = fs.readFileSync(headerPath, "utf-8");

  assert.match(
    content,
    /href="\/hub\/snippets"/,
    "Header must contain link to /hub/snippets"
  );
  assert.match(
    content,
    /skills/i,
    "Header link label should reference skills"
  );
});

test("Snippet detail page navigation references skills", () => {
  const detailPagePath = path.resolve("src/app/hub/snippets/[id]/page.jsx");
  const content = fs.readFileSync(detailPagePath, "utf-8");

  assert.match(
    content,
    /Back to skills/i,
    "Detail page back link should say 'Back to skills'"
  );
  assert.match(
    content,
    /Skill not found/i,
    "Detail page missing item should say 'Skill not found'"
  );
});

test("SnippetViewer component confirms skill copy", () => {
  const viewerPath = path.resolve("src/components/hub/SnippetViewer.jsx");
  const content = fs.readFileSync(viewerPath, "utf-8");

  assert.match(
    content,
    /Skill copied to clipboard/i,
    "Viewer should confirm skill copied"
  );
});
