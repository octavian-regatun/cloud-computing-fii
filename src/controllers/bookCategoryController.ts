import { and, eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { bookCategories, books, categories } from "../db/schema";
import { IncomingMessage, ServerResponse } from "http";
import { getRequestBody } from "../utils/requestUtils";

export const addCategoryToBook = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const body = await getRequestBody(req);

    if (!body.bookId || !body.categoryId) {
      res.writeHead(400);
      res.end(
        JSON.stringify({
          error: "Book ID and category ID are required",
        })
      );
      return;
    }

    const book = await db.select().from(books).where(eq(books.id, body.bookId));
    if (book.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Book not found" }));
      return;
    }

    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, body.categoryId));
    if (category.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Category not found" }));
      return;
    }

    const existingRelation = await db
      .select()
      .from(bookCategories)
      .where(
        and(
          eq(bookCategories.bookId, body.bookId),
          eq(bookCategories.categoryId, body.categoryId)
        )
      );

    if (existingRelation.length > 0) {
      res.writeHead(409);
      res.end(JSON.stringify({ error: "Book is already in this category" }));
      return;
    }

    await db.insert(bookCategories).values({
      bookId: body.bookId,
      categoryId: body.categoryId,
    });

    res.writeHead(201);
    res.end(
      JSON.stringify({
        message: "Category added to book successfully",
      })
    );
  } catch (error) {
    console.error("Error adding category to book:", error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

export const removeCategoryFromBook = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const body = await getRequestBody(req);

    if (!body.bookId || !body.categoryId) {
      res.writeHead(400);
      res.end(
        JSON.stringify({
          error: "Book ID and category ID are required",
        })
      );
      return;
    }

    const existingRelation = await db
      .select()
      .from(bookCategories)
      .where(
        and(
          eq(bookCategories.bookId, body.bookId),
          eq(bookCategories.categoryId, body.categoryId)
        )
      );

    if (existingRelation.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Book is not in this category" }));
      return;
    }

    await db
      .delete(bookCategories)
      .where(
        and(
          eq(bookCategories.bookId, body.bookId),
          eq(bookCategories.categoryId, body.categoryId)
        )
      );

    res.writeHead(200);
    res.end(
      JSON.stringify({
        message: "Category removed from book successfully",
      })
    );
  } catch (error) {
    console.error("Error removing category from book:", error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

export const getCategoriesByBookId = async (
  req: IncomingMessage,
  res: ServerResponse,
  bookId: number
) => {
  try {
    const book = await db.select().from(books).where(eq(books.id, bookId));
    if (book.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Book not found" }));
      return;
    }

    const bookCategoryRelations = await db
      .select()
      .from(bookCategories)
      .where(eq(bookCategories.bookId, bookId));

    if (bookCategoryRelations.length === 0) {
      res.writeHead(200);
      res.end(JSON.stringify({ data: [] }));
      return;
    }

    const categoryIds = bookCategoryRelations.map(
      (relation) => relation.categoryId
    );
    const bookCategoriesEntries = await db
      .select()
      .from(categories)
      .where(inArray(categories.id, categoryIds));

    res.writeHead(200);
    res.end(JSON.stringify({ data: bookCategoriesEntries }));
  } catch (error) {
    console.error(`Error fetching categories for book ID ${bookId}:`, error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

export const getBooksByCategoryId = async (
  req: IncomingMessage,
  res: ServerResponse,
  categoryId: number
) => {
  try {
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId));
    if (category.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Category not found" }));
      return;
    }

    const bookCategoryRelations = await db
      .select()
      .from(bookCategories)
      .where(eq(bookCategories.categoryId, categoryId));

    if (bookCategoryRelations.length === 0) {
      res.writeHead(200);
      res.end(JSON.stringify({ data: [] }));
      return;
    }

    const bookIds = bookCategoryRelations.map((relation) => relation.bookId);
    const categoryBooks = await db
      .select()
      .from(books)
      .where(inArray(books.id, bookIds));

    res.writeHead(200);
    res.end(JSON.stringify({ data: categoryBooks }));
  } catch (error) {
    console.error(`Error fetching books for category ID ${categoryId}:`, error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};
