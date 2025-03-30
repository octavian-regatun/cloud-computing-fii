import { IncomingMessage, ServerResponse } from 'http';
import { 
  addCategoryToBook,
  removeCategoryFromBook,
  getCategoriesByBookId,
  getBooksByCategoryId
} from '../controllers/bookCategoryController';

const bookCategoryRoutes = async (req: IncomingMessage, res: ServerResponse, pathname: string) => {
  const bookCategoriesMatches = pathname.match(/^\/api\/books\/(\d+)\/categories$/);
  const categoryBooksMatches = pathname.match(/^\/api\/categories\/(\d+)\/books$/);
  
  const bookId = bookCategoriesMatches ? parseInt(bookCategoriesMatches[1]) : null;
  const categoryId = categoryBooksMatches ? parseInt(categoryBooksMatches[1]) : null;

  switch (req.method) {
    case 'GET':
      if (bookId) {
        await getCategoriesByBookId(req, res, bookId);
      } else if (categoryId) {
        await getBooksByCategoryId(req, res, categoryId);
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid endpoint' }));
      }
      break;

    case 'POST':
      if (pathname === '/api/book-categories') {
        await addCategoryToBook(req, res);
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid endpoint' }));
      }
      break;

    case 'DELETE':
      if (pathname === '/api/book-categories') {
        await removeCategoryFromBook(req, res);
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid endpoint' }));
      }
      break;

    default:
      res.writeHead(405);
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }
};

export default bookCategoryRoutes; 