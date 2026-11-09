import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('BlogPreview animation enhancement verification', async (t) => {
  const filePath = path.resolve(process.cwd(), 'src/components/BlogPreview.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  await t.test('includes target id and data attributes for skip-nav and query targeting', () => {
    assert.match(content, /id="blog-section"/, 'BlogPreview container must have id="blog-section"');
    assert.match(content, /data-blog-section/, 'BlogPreview container must retain data-blog-section');
  });

  await t.test('applies hover elevation with >= 1000ms duration and reduced motion fallback', () => {
    assert.match(content, /hover:-translate-y-1/, 'Card link should have hover:-translate-y-1');
    assert.match(content, /duration-1000/, 'Card link should use duration-1000 (>= 1s constraint)');
    assert.match(content, /motion-reduce:transform-none/, 'Card link should respect prefers-reduced-motion');
  });

  await t.test('applies top shimmer line and indicator dot pulse', () => {
    assert.match(content, /bg-gradient-to-r/, 'Should have a subtle shimmer line gradient');
    assert.match(content, /group-hover:scale-x-100/, 'Shimmer line should expand on hover');
    assert.match(content, /group-hover:scale-125/, 'Dot indicator should scale on hover');
    assert.match(content, /group-hover:translate-x-1\.5/, 'Arrow should translate on hover');
  });

  await t.test('animation progress json is updated to completed for blog-card-hover', () => {
    const progressPath = path.resolve(process.cwd(), '.animation-progress.json');
    const progressData = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
    const entry = progressData.find((item) => item.id === 'blog-card-hover');

    assert.ok(entry, 'blog-card-hover entry should exist in .animation-progress.json');
    assert.equal(entry.status, 'completed', 'blog-card-hover status should be completed');
  });
});
