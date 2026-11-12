import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('BlogPreview animation and interaction styles compliance', () => {
  const blogPreviewPath = path.resolve('src/components/BlogPreview.jsx');
  const content = fs.readFileSync(blogPreviewPath, 'utf-8');

  // Must ensure duration is at least 1s (1000ms) for UI animations
  assert.ok(
    content.includes('duration-1000'),
    'BlogPreview card hover transition duration must be at least 1000ms'
  );

  // Must include prefers-reduced-motion compliance
  assert.ok(
    content.includes('motion-reduce:'),
    'BlogPreview card must include prefers-reduced-motion compliance (motion-reduce:*'
  );

  // Must include subtle elevation / card translation on hover
  assert.ok(
    content.includes('group-hover:-translate-y-') || content.includes('group-hover:-translate-y-1'),
    'BlogPreview card article must include subtle elevation/translation on hover'
  );

  // Must include arrow translate-x with duration >= 1000ms
  assert.ok(
    content.includes('group-hover:translate-x-') && content.includes('duration-1000'),
    'BlogPreview arrow translation must adhere to duration-1000'
  );
});

test('Animation progress json tracks blog-card-hover completion', () => {
  const progressPath = path.resolve('.animation-progress.json');
  const progress = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));

  const blogEntry = progress.find(item => item.id === 'blog-card-hover');
  assert.ok(blogEntry, 'blog-card-hover must exist in .animation-progress.json');
  assert.equal(blogEntry.status, 'completed', 'blog-card-hover status must be marked completed');
});
