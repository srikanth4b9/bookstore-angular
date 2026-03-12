import type { Request, Response } from 'express';
import { Router } from 'express';
import { books, setBooks } from '../data/mock-data.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json(books);
});

router.get('/:id', (req: Request, res: Response) => {
  const book = books.find((b) => b.id === req.params.id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

router.post('/', (req: Request, res: Response) => {
  const newBook = {
    ...req.body,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

router.put('/:id', (req: Request, res: Response) => {
  const index = books.findIndex((b) => b.id === req.params.id);
  if (index !== -1) {
    books[index] = { ...books[index], ...req.body };
    res.json(books[index]);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  setBooks(books.filter((b) => b.id !== req.params.id));
  res.status(204).send();
});

export default router;
