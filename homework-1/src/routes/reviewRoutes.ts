import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { 
  getAllReviews, 
  getReviewById, 
  getReviewsByBookId,
  createReview, 
  updateReview, 
  deleteReview 
} from '../controllers/reviewController';

const reviewRoutes = async (req: IncomingMessage, res: ServerResponse, pathname: string) => {
  const reviewMatches = pathname.match(/^\/api\/reviews\/(\d+)$/);
  const bookReviewsMatches = pathname.match(/^\/api\/books\/(\d+)\/reviews$/);
  
  const reviewId = reviewMatches ? parseInt(reviewMatches[1]) : null;
  const bookId = bookReviewsMatches ? parseInt(bookReviewsMatches[1]) : null;

  const baseURL = `http://${req.headers.host}`;
  const url = new URL(req.url || '/', baseURL);

  switch (req.method) {
    case 'GET':
      if (reviewId) {
        await getReviewById(req, res, reviewId);
      } else if (bookId) {
        await getReviewsByBookId(req, res, bookId);
      } else {
        await getAllReviews(req, res);
      }
      break;

    case 'POST':
      if (reviewId || bookId) {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      } else {
        await createReview(req, res);
      }
      break;

    case 'PUT':
      if (reviewId) {
        await updateReview(req, res, reviewId);
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Review ID is required' }));
      }
      break;

    case 'DELETE':
      if (reviewId) {
        await deleteReview(req, res, reviewId);
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Review ID is required' }));
      }
      break;

    default:
      res.writeHead(405);
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }
};

export default reviewRoutes; 