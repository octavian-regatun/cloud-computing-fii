import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { authors } from './authors';

export const books = sqliteTable('books', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  authorId: integer('author_id').references(() => authors.id).notNull(),
  publicationYear: integer('publication_year').notNull(),
  isbn: text('isbn').notNull().unique(),
  description: text('description'),
  publisher: text('publisher'),
  pageCount: integer('page_count'),
  language: text('language').default('English'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
}); 