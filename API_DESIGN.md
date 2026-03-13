### REST API Design for Library Book Store

#### User Management

- `POST /api/auth/register` - Create a new user
- `POST /api/auth/login` - Authenticate a user
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/addresses` - Get user addresses
- `POST /api/users/addresses` - Add new address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address
- `GET /api/users/wishlist` - Get user wishlist
- `POST /api/users/wishlist/:bookId` - Add book to wishlist
- `DELETE /api/users/wishlist/:bookId` - Remove book from wishlist

#### Book Catalog

- `GET /api/books` - List all books (with search, filter, sort params)
  - Query params: `q`, `category`, `author`, `genre`, `minPrice`, `maxPrice`, `minRating`, `sortBy`, `order`
- `GET /api/books/:id` - Get book details
- `GET /api/categories` - List all book categories
- `GET /api/books/best-sellers` - Get best selling books
- `GET /api/books/new-arrivals` - Get new arrivals

#### Shopping Cart

- `GET /api/cart` - Get current user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

#### Checkout & Orders

- `POST /api/orders` - Place a new order
- `GET /api/orders` - List user's order history
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/cancel` - Cancel an order
- `GET /api/orders/:id/invoice` - Download order invoice

#### Reviews & Ratings

- `POST /api/books/:id/reviews` - Submit a review
- `GET /api/books/:id/reviews` - Get reviews for a book

#### Admin Features

- `GET /api/admin/books` - List all books for admin
- `POST /api/admin/books` - Add a new book
- `PUT /api/admin/books/:id` - Update book details
- `DELETE /api/admin/books/:id` - Delete a book
- `GET /api/admin/inventory` - View inventory status
- `GET /api/admin/users` - List all users
- `GET /api/admin/orders` - View all orders
- `GET /api/admin/analytics/sales` - Get sales analytics
