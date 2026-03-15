# Database Schema

Database: **MongoDB**
Default URI: `mongodb://localhost:27017/bookstore`

## Collections

### books

| Field | Type | Required | Indexed | Notes |
|-------|------|----------|---------|-------|
| `id` | String | Yes | Unique | Primary identifier |
| `title` | String | Yes | Yes | Also in text index |
| `author` | String | Yes | Yes | Also in text index |
| `description` | String | Yes | — | Also in text index |
| `price` | Number | Yes | Yes | |
| `availability` | Boolean | — | — | Default: `true` |
| `stock` | Number | Yes | — | |
| `category` | String | Yes | Yes | Category name |
| `genre` | [String] | — | Yes | Array of genre names |
| `isbn` | String | Yes | Unique | 13-digit ISBN |
| `rating` | Number | — | Yes | Default: `0`, range 0–5 |
| `reviews` | [Review] | — | — | Embedded subdocuments |
| `imageUrl` | String | Yes | — | Cover image URL |
| `createdAt` | Date | — | Yes | Default: `Date.now` |

**Text Index:** `{title: 'text', author: 'text', description: 'text'}`

**Review subdocument:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | String | Yes | |
| `userId` | String | Yes | |
| `userName` | String | Yes | |
| `bookId` | String | Yes | |
| `rating` | Number | Yes | Range 0–5 |
| `comment` | String | Yes | |
| `date` | Date | — | Default: `Date.now` |

---

### categories

| Field | Type | Required | Indexed | Notes |
|-------|------|----------|---------|-------|
| `id` | String | Yes | Unique | Primary identifier |
| `name` | String | Yes | — | |
| `description` | String | No | — | |

**Note:** The `bookCount` field in API responses is computed at query time via aggregation on the books collection — it is not stored.

---

### orders

| Field | Type | Required | Indexed | Notes |
|-------|------|----------|---------|-------|
| `id` | String | Yes | Unique | Format: `ORD-XXXXXXXX` |
| `userId` | String | Yes | — | |
| `items` | [CartItem] | Yes | — | Embedded subdocuments |
| `total` | Number | Yes | — | |
| `shippingAddress` | Address | Yes | — | Embedded subdocument |
| `paymentMethod` | String | Yes | — | |
| `status` | String | — | — | Enum: `pending`, `shipped`, `delivered`, `cancelled`. Default: `pending` |
| `orderDate` | Date | — | — | Default: `Date.now` |
| `trackingNumber` | String | No | — | |

**CartItem subdocument:**

| Field | Type | Required |
|-------|------|----------|
| `id` | String | Yes |
| `bookId` | String | Yes |
| `bookTitle` | String | Yes |
| `bookPrice` | Number | Yes |
| `quantity` | Number | Yes (min: 1) |
| `imageUrl` | String | Yes |

**Address subdocument:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | String | Yes | |
| `street` | String | Yes | |
| `city` | String | Yes | |
| `state` | String | Yes | |
| `zipCode` | String | Yes | |
| `country` | String | Yes | |
| `isDefault` | Boolean | — | Default: `false` |

## Seeding

Run `cd server && npm run seed` to populate:
- **6 categories:** Fiction, Non-fiction, Technology, Science, Kids, Education
- **1,000 books** with randomized titles, prices ($10–60), ratings (3.0–5.0), stock (0–100), and cover images from picsum.photos

Books are inserted in chunks of 100 for performance.
