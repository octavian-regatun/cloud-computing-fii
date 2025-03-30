import { eq } from 'drizzle-orm';
import { db } from '../db';
import { categories } from '../db/schema';
import { IncomingMessage, ServerResponse } from 'http';
import { getRequestBody } from '../utils/requestUtils';

export const getAllCategories = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const allCategories = await db.select().from(categories);
    
    res.writeHead(200);
    res.end(JSON.stringify({ data: allCategories }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const getCategoryById = async (req: IncomingMessage, res: ServerResponse, id: number) => {
  try {
    const category = await db.select().from(categories).where(eq(categories.id, id));
    
    if (category.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Category not found' }));
      return;
    }
    
    res.writeHead(200);
    res.end(JSON.stringify({ data: category[0] }));
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const createCategory = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const body = await getRequestBody(req);
    
    if (!body.name) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Name is required' }));
      return;
    }
    
    const existingCategory = await db.select().from(categories).where(eq(categories.name, body.name));
    if (existingCategory.length > 0) {
      res.writeHead(409);
      res.end(JSON.stringify({ error: 'Category with this name already exists' }));
      return;
    }
    
    const newCategory = await db.insert(categories).values({
      name: body.name,
      description: body.description || null,
    }).returning();
    
    res.writeHead(201);
    res.end(JSON.stringify({ 
      message: 'Category created successfully', 
      data: newCategory[0] 
    }));
  } catch (error) {
    console.error('Error creating category:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const updateCategory = async (req: IncomingMessage, res: ServerResponse, id: number) => {
  try {
    const body = await getRequestBody(req);
    
    const existingCategory = await db.select().from(categories).where(eq(categories.id, id));
    if (existingCategory.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Category not found' }));
      return;
    }
    
    if (body.name && body.name !== existingCategory[0].name) {
      const duplicateCategory = await db.select().from(categories).where(eq(categories.name, body.name));
      if (duplicateCategory.length > 0) {
        res.writeHead(409);
        res.end(JSON.stringify({ error: 'Category with this name already exists' }));
        return;
      }
    }
    
    const updatedCategory = await db.update(categories)
      .set({
        name: body.name !== undefined ? body.name : existingCategory[0].name,
        description: body.description !== undefined ? body.description : existingCategory[0].description,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();
    
    res.writeHead(200);
    res.end(JSON.stringify({ 
      message: 'Category updated successfully', 
      data: updatedCategory[0] 
    }));
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const deleteCategory = async (req: IncomingMessage, res: ServerResponse, id: number) => {
  try {
    const existingCategory = await db.select().from(categories).where(eq(categories.id, id));
    if (existingCategory.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Category not found' }));
      return;
    }
    
    await db.delete(categories).where(eq(categories.id, id));
    
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Category deleted successfully' }));
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}; 