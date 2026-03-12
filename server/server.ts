import express from 'express';
import cors from 'cors';
import bookRoutes from './routes/books.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { requestLogger } from './middleware/request-logger.js';
import { logger } from './utils/logger.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// --- ROUTES ---
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);

// Compatibility redirects for top-level routes to /api
app.get('/books', (req, res) => res.redirect('/api/books'));
app.get('/books/:id', (req, res) => res.redirect(`/api/books/${req.params.id}`));
app.get('/categories', (req, res) => res.redirect('/api/categories'));
app.get('/orders', (req, res) => res.redirect('/api/orders'));

// --- ERROR HANDLING ---
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});
