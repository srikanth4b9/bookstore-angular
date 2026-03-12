import type { Request, Response } from 'express';
import { Router } from 'express';
import { categories } from '../data/mock-data.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json(categories);
});

export default router;
