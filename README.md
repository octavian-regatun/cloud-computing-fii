# Book Management API

A RESTful API for managing books built with TypeScript, Node.js native HTTP module, and Drizzle ORM with SQLite.

## Requirements

- Node.js (v14 or higher)
- npm

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Generate database migrations:

```bash
npm run db:generate
```

4. Apply database migrations:

```bash
npm run db:migrate
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## API Endpoints

### Books

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a book by ID
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book (full update)
- `PATCH /api/books/:id` - Update a book (partial update)
- `DELETE /api/books/:id` - Delete a book

## Request and Response Examples

### Get All Books

**Request:**
```
GET /api/books
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publicationYear": 1925,
    "isbn": "9780743273565",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "publicationYear": 1960,
    "isbn": "9780061120084",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Get Book by ID

**Request:**
```
GET /api/books/1
```

**Response:**
```json
{
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "publicationYear": 1925,
  "isbn": "9780743273565",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Create a New Book

**Request:**
```
POST /api/books
Content-Type: application/json

{
  "title": "1984",
  "author": "George Orwell",
  "publicationYear": 1949,
  "isbn": "9780451524935"
}
```

**Response:**
```json
{
  "id": 3,
  "title": "1984",
  "author": "George Orwell",
  "publicationYear": 1949,
  "isbn": "9780451524935",
  "createdAt": "2023-01-02T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z"
}
```

### Update a Book (PUT)

**Request:**
```
PUT /api/books/3
Content-Type: application/json

{
  "title": "Nineteen Eighty-Four",
  "author": "George Orwell",
  "publicationYear": 1949,
  "isbn": "9780451524935"
}
```

**Response:**
```json
{
  "id": 3,
  "title": "Nineteen Eighty-Four",
  "author": "George Orwell",
  "publicationYear": 1949,
  "isbn": "9780451524935",
  "createdAt": "2023-01-02T00:00:00.000Z",
  "updatedAt": "2023-01-02T12:00:00.000Z"
}
```

### Update a Book (PATCH)

**Request:**
```
PATCH /api/books/3
Content-Type: application/json

{
  "title": "Nineteen Eighty-Four (Updated)"
}
```

**Response:**
```json
{
  "id": 3,
  "title": "Nineteen Eighty-Four (Updated)",
  "author": "George Orwell",
  "publicationYear": 1949,
  "isbn": "9780451524935",
  "createdAt": "2023-01-02T00:00:00.000Z",
  "updatedAt": "2023-01-02T13:00:00.000Z"
}
```

### Delete a Book

**Request:**
```
DELETE /api/books/3
```

**Response:**
```
204 No Content
``` 