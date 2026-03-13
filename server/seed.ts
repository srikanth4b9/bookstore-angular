import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {BookModel} from './models/book.model.js';
import {CategoryModel} from './models/category.model.js';
import {logger} from './utils/logger.js';
import type {Book, Category} from './types/models.js';

dotenv.config();

const MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/bookstore';

const initialCategories: Category[] = [
  {id: '1', name: 'Fiction'},
  {id: '2', name: 'Non-fiction'},
  {id: '3', name: 'Technology'},
  {id: '4', name: 'Science'},
  {id: '5', name: 'Kids'},
  {id: '6', name: 'Education'},
];

const generateRandomBooks = (count: number): Book[] => {
  const books: Book[] = [];
  const authors = [
    'F. Scott Fitzgerald',
    'Robert C. Martin',
    'Harper Lee',
    'Yuval Noah Harari',
    'J.K. Rowling',
    'Stephen King',
    'Ernest Hemingway',
    'George Orwell',
  ];
  const categories = initialCategories.map((c) => c.name);
  const genres = [
    'Classic',
    'Literary Fiction',
    'Software Development',
    'Programming',
    'History',
    'Anthropology',
    'Fantasy',
    'Horror',
    'Mystery',
  ];

  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    books.push({
      id: i.toString(),
      title: `Book Title ${i}`,
      author: authors[Math.floor(Math.random() * authors.length)]!,
      description: `This is the description for book ${i}. It provides insightful information about the topic.`,
      price: parseFloat((Math.random() * 50 + 10).toFixed(2)),
      availability: true,
      stock: Math.floor(Math.random() * 100),
      category: category!,
      genre: [
        genres[Math.floor(Math.random() * genres.length)]!,
        genres[Math.floor(Math.random() * genres.length)]!,
      ],
      isbn: `978${Math.floor(Math.random() * 10000000000)}`,
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      reviews: [],
      imageUrl: `https://picsum.photos/seed/${i}/200/300`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    });
  }
  return books;
};

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

    // Seed 1000 Books
    const booksToSeed = generateRandomBooks(1000);
    // Insert in chunks for performance
    const chunkSize = 100;
    for (let i = 0; i < booksToSeed.length; i += chunkSize) {
      const chunk = booksToSeed.slice(i, i + chunkSize);
      await BookModel.insertMany(chunk);
      logger.info(`Seeded books ${i + 1} to ${Math.min(i + chunkSize, booksToSeed.length)}`);
    }

    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
