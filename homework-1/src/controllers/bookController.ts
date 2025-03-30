import { IncomingMessage, ServerResponse } from 'http';
import { db } from '../db';
import { books, authors } from '../db/schema';
import { eq } from 'drizzle-orm';
import { getRequestBody } from '../utils/requestUtils';

export const getAllBooks = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const allBooks = await db.select({
      id: books.id,
      title: books.title,
      authorId: books.authorId,
      authorName: authors.name,
      publicationYear: books.publicationYear,
      isbn: books.isbn,
      description: books.description,
      publisher: books.publisher,
      pageCount: books.pageCount,
      language: books.language,
      createdAt: books.createdAt,
      updatedAt: books.updatedAt
    })
    .from(books)
    .leftJoin(authors, eq(books.authorId, authors.id));
    
    res.writeHead(200);
    res.end(JSON.stringify({ data: allBooks }));
  } catch (error) {
    console.error('Error fetching books:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const getBookById = async (req: IncomingMessage, res: ServerResponse, id: number) => {
  try {
    const book = await db.select({
      id: books.id,
      title: books.title,
      authorId: books.authorId,
      authorName: authors.name,
      publicationYear: books.publicationYear,
      isbn: books.isbn,
      description: books.description,
      publisher: books.publisher,
      pageCount: books.pageCount,
      language: books.language,
      createdAt: books.createdAt,
      updatedAt: books.updatedAt
    })
    .from(books)
    .leftJoin(authors, eq(books.authorId, authors.id))
    .where(eq(books.id, id))
    .limit(1);

    if (book.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Book not found' }));
      return;
    }

    res.writeHead(200);
    res.end(JSON.stringify({ data: book[0] }));
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const createBook = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const body = await getRequestBody(req);
    
    if (!body.title || !body.authorId || !body.publicationYear || !body.isbn) {
      res.writeHead(400);
      res.end(JSON.stringify({ 
        error: 'Title, author ID, publication year, and ISBN are required' 
      }));
      return;
    }
    
    const author = await db.select().from(authors).where(eq(authors.id, body.authorId));
    if (author.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Author not found' }));
      return;
    }
    
    const existingBook = await db.select().from(books).where(eq(books.isbn, body.isbn));
    if (existingBook.length > 0) {
      res.writeHead(409);
      res.end(JSON.stringify({ error: 'Book with this ISBN already exists' }));
      return;
    }
    
    const newBook = await db.insert(books).values({
      title: body.title,
      authorId: body.authorId,
      publicationYear: body.publicationYear,
      isbn: body.isbn,
      description: body.description || null,
      publisher: body.publisher || null,
      pageCount: body.pageCount || null,
      language: body.language || 'English',
    }).returning();
    
    res.writeHead(201);
    res.end(JSON.stringify({ 
      message: 'Book created successfully', 
      data: newBook[0] 
    }));
  } catch (error) {
    console.error('Error creating book:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const updateBook = async (req: IncomingMessage, res: ServerResponse, id: number) => {
  try {
    const body = await getRequestBody(req);
    
    const existingBook = await db.select().from(books).where(eq(books.id, id));
    if (existingBook.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Book not found' }));
      return;
    }
    
    if (body.authorId) {
      const author = await db.select().from(authors).where(eq(authors.id, body.authorId));
      if (author.length === 0) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Author not found' }));
        return;
      }
    }
    
    if (body.isbn && body.isbn !== existingBook[0].isbn) {
      const duplicateBook = await db.select().from(books).where(eq(books.isbn, body.isbn));
      if (duplicateBook.length > 0) {
        res.writeHead(409);
        res.end(JSON.stringify({ error: 'Book with this ISBN already exists' }));
        return;
      }
    }
    
    const updatedBook = await db.update(books)
      .set({
        title: body.title !== undefined ? body.title : existingBook[0].title,
        authorId: body.authorId !== undefined ? body.authorId : existingBook[0].authorId,
        publicationYear: body.publicationYear !== undefined ? body.publicationYear : existingBook[0].publicationYear,
        isbn: body.isbn !== undefined ? body.isbn : existingBook[0].isbn,
        description: body.description !== undefined ? body.description : existingBook[0].description,
        publisher: body.publisher !== undefined ? body.publisher : existingBook[0].publisher,
        pageCount: body.pageCount !== undefined ? body.pageCount : existingBook[0].pageCount,
        language: body.language !== undefined ? body.language : existingBook[0].language,
        updatedAt: new Date(),
      })
      .where(eq(books.id, id))
      .returning();
    
    res.writeHead(200);
    res.end(JSON.stringify({ 
      message: 'Book updated successfully', 
      data: updatedBook[0] 
    }));
  } catch (error) {
    console.error(`Error updating book with ID ${id}:`, error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const deleteBook = async (req: IncomingMessage, res: ServerResponse, id: number) => {
  try {
    const existingBook = await db.select().from(books).where(eq(books.id, id));
    if (existingBook.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Book not found' }));
      return;
    }
    
    await db.delete(books).where(eq(books.id, id));
    
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Book deleted successfully' }));
  } catch (error) {
    console.error(`Error deleting book with ID ${id}:`, error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}; 