export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  addresses: Address[];
  orderHistoryIds: string[];
  wishlistIds: string[];
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  availability: boolean;
  stock: number;
  category: string;
  genre: string[];
  isbn: string;
  rating: number;
  reviews: Review[];
  imageUrl: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface CartItem {
  id: string;
  bookId: string;
  bookTitle: string;
  bookPrice: number;
  quantity: number;
  imageUrl: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  status: OrderStatus;
  orderDate: Date;
  trackingNumber?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  bookCount?: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
