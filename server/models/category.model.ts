import { Schema, model } from 'mongoose';
import type { Category } from '../types/models.js';

const categorySchema = new Schema<Category>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String }
});

export const CategoryModel = model<Category>('Category', categorySchema);
