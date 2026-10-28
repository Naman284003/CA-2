const express = require('express');
const booksRouter = require('./routes/books');

const app = express();

app.use(express.json());
app.use('/api/books', booksRouter);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ message: 'Invalid JSON request body' });
  }

  console.error(error);
  return res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
