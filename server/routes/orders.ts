import type { Request, Response } from 'express';
import { Router } from 'express';
import { orders } from '../data/mock-data.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json(orders);
});

router.post('/', (req: Request, res: Response) => {
  const newOrder = {
    ...req.body,
    id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    orderDate: new Date(),
    status: 'pending'
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

export default router;
