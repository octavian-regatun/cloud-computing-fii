import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { books } from './books';
import { categories } from './categories';

export const bookCategories = sqliteTable('book_categories', {
  bookId: integer('book_id').references(() => books.id, { onDelete: 'cascade' }).notNull(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'cascade' }).notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.bookId, table.categoryId] }),
  };
}); 