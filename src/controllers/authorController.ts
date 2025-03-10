import { eq } from 'drizzle-orm';
import { db } from '../db';
import { authors } from '../db/schema';
import { IncomingMessage, ServerResponse } from 'http';
import { getRequestBody } from '../utils/requestUtils';

export const getAllAuthors = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const allAuthors = await db.select().from(authors);
    
    res.writeHead(200);
    res.end(JSON.stringify({ data: allAuthors }));
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const getAuthorById = async (req: IncomingMessage, res: ServerResponse, id: number) => {
  try {
    const author = await db.select().from(authors).where(eq(authors.id, id));
    
    if (author.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Author not found' }));
      return;
    }
    
    res.writeHead(200);
    res.end(JSON.stringify({ data: author[0] }));
  } catch (error) {
    console.error(`Error fetching author with ID ${id}:`, error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const createAuthor = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const body = await getRequestBody(req);
    
    if (!body.name) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Name is required' }));
      return;
    }
    
    const newAuthor = await db.insert(authors).values({
      name: body.name,
      biography: body.biography || null,
      birthDate: body.birthDate || null,
      nationality: body.nationality || null,
    }).returning();
    
    res.writeHead(201);
    res.end(JSON.stringify({ 
      message: 'Author created successfully', 
      data: newAuthor[0] 
    }));
  } catch (error) {
    console.error('Error creating author:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const updateAuthor = async (req: IncomingMessage, res: ServerResponse, id: number) => {
  try {
    const body = await getRequestBody(req);
    
    const existingAuthor = await db.select().from(authors).where(eq(authors.id, id));
    if (existingAuthor.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Author not found' }));
      return;
    }
    
    const updatedAuthor = await db.update(authors)
      .set({
        name: body.name !== undefined ? body.name : existingAuthor[0].name,
        biography: body.biography !== undefined ? body.biography : existingAuthor[0].biography,
        birthDate: body.birthDate !== undefined ? body.birthDate : existingAuthor[0].birthDate,
        nationality: body.nationality !== undefined ? body.nationality : existingAuthor[0].nationality,
        updatedAt: new Date(),
      })
      .where(eq(authors.id, id))
      .returning();
    
    res.writeHead(200);
    res.end(JSON.stringify({ 
      message: 'Author updated successfully', 
      data: updatedAuthor[0] 
    }));
  } catch (error) {
    console.error(`Error updating author with ID ${id}:`, error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const deleteAuthor = async (req: IncomingMessage, res: ServerResponse, id: number) => {
  try {
    const existingAuthor = await db.select().from(authors).where(eq(authors.id, id));
    if (existingAuthor.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Author not found' }));
      return;
    }
    
    await db.delete(authors).where(eq(authors.id, id));
    
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Author deleted successfully' }));
  } catch (error) {
    console.error(`Error deleting author with ID ${id}:`, error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}; 