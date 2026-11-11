import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Skills Hub: Header links to skills hub with 'skills' text", () => {
  const headerSource = fs.readFileSync("src/components/Header.jsx", "utf8");
  assert.match(headerSource, /href="\/hub\/snippets"/);
  assert.match(headerSource, />\s*skills\s*</i);
});

test("Skills Hub: Snippets page titles and labels reflect Skills Hub", () => {
  const snippetsPageSource = fs.readFileSync("src/app/hub/snippets/page.jsx", "utf8");
  assert.match(snippetsPageSource, /skills hub/i);
});

test("Skills Hub: Snippet detail page back navigation refers to skills", () => {
  const detailPageSource = fs.readFileSync("src/app/hub/snippets/[id]/page.jsx", "utf8");
  assert.match(detailPageSource, /Back to skills/i);
});
