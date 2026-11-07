import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("BlogPreview component adheres to UI animation, accessibility, and navigation guidelines", () => {
  const blogPreviewPath = path.resolve("src/components/BlogPreview.jsx");
  const content = fs.readFileSync(blogPreviewPath, "utf-8");

  // 1. Container must include id="blog-section"
  assert.match(
    content,
    /id="blog-section"/,
    "BlogPreview container must include id=\"blog-section\""
  );

  // 2. Animation duration must be at least 1 second (1000ms)
  assert.match(
    content,
    /duration-1000/,
    "BlogPreview hover animations must have duration >= 1000ms (duration-1000)"
  );

  // 3. Must support prefers-reduced-motion
  assert.match(
    content,
    /motion-reduce:/,
    "BlogPreview must include motion-reduce:* variants for accessibility"
  );
});
