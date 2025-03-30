import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { reviews, books } from '../db/schema';
import { IncomingMessage, ServerResponse } from 'http';
import { getRequestBody } from '../utils/requestUtils';

export const getAllReviews = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const allReviews = await db.select().from(reviews);
    
    res.writeHead(200);
    res.end(JSON.stringify({ data: allReviews }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const getReviewById = async (req: IncomingMessage, res: ServerResponse, id: number) => {
  try {
    const review = await db.select().from(reviews).where(eq(reviews.id, id));
    
    if (review.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Review not found' }));
      return;
    }
    
    res.writeHead(200);
    res.end(JSON.stringify({ data: review[0] }));
  } catch (error) {
    console.error(`Error fetching review with ID ${id}:`, error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const getReviewsByBookId = async (req: IncomingMessage, res: ServerResponse, bookId: number) => {
  try {
    const book = await db.select().from(books).where(eq(books.id, bookId));
    if (book.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Book not found' }));
      return;
    }
    
    const bookReviews = await db.select().from(reviews).where(eq(reviews.bookId, bookId));
    
    res.writeHead(200);
    res.end(JSON.stringify({ data: bookReviews }));
  } catch (error) {
    console.error(`Error fetching reviews for book ID ${bookId}:`, error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const createReview = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const body = await getRequestBody(req);
    
    if (!body.bookId || !body.reviewerName || body.rating === undefined) {
      res.writeHead(400);
      res.end(JSON.stringify({ 
        error: 'Book ID, reviewer name, and rating are required' 
      }));
      return;
    }
    
    if (body.rating < 1 || body.rating > 5) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Rating must be between 1 and 5' }));
      return;
    }
    
    const book = await db.select().from(books).where(eq(books.id, body.bookId));
    if (book.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Book not found' }));
      return;
    }
    
    const newReview = await db.insert(reviews).values({
      bookId: body.bookId,
      reviewerName: body.reviewerName,
      reviewerEmail: body.reviewerEmail || null,
      rating: body.rating,
      comment: body.comment || null,
    }).returning();
    
    res.writeHead(201);
    res.end(JSON.stringify({ 
      message: 'Review created successfully', 
      data: newReview[0] 
    }));
  } catch (error) {
    console.error('Error creating review:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const updateReview = async (req: IncomingMessage, res: ServerResponse, id: number) => {
  try {
    const body = await getRequestBody(req);
    
    const existingReview = await db.select().from(reviews).where(eq(reviews.id, id));
    if (existingReview.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Review not found' }));
      return;
    }
    
    if (body.rating !== undefined && (body.rating < 1 || body.rating > 5)) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Rating must be between 1 and 5' }));
      return;
    }
    
    const updatedReview = await db.update(reviews)
      .set({
        reviewerName: body.reviewerName !== undefined ? body.reviewerName : existingReview[0].reviewerName,
        reviewerEmail: body.reviewerEmail !== undefined ? body.reviewerEmail : existingReview[0].reviewerEmail,
        rating: body.rating !== undefined ? body.rating : existingReview[0].rating,
        comment: body.comment !== undefined ? body.comment : existingReview[0].comment,
        updatedAt: new Date(),
      })
      .where(eq(reviews.id, id))
      .returning();
    
    res.writeHead(200);
    res.end(JSON.stringify({ 
      message: 'Review updated successfully', 
      data: updatedReview[0] 
    }));
  } catch (error) {
    console.error(`Error updating review with ID ${id}:`, error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

export const deleteReview = async (req: IncomingMessage, res: ServerResponse, id: number) => {
  try {
    const existingReview = await db.select().from(reviews).where(eq(reviews.id, id));
    if (existingReview.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Review not found' }));
      return;
    }
    
    await db.delete(reviews).where(eq(reviews.id, id));
    
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Review deleted successfully' }));
  } catch (error) {
    console.error(`Error deleting review with ID ${id}:`, error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}; 