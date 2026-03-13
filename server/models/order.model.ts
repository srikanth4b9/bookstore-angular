import {Schema, model} from 'mongoose';
import type {Order, Address, CartItem} from '../types/models.js';
import {OrderStatus} from '../types/models.js';

const addressSchema = new Schema<Address>({
  id: {type: String, required: true},
  street: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  zipCode: {type: String, required: true},
  country: {type: String, required: true},
  isDefault: {type: Boolean, default: false},
});

const cartItemSchema = new Schema<CartItem>({
  id: {type: String, required: true},
  bookId: {type: String, required: true},
  bookTitle: {type: String, required: true},
  bookPrice: {type: Number, required: true},
  quantity: {type: Number, required: true, min: 1},
  imageUrl: {type: String, required: true},
});

const orderSchema = new Schema<Order>({
  id: {type: String, required: true, unique: true},
  userId: {type: String, required: true},
  items: [cartItemSchema],
  total: {type: Number, required: true},
  shippingAddress: {type: addressSchema, required: true},
  paymentMethod: {type: String, required: true},
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  },
  orderDate: {type: Date, default: Date.now},
  trackingNumber: {type: String},
});

export const OrderModel = model<Order>('Order', orderSchema);
