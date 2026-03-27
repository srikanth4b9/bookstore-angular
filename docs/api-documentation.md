# API Documentation

Base URL: `http://localhost:3000/api`

## Books

### List Books

```
GET /api/books
```

**Query Parameters:**

| Parameter   | Type   | Default     | Description                                               |
| ----------- | ------ | ----------- | --------------------------------------------------------- |
| `page`      | number | 1           | Page number (min: 1)                                      |
| `limit`     | number | 12          | Items per page (min: 1, max: 100)                         |
| `search`    | string | —           | Search by title, author, or ISBN (case-insensitive regex) |
| `category`  | string | —           | Filter by category name                                   |
| `minPrice`  | number | —           | Minimum price filter                                      |
| `maxPrice`  | number | —           | Maximum price filter                                      |
| `minRating` | number | —           | Minimum rating filter (0–5)                               |
| `sortBy`    | string | `createdAt` | Sort field: `createdAt`, `price`, `rating`, `title`       |
| `sortOrder` | string | `desc`      | Sort direction: `asc`, `desc`                             |

**Response: 200 OK**

```json
{
  "books": [
    {
      "id": "1",
      "title": "Book Title",
      "author": "Author Name",
      "description": "Description text",
      "price": 29.99,
      "availability": true,
      "stock": 50,
      "category": "Fiction",
      "genre": ["Classic", "Literary Fiction"],
      "isbn": "9781234567890",
      "rating": 4.5,
      "reviews": [],
      "imageUrl": "https://example.com/image.jpg",
      "createdAt": "2026-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 1000,
    "page": 1,
    "limit": 12,
    "pages": 84
  }
}
```

### Get Book by ID

```
GET /api/books/:id
```

**Response: 200 OK** — Single Book object

**Response: 404 Not Found**

```json
{
  "message": "Book not found"
}
```

### Create Book

```
POST /api/books
```

**Request Body:**

| Field         | Type     | Required | Description                   |
| ------------- | -------- | -------- | ----------------------------- |
| `title`       | string   | Yes      | Book title                    |
| `author`      | string   | Yes      | Author name                   |
| `description` | string   | Yes      | Book description              |
| `price`       | number   | Yes      | Price (min: 0)                |
| `stock`       | number   | Yes      | Stock count (integer, min: 0) |
| `category`    | string   | Yes      | Category name                 |
| `genre`       | string[] | No       | List of genres                |
| `isbn`        | string   | Yes      | ISBN (unique)                 |
| `imageUrl`    | string   | Yes      | Valid URI for cover image     |

**Response: 201 Created** — Newly created Book object

**Response: 400 Bad Request** — Validation errors

```json
{
  "errors": [{"message": "\"title\" is required", "path": ["title"]}]
}
```

### Update Book

```
PUT /api/books/:id
```

**Request Body:** Any partial Book fields

**Response: 200 OK** — Updated Book object

**Response: 404 Not Found**

### Delete Book

```
DELETE /api/books/:id
```

**Response: 204 No Content**

**Response: 404 Not Found**

---

## Categories

### List Categories

```
GET /api/categories
```

**Response: 200 OK**

```json
[
  {
    "id": "cat-1",
    "name": "Fiction",
    "description": "Fiction books",
    "bookCount": 167
  }
]
```

Each category includes a `bookCount` derived from an aggregation on the books collection.

---

## Orders

### List Orders

```
GET /api/orders
```

**Response: 200 OK** — Array of Order objects, sorted by `orderDate` descending (newest first)

### Create Order

```
POST /api/orders
```

**Request Body:**

| Field             | Type       | Required | Description             |
| ----------------- | ---------- | -------- | ----------------------- |
| `userId`          | string     | Yes      | User placing the order  |
| `items`           | CartItem[] | Yes      | Array of cart items     |
| `total`           | number     | Yes      | Order total             |
| `shippingAddress` | Address    | Yes      | Shipping address object |
| `paymentMethod`   | string     | Yes      | Payment method          |

**Auto-generated fields:**

- `id` — Format: `ORD-XXXXXXXX` (random alphanumeric)
- `orderDate` — Current timestamp
- `status` — `pending`

**Response: 201 Created** — Order object

---

## Error Responses

All errors follow this format:

```json
{
  "message": "Error description",
  "stack": "Stack trace (hidden in production)"
}
```

| Status | Description           |
| ------ | --------------------- |
| 400    | Validation error      |
| 404    | Resource not found    |
| 500    | Internal server error |
