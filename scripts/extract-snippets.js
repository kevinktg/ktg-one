/**
 * Script to extract V template snippets from DOCS files
 * Run with: node scripts/extract-snippets.js
 */

const fs = require("fs");
const path = require("path");

const DOCS_PATH = path.join(__dirname, "..", "..", "ktg-one", "DOCS");
const OUTPUT_DIR = path.join(__dirname, "..", "extracted-snippets");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Extract snippets from a markdown file
 * Looks for patterns like:
 * ### 1. SNIPPET_NAME (Description)
 * ```
 * PURPOSE: ...
 * WHAT IT DOES: ...
 * OUTPUT: ...
 * ```
 */
function extractSnippets(filePath, fileName) {
  const content = fs.readFileSync(filePath, "utf-8");
  const snippets = [];

  // Pattern to match snippet headers: ### 1. NAME (Description) or ### NAME
  const snippetHeaderRegex = /^###\s+(\d+\.\s+)?([A-Z_][A-Z0-9_\s]+)(?:\s*\(([^)]+)\))?/gm;
  
  let match;
  const matches = [];
  
  // Collect all matches first
  while ((match = snippetHeaderRegex.exec(content)) !== null) {
    matches.push({
      name: match[2].trim(),
      description: match[3] || "",
      index: match.index,
      fullMatch: match[0],
    });
  }

  // Process each match
  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i];
    const nextMatch = matches[i + 1];
    
    const startIndex = currentMatch.index;
    const endIndex = nextMatch ? nextMatch.index : content.length;
    
    // Extract snippet content
    const snippetContent = content.slice(startIndex, endIndex).trim();

    // Extract PURPOSE, WHAT IT DOES, OUTPUT fields
    const purposeMatch = snippetContent.match(/PURPOSE:\s*(.+?)(?:\n|$)/i);
    const whatItDoesMatch = snippetContent.match(/WHAT IT DOES:\s*([\s\S]+?)(?:\n\n|\n[A-Z]+:|$)/i);
    const outputMatch = snippetContent.match(/OUTPUT[^:]*:\s*([\s\S]+?)(?:\n\n|\n[A-Z]+:|$)/i);

    snippets.push({
      title: currentMatch.name,
      description: currentMatch.description || (purposeMatch ? purposeMatch[1].trim() : ""),
      content: snippetContent,
      source_file: fileName,
      snippet_type: extractSnippetType(snippetContent),
      tags: extractTags(snippetContent),
    });
  }

  return snippets;
}

function extractSnippetType(content) {
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes("gate") || lowerContent.includes("lock")) return "gate";
  if (lowerContent.includes("protocol")) return "protocol";
  if (lowerContent.includes("technique")) return "technique";
  if (lowerContent.includes("method")) return "method";
  return "snippet";
}

function extractTags(content) {
  const tags = [];
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes("quick")) tags.push("quick");
  if (lowerContent.includes("analytical")) tags.push("analytical");
  if (lowerContent.includes("deliberate")) tags.push("deliberate");
  if (lowerContent.includes("maximum")) tags.push("maximum");
  if (lowerContent.includes("mode")) tags.push("mode-based");
  
  return tags;
}

/**
 * Process all DOCS files
 */
function processDocsFiles() {
  const files = fs.readdirSync(DOCS_PATH).filter(
    (file) => file.endsWith(".md") && file !== "LIBRARY_DOCUMENTATION_REFERENCE.md"
  );

  const allSnippets = [];

  for (const file of files) {
    const filePath = path.join(DOCS_PATH, file);
    try {
      const snippets = extractSnippets(filePath, file);
      allSnippets.push(...snippets);
      console.log(`Extracted ${snippets.length} snippets from ${file}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  // Save snippets to JSON file for review
  const outputPath = path.join(OUTPUT_DIR, "snippets.json");
  fs.writeFileSync(outputPath, JSON.stringify(allSnippets, null, 2));
  console.log(`\nExtracted ${allSnippets.length} total snippets`);
  console.log(`Saved to: ${outputPath}`);

  return allSnippets;
}

// Run if executed directly
if (require.main === module) {
  processDocsFiles();
}

module.exports = { extractSnippets, processDocsFiles };
