# Library Book Management API

A Node.js, Express, and MongoDB API for creating books, listing them with
pagination, and updating their availability.

## Setup

1. Install Node.js and run `npm install`.
2. Copy `.env.example` to `.env` in the project root and set `MONGODB_URI` to
   your MongoDB connection string. The server also loads `src/.env` if no
   project-root `.env` exists.
3. Start MongoDB, then run `npm start` (or `npm run dev` for development).

The API listens on port `3000` by default. Set `PORT` to change it.

## Endpoints

### Create a book

`POST /api/books`

```json
{
  "title": "The Hobbit",
  "author": "J. R. R. Tolkien",
  "category": "Fantasy"
}
```

The title is required. A new book is available by default, and its creation
date is recorded automatically. Returns `201 Created` with the stored book.

### List books

`GET /api/books?page=1&limit=10`

Both query parameters are optional; they default to `1` and `10`. They must be
positive integers. The response includes the books, current page, and total
number of records:

```json
{
  "books": [],
  "page": 1,
  "total": 0
}
```

### Update availability

`PATCH /api/books/:id`

```json
{
  "available": false
}
```

`available` must be a boolean. Returns the updated book, `400 Bad Request` for
an invalid ID or request body, or `404 Not Found` when no book matches the ID.
