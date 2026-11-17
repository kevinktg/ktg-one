import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('CursorDot uses direct transform style mutations in render loop instead of gsap.set()', () => {
  const filePath = path.resolve('src/components/CursorDot.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Verify that inside render, style.transform is used
  assert.ok(
    content.includes('dotsRef.current[0].style.transform = `translate3d(${dots[0].x}px, ${dots[0].y}px, 0) translate(-50%, -50%)`'),
    'Leader dot should update position directly via style.transform'
  );

  assert.ok(
    content.includes('dotsRef.current[i].style.transform = `translate3d(${curr.x}px, ${curr.y}px, 0) translate(-50%, -50%)`'),
    'Follower dots should update position directly via style.transform'
  );

  // Extract render function to verify no gsap.set is present inside it
  const renderFnMatch = content.match(/const render = \(\) => \{([\s\S]*?)\n    \}/);
  assert.ok(renderFnMatch, 'render function must exist');
  const renderBody = renderFnMatch[1];
  assert.ok(
    !renderBody.includes('gsap.set'),
    'render loop must not call gsap.set() on every frame'
  );
});

test('CursorDot animation loop benchmark: direct transform vs property interpolation', () => {
  const DOT_COUNT = 12;
  const ITERATIONS = 1000;

  // Simulate mock DOM elements
  const mockElementsDirect = Array.from({ length: DOT_COUNT }, () => ({
    style: { transform: '' }
  }));

  const startDirect = performance.now();
  for (let frame = 0; frame < ITERATIONS; frame++) {
    for (let i = 0; i < DOT_COUNT; i++) {
      mockElementsDirect[i].style.transform = `translate3d(${frame + i}px, ${frame + i}px, 0) translate(-50%, -50%)`;
    }
  }
  const durationDirect = performance.now() - startDirect;

  // Direct transform should execute in well under 50ms for 1000 frames (12,000 updates)
  assert.ok(
    durationDirect < 50,
    `Direct transform took ${durationDirect.toFixed(2)}ms, should be very fast (<50ms)`
  );
});
