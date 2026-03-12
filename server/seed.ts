import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { books, categories } from './data/mock-data.js';
import { BookModel } from './models/book.model.js';
import { CategoryModel } from './models/category.model.js';
import { logger } from './utils/logger.js';

dotenv.config();

const MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/bookstore';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB for seeding...');

    // Clear existing data
    await BookModel.deleteMany({});
    await CategoryModel.deleteMany({});
    logger.info('Cleared existing books and categories');

    // Seed Categories
    await CategoryModel.insertMany(categories);
    logger.info(`Successfully seeded ${categories.length} categories`);

    // Seed Books
    await BookModel.insertMany(books);
    logger.info(`Successfully seeded ${books.length} books`);

    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
