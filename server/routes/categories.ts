import type { Request, Response } from 'express';
import { Router } from 'express';
import { CategoryModel } from '../models/category.model.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find();
    res.json(categories);
  } catch (error) {
    logger.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

export default router;
