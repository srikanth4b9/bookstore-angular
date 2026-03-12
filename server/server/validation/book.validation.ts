import Joi from 'joi';

export const bookQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  search: Joi.string().allow('').optional(),
  category: Joi.string().allow('').optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  minRating: Joi.number().min(0).max(5).optional(),
  sortBy: Joi.string().valid('createdAt', 'price', 'rating', 'title').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

export const bookCreateSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().required(),
  genre: Joi.array().items(Joi.string()).optional(),
  isbn: Joi.string().required(),
  imageUrl: Joi.string().uri().required()
});
