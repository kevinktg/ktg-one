import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('SnippetViewer has accessible labels and live region', () => {
  const filePath = path.resolve('src/components/hub/SnippetViewer.jsx');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Verify icon-only button has aria-label
  assert.match(
    fileContent,
    /aria-label=\{copied \? ["']Copied snippet["'] : ["']Copy snippet["']\}/,
    'Icon-only copy button must have an aria-label'
  );

  // Verify toast card has role="status" and aria-live="polite"
  assert.match(
    fileContent,
    /role="status"/,
    'Feedback notification card must include role="status"'
  );
  assert.match(
    fileContent,
    /aria-live="polite"/,
    'Feedback notification card must include aria-live="polite"'
  );
});
