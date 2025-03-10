import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController';

const bookRoutes = async (req: IncomingMessage, res: ServerResponse, pathname: string) => {
  const matches = pathname.match(/^\/api\/books\/(\d+)$/);
  const id = matches ? parseInt(matches[1]) : null;

  const baseURL = `http://${req.headers.host}`;
  const url = new URL(req.url || '/', baseURL);

  switch (req.method) {
    case 'GET':
      if (id) {
        await getBookById(req, res, id);
      } else {
        await getAllBooks(req, res);
      }
      break;

    case 'POST':
      if (id) {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      } else {
        await createBook(req, res);
      }
      break;

    case 'PUT':
      if (id) {
        await updateBook(req, res, id);
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Book ID is required' }));
      }
      break;

    case 'DELETE':
      if (id) {
        await deleteBook(req, res, id);
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Book ID is required' }));
      }
      break;

    default:
      res.writeHead(405);
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }
};

export default bookRoutes; 