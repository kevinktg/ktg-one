import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const snippets = pgTable("snippets", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  blob_url: text("blob_url").notNull(),
  tags: text("tags").array(),
  snippet_type: text("snippet_type"), // e.g., "gate", "technique", "protocol"
  source_file: text("source_file").notNull(), // Original DOCS file name
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
