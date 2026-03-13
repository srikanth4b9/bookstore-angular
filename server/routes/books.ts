import type {Request, Response, NextFunction} from 'express';
import {Router} from 'express';
import {BookModel} from '../models/book.model.js';
import {logger} from '../utils/logger.js';
import {bookQuerySchema, bookCreateSchema} from '../validation/book.validation.js';
import type {FilterQuery} from 'mongoose';
import type {Book} from '../types/models.js';

const router = Router();

// Validation middleware
const validateQuery = (req: Request, res: Response, next: NextFunction) => {
  const {error, value} = bookQuerySchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    return res.status(400).json({message: 'Validation Error', errors: error.details});
  }

  // Store validated values in res.locals to avoid modifying read-only req.query in Express 5
  res.locals['query'] = value;
  return next();
};

const validateBody = (req: Request, res: Response, next: NextFunction) => {
  const {error, value} = bookCreateSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    return res.status(400).json({message: 'Validation Error', errors: error.details});
  }
  // Store validated values in res.locals to avoid modifying read-only req.body in Express 5
  res.locals['body'] = value;
  return next();
};

router.get('/', validateQuery, async (req: Request, res: Response) => {
  try {
    const queryData = res.locals['query'] as {
      page: number;
      limit: number;
      search?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      minRating?: number;
      sortBy: string;
      sortOrder: 'asc' | 'desc';
    };
    const {page, limit, search, category, minPrice, maxPrice, minRating, sortBy, sortOrder} =
      queryData;
    const skip = (page - 1) * limit;

    const query: FilterQuery<Book> = {};

    // Search functionality - Use regex for better partial matching
    if (search) {
      query.$or = [
        {title: {$regex: search, $options: 'i'}},
        {author: {$regex: search, $options: 'i'}},
        {isbn: {$regex: search, $options: 'i'}},
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    // Rating filter
    if (minRating) {
      query.rating = {$gte: minRating};
    }

    // Sorting
    const sort: Record<string, 1 | -1> = {[sortBy]: sortOrder === 'asc' ? 1 : -1};

    const books = await BookModel.find(query).sort(sort).skip(skip).limit(limit);

    const total = await BookModel.countDocuments(query);

    res.json({
      books,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching books:', error);
    res.status(500).json({message: 'Error fetching books'});
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const book = await BookModel.findOne({id: req.params['id'] as string});
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({message: 'Book not found'});
    }
  } catch (error) {
    logger.error('Error fetching book:', error);
    res.status(500).json({message: 'Error fetching book'});
  }
});

router.post('/', validateBody, async (req: Request, res: Response) => {
  try {
    const newBookData = {
      ...res.locals['body'],
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
    };
    const newBook = new BookModel(newBookData);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    logger.error('Error creating book:', error);
    res.status(500).json({message: 'Error creating book'});
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedBook = await BookModel.findOneAndUpdate(
      {id: req.params['id'] as string},
      {$set: req.body},
      {new: true},
    );
    if (updatedBook) {
      res.json(updatedBook);
    } else {
      res.status(404).json({message: 'Book not found'});
    }
  } catch (error) {
    logger.error('Error updating book:', error);
    res.status(500).json({message: 'Error updating book'});
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await BookModel.deleteOne({id: req.params['id'] as string});
    if (result.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({message: 'Book not found'});
    }
  } catch (error) {
    logger.error('Error deleting book:', error);
    res.status(500).json({message: 'Error deleting book'});
  }
});

export default router;
