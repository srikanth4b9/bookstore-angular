import { Schema, model } from 'mongoose';
import type { Book, Review } from '../types/models.js';

const reviewSchema = new Schema<Review>({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  bookId: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const bookSchema = new Schema<Book>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  genre: [{ type: String }],
  isbn: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: [reviewSchema],
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const BookModel = model<Book>('Book', bookSchema);
