import { db } from "@/lib/db";
import { snippets } from "@/lib/db/schema";
import { eq, ilike, or, desc } from "drizzle-orm";

/**
 * Get all snippets
 */
export async function getAllSnippets() {
  return await db.select().from(snippets).orderBy(desc(snippets.created_at));
}

/**
 * Get snippet by ID
 */
export async function getSnippetById(id) {
  const result = await db.select().from(snippets).where(eq(snippets.id, id)).limit(1);
  return result[0] || null;
}

/**
 * Search snippets by title or description
 */
export async function searchSnippets(query) {
  const searchTerm = `%${query}%`;
  return await db
    .select()
    .from(snippets)
    .where(
      or(
        ilike(snippets.title, searchTerm),
        ilike(snippets.description, searchTerm)
      )
    )
    .orderBy(desc(snippets.created_at));
}

/**
 * Create a new snippet
 */
export async function createSnippet(data) {
  const result = await db
    .insert(snippets)
    .values({
      title: data.title,
      description: data.description,
      blob_url: data.blob_url,
      tags: data.tags || [],
      snippet_type: data.snippet_type,
      source_file: data.source_file,
    })
    .returning();

  return result[0];
}
