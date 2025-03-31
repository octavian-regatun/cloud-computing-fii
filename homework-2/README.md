# BookWeather Portal - Cloud Computing Homework 2

This is a full-stack application that integrates three web services:
1. Book Management API (from Homework 1)
2. OpenWeatherMap API
3. Open Library API

The application provides a unified interface to browse books from your own Book API, check weather information, and discover books from Open Library.

## Project Structure

The project consists of two main components:

### Backend
- Built with Hono.js (minimal, fast web framework)
- Provides a RESTful API that interacts with the three web services
- Handles error states and returns appropriate HTTP status codes
- Exposes aggregated data through a unified API endpoint

### Frontend
- Built with Next.js (React framework)
- Responsive UI with TailwindCSS
- Client-side data fetching with proper error handling
- Dynamic routing for book details

## Requirements

- Node.js (v18+ recommended)
- API key for OpenWeatherMap API
- Access to the Book Management API (Homework 1)

## Configuration

### Backend

1. Navigate to the backend directory
   ```bash
   cd backend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Create a `.env` file with the following variables:
   ```
   BOOK_API_URL=http://localhost:8080
   WEATHER_API_URL=https://api.openweathermap.org/data/2.5
   OPENLIBRARY_API_URL=https://openlibrary.org
   WEATHER_API_KEY=your_openweather_api_key
   PORT=8081
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

### Frontend

1. Navigate to the frontend directory
   ```bash
   cd frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## API Endpoints

The backend exposes the following API endpoints:

- `GET /api/books` - Get all books from your Book API
- `GET /api/books/:id` - Get a specific book by ID from your Book API
- `GET /api/weather/:city` - Get weather information for a specific city
- `GET /api/openlibrary/search/:query` - Search books from Open Library
- `GET /api/openlibrary/trending` - Get trending books from Open Library
- `GET /api/openlibrary/work/:id` - Get details for a specific work from Open Library
- `GET /api/openlibrary/book/:isbn` - Get a book by ISBN from Open Library
- `GET /api/openlibrary/author/:id` - Get author details from Open Library
- `GET /api/dashboard` - Get aggregated data from all three services

## Features

- View a list of books from your Book Management API
- View detailed information about a specific book
- Check weather information for any city
- Search for books on Open Library
- Browse trending books from Open Library
- Dashboard view with data from all three services

## Error Handling

The application includes comprehensive error handling for:
- API service unavailability
- Invalid API responses
- Resource not found (404)
- Server errors (500)

## Future Improvements

- User authentication
- Advanced book search functionality
- Favorites/bookmarks for books
- Caching for improved performance
- Unit and integration tests

## License

MIT 