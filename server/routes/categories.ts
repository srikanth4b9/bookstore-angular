import type {Request, Response} from 'express';
import {Router} from 'express';
import {CategoryModel} from '../models/category.model.js';
import {BookModel} from '../models/book.model.js';
import {logger} from '../utils/logger.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find();

    // Enrich categories with book counts
    const enrichedCategories = await Promise.all(
      categories.map(async (cat) => {
        const count = await BookModel.countDocuments({category: cat.name});
        return {
          ...cat.toObject(),
          bookCount: count,
        };
      }),
    );

    res.json(enrichedCategories);
  } catch (error) {
    logger.error('Error fetching categories:', error);
    res.status(500).json({message: 'Error fetching categories'});
  }
});

export default router;
