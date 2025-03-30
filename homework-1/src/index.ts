import http from 'http';
import { URL } from 'url';
import bookRoutes from './routes/bookRoutes';
import authorRoutes from './routes/authorRoutes';
import categoryRoutes from './routes/categoryRoutes';
import reviewRoutes from './routes/reviewRoutes';
import bookCategoryRoutes from './routes/bookCategoryRoutes';

const PORT = process.env.PORT || 8080;

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const baseURL = `http://${req.headers.host}`;
  const parsedUrl = new URL(req.url || '/', baseURL);
  const pathname = parsedUrl.pathname;
  
  res.setHeader('Content-Type', 'application/json');

  if (pathname === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: 'Welcome to the Book Management API',
      endpoints: {
        books: '/api/books',
        authors: '/api/authors',
        categories: '/api/categories',
        reviews: '/api/reviews',
        bookCategories: '/api/book-categories',
      },
    }));
    return;
  }

  if (pathname.startsWith('/api/books') && !pathname.match(/^\/api\/books\/\d+\/reviews$/)) {
    await bookRoutes(req, res, pathname);
    return;
  }

  if (pathname.startsWith('/api/authors')) {
    await authorRoutes(req, res, pathname);
    return;
  }

  if (pathname.startsWith('/api/categories') && !pathname.match(/^\/api\/categories\/\d+\/books$/)) {
    await categoryRoutes(req, res, pathname);
    return;
  }

  if (pathname.startsWith('/api/reviews') || 
      pathname.match(/^\/api\/books\/\d+\/reviews$/)) {
    await reviewRoutes(req, res, pathname);
    return;
  }

  if (pathname === '/api/book-categories' || 
      pathname.match(/^\/api\/books\/\d+\/categories$/) || 
      pathname.match(/^\/api\/categories\/\d+\/books$/)) {
    await bookCategoryRoutes(req, res, pathname);
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 