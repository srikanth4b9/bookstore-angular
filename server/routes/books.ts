import type { Request, Response } from 'express';
import { Router } from 'express';
import { BookModel } from '../models/book.model.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const books = await BookModel.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    logger.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const book = await BookModel.findOne({ id: req.params.id });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    logger.error('Error fetching book:', error);
    res.status(500).json({ message: 'Error fetching book' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const newBookData = {
      ...req.body,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
    };
    const newBook = new BookModel(newBookData);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    logger.error('Error creating book:', error);
    res.status(500).json({ message: 'Error creating book' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedBook = await BookModel.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (updatedBook) {
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    logger.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await BookModel.deleteOne({ id: req.params.id });
    if (result.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    logger.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error deleting book' });
  }
});

export default router;
