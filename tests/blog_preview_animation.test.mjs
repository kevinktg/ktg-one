import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('BlogPreview component includes required animations and accessibility properties', () => {
  const filePath = path.resolve('src/components/BlogPreview.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Verify id="blog-section" container requirement
  assert.match(
    content,
    /id=["']blog-section["']/,
    'BlogPreview must include id="blog-section" for skip navigation'
  );

  // Verify animation duration >= 1000ms for hover transition
  assert.match(
    content,
    /duration-1000/,
    'BlogPreview card hover transition duration must be at least 1000ms'
  );

  // Verify motion-reduce compliance
  assert.match(
    content,
    /motion-reduce:/,
    'BlogPreview hover animations must include motion-reduce variants'
  );

  // Verify GPU-accelerated transform & opacity transition
  assert.match(
    content,
    /transition-all|transition-transform/,
    'BlogPreview card hover must use transitions'
  );

  // Verify card elevation or lift on hover
  assert.match(
    content,
    /hover:-translate-y-/,
    'BlogPreview card must have subtle lift on hover'
  );
});

test('.animation-progress.json marks blog-card-hover as completed', () => {
  const filePath = path.resolve('.animation-progress.json');
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const blogItem = content.find(item => item.id === 'blog-card-hover');
  assert.ok(blogItem, 'blog-card-hover entry must exist in .animation-progress.json');
  assert.equal(blogItem.status, 'completed', 'status must be completed');
});
