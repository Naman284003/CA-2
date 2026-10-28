const express = require('express');
const mongoose = require('mongoose');
const Book = require('../models/Book');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const body =
      req.body && typeof req.body === 'object' && !Array.isArray(req.body)
        ? req.body
        : {};
    const { title, author, category } = body;

    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const book = await Book.create({ title, author, category });
    return res.status(201).json(book);
  } catch (error) {
    return next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1
    ) {
      return res.status(400).json({
        message: 'Page and limit must be positive integers'
      });
    }

    const [books, total] = await Promise.all([
      Book.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Book.countDocuments()
    ]);

    return res.json({ books, page, total });
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body =
      req.body && typeof req.body === 'object' && !Array.isArray(req.body)
        ? req.body
        : {};
    const { available } = body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    if (typeof available !== 'boolean') {
      return res.status(400).json({
        message: 'Availability must be a boolean'
      });
    }

    const book = await Book.findByIdAndUpdate(
      id,
      { available },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json(book);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
