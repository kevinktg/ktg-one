import { put, get } from "@vercel/blob";

/**
 * Upload a snippet markdown file to Vercel Blob
 * @param {string} filename - Name of the file (e.g., "success-criteria-lock.md")
 * @param {string} content - Markdown content
 * @returns {Promise<{url: string}>} Blob URL
 */
export async function uploadSnippet(filename, content) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN environment variable is not set");
  }

  const blob = await put(`snippets/${filename}`, content, {
    access: "public",
    contentType: "text/markdown",
  });

  return blob;
}

/**
 * Get snippet content from Vercel Blob
 * @param {string} url - Blob URL
 * @returns {Promise<string>} Markdown content
 */
export async function getSnippetContent(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch snippet: ${response.statusText}`);
  }
  return await response.text();
}
