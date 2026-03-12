import type { Request, Response } from 'express';
import { Router } from 'express';
import { OrderModel } from '../models/order.model.js';
import { OrderStatus } from '../types/models.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    logger.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const newOrderData = {
      ...req.body,
      id: 'ORD-' + Math.random().toString(36).substring(2, 11).toUpperCase(),
      orderDate: new Date(),
      status: OrderStatus.PENDING
    };
    const newOrder = new OrderModel(newOrderData);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    logger.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

export default router;
