import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Skills Hub UI Transition", () => {
  const headerPath = path.resolve("src/components/Header.jsx");
  const snippetsPagePath = path.resolve("src/app/hub/snippets/page.jsx");
  const snippetDetailPath = path.resolve("src/app/hub/snippets/[id]/page.jsx");
  const snippetViewerPath = path.resolve("src/components/hub/SnippetViewer.jsx");

  it("verifies Header links to /hub/snippets with label 'skills'", () => {
    const content = fs.readFileSync(headerPath, "utf8");
    assert.match(content, /<Link href="\/hub\/snippets">[\s\S]*?skills[\s\S]*?<\/Link>/i);
  });

  it("verifies Snippets main page uses Skills Hub heading and copy", () => {
    const content = fs.readFileSync(snippetsPagePath, "utf8");
    assert.match(content, /skills hub/i);
    assert.doesNotMatch(content, /KTG Snippets/);
    assert.match(content, /Browse AI techniques, frameworks, and engineering skills/i);
    assert.match(content, /No skills available yet\./i);
  });

  it("verifies Snippet detail page uses 'Back to skills' and 'Skill not found'", () => {
    const content = fs.readFileSync(snippetDetailPath, "utf8");
    assert.match(content, /Back to skills/i);
    assert.doesNotMatch(content, /Back to snippets/i);
    assert.match(content, /Skill not found/i);
  });

  it("verifies Snippet viewer mentions skill copy and has accessible attributes", () => {
    const content = fs.readFileSync(snippetViewerPath, "utf8");
    assert.match(content, /Skill copied to clipboard/i);
    assert.match(content, /role="status"/);
    assert.match(content, /aria-live="polite"/);
    assert.match(content, /aria-label="Copy skill content"/);
  });
});
