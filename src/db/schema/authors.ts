import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const authors = sqliteTable('authors', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  biography: text('biography'),
  birthDate: text('birth_date'),
  nationality: text('nationality'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
}); 