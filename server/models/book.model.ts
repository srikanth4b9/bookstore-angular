import {Schema, model} from 'mongoose';
import type {Book, Review} from '../types/models.js';

const reviewSchema = new Schema<Review>({
  id: {type: String, required: true},
  userId: {type: String, required: true},
  userName: {type: String, required: true},
  bookId: {type: String, required: true},
  rating: {type: Number, required: true, min: 0, max: 5},
  comment: {type: String, required: true},
  date: {type: Date, default: Date.now},
});

const bookSchema = new Schema<Book>({
  id: {type: String, required: true, unique: true, index: true},
  title: {type: String, required: true, index: true},
  author: {type: String, required: true, index: true},
  description: {type: String, required: true},
  price: {type: Number, required: true, index: true},
  availability: {type: Boolean, default: true},
  stock: {type: Number, required: true},
  category: {type: String, required: true, index: true},
  genre: [{type: String, index: true}],
  isbn: {type: String, required: true, unique: true},
  rating: {type: Number, default: 0, index: true},
  reviews: [reviewSchema],
  imageUrl: {type: String, required: true},
  createdAt: {type: Date, default: Date.now, index: true},
});

// Text index for search
bookSchema.index({title: 'text', author: 'text', description: 'text'});

export const BookModel = model<Book>('Book', bookSchema);
