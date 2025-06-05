import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  url: text('url').notNull(),
  title: text('title').notNull(),
  originalText: text('original_text').notNull(),
  summary: text('summary'),
  summaryData: jsonb('summary_data'), // Stores key_points, category, reading_time, tone
  author: text('author'),
  publishDate: timestamp('publish_date'),
  featuredImage: text('featured_image'),
  wordCount: integer('word_count').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  userId: text('user_id').notNull(), // Will integrate with auth later
});

// Type inference
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

// Zod schemas for validation
export const insertArticleSchema = createInsertSchema(articles, {
  url: (schema) => schema.url(),
  title: (schema) => schema.min(1),
  originalText: (schema) => schema.min(1),
  wordCount: (schema) => schema.positive(),
  userId: (schema) => schema.min(1),
});

export const selectArticleSchema = createSelectSchema(articles);

// Summary data type
export interface SummaryData {
  key_points?: string;
  category?: string;
  reading_time?: string;
  tone?: string;
}