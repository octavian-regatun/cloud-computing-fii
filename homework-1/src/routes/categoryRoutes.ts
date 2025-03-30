import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController';

const categoryRoutes = async (req: IncomingMessage, res: ServerResponse, pathname: string) => {
  const matches = pathname.match(/^\/api\/categories\/(\d+)$/);
  const id = matches ? parseInt(matches[1]) : null;

  const baseURL = `http://${req.headers.host}`;
  const url = new URL(req.url || '/', baseURL);

  switch (req.method) {
    case 'GET':
      if (id) {
        await getCategoryById(req, res, id);
      } else {
        await getAllCategories(req, res);
      }
      break;

    case 'POST':
      if (id) {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      } else {
        await createCategory(req, res);
      }
      break;

    case 'PUT':
      if (id) {
        await updateCategory(req, res, id);
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Category ID is required' }));
      }
      break;

    case 'DELETE':
      if (id) {
        await deleteCategory(req, res, id);
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Category ID is required' }));
      }
      break;

    default:
      res.writeHead(405);
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }
};

export default categoryRoutes; 