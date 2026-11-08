import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('BlogPreview has id="blog-section" for skip navigation target', () => {
  const fileContent = fs.readFileSync('src/components/BlogPreview.jsx', 'utf8');
  assert.match(fileContent, /id="blog-section"/, 'BlogPreview should define id="blog-section"');
});

test('BlogPreview cards have >= 1000ms duration and prefers-reduced-motion support', () => {
  const fileContent = fs.readFileSync('src/components/BlogPreview.jsx', 'utf8');
  assert.match(fileContent, /duration-1000/, 'BlogPreview cards should have duration-1000 transition');
  assert.match(fileContent, /motion-reduce:transition-none|motion-reduce:transform-none/, 'BlogPreview cards should support prefers-reduced-motion');
});
