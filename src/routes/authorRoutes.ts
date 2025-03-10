import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { 
  getAllAuthors, 
  getAuthorById, 
  createAuthor, 
  updateAuthor, 
  deleteAuthor 
} from '../controllers/authorController';
import { getRequestBody } from '../utils/requestUtils';

const authorRoutes = async (req: IncomingMessage, res: ServerResponse, pathname: string) => {
  const matches = pathname.match(/^\/api\/authors\/(\d+)$/);
  const id = matches ? parseInt(matches[1]) : null;

  const baseURL = `http://${req.headers.host}`;
  const url = new URL(req.url || '/', baseURL);

  switch (req.method) {
    case 'GET':
      if (id) {
        await getAuthorById(req, res, id);
      } else {
        await getAllAuthors(req, res);
      }
      break;

    case 'POST':
      if (id) {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      } else {
        await createAuthor(req, res);
      }
      break;

    case 'PUT':
      if (id) {
        await updateAuthor(req, res, id);
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Author ID is required' }));
      }
      break;

    case 'DELETE':
      if (id) {
        await deleteAuthor(req, res, id);
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Author ID is required' }));
      }
      break;

    default:
      res.writeHead(405);
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }
};

export default authorRoutes; 