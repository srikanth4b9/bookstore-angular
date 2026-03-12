import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { BookModel } from './models/book.model.js';
import { CategoryModel } from './models/category.model.js';
import { logger } from './utils/logger.js';
import type { Book, Category } from './types/models.js';

dotenv.config();

const MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/bookstore';

const initialBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A novel set in the Roaring Twenties that tells the story of the mysterious Jay Gatsby and his obsession with the beautiful Daisy Buchanan.',
    price: 15.99,
    availability: true,
    stock: 50,
    category: 'Fiction',
    genre: ['Classic', 'Literary Fiction'],
    isbn: '9780743273565',
    rating: 4.5,
    reviews: [],
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    description: 'A Handbook of Agile Software Craftsmanship.',
    price: 45.00,
    availability: true,
    stock: 20,
    category: 'Technology',
    genre: ['Software Development', 'Programming'],
    isbn: '9780132350884',
    rating: 4.8,
    reviews: [],
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436202607i/3735293.jpg',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
    price: 12.99,
    availability: true,
    stock: 35,
    category: 'Fiction',
    genre: ['Classic', 'Southern Gothic'],
    isbn: '9780061120084',
    rating: 4.9,
    reviews: [],
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg',
    createdAt: new Date('2024-02-01')
  },
  {
    id: '4',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    description: 'Earth is 4.5 billion years old. In just a fraction of that time, one species among countless others has conquered it: us. We are the most advanced and most destructive animals ever to have lived.',
    price: 22.50,
    availability: true,
    stock: 15,
    category: 'Non-fiction',
    genre: ['History', 'Anthropology'],
    isbn: '9780062316097',
    rating: 4.7,
    reviews: [],
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1595674533i/23692271.jpg',
    createdAt: new Date('2024-02-10')
  }
];

const initialCategories: Category[] = [
  { id: '1', name: 'Fiction' },
  { id: '2', name: 'Non-fiction' },
  { id: '3', name: 'Technology' },
  { id: '4', name: 'Science' },
  { id: '5', name: 'Kids' },
  { id: '6', name: 'Education' }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB for seeding...');

    // Clear existing data
    await BookModel.deleteMany({});
    await CategoryModel.deleteMany({});
    logger.info('Cleared existing books and categories');

    // Seed Categories
    await CategoryModel.insertMany(initialCategories);
    logger.info(`Successfully seeded ${initialCategories.length} categories`);

    // Seed Books
    await BookModel.insertMany(initialBooks);
    logger.info(`Successfully seeded ${initialBooks.length} books`);

    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
