import { Injectable, signal, computed } from '@angular/core';
import { Book, Category, Review, CartItem, Cart, User, UserRole, Order, OrderStatus, Address } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // --- BOOKS ---
  private _books = signal<Book[]>([
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
  ]);

  readonly books = this._books.asReadonly();

  // --- CATEGORIES ---
  private _categories = signal<Category[]>([
    { id: '1', name: 'Fiction' },
    { id: '2', name: 'Non-fiction' },
    { id: '3', name: 'Technology' },
    { id: '4', name: 'Science' },
    { id: '5', name: 'Kids' },
    { id: '6', name: 'Education' }
  ]);

  readonly categories = this._categories.asReadonly();

  // --- USER ---
  private _currentUser = signal<User | null>({
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.USER,
    addresses: [
      { id: 'a1', street: '123 Main St', city: 'Reading', state: 'PA', zipCode: '19601', country: 'USA', isDefault: true }
    ],
    orderHistoryIds: [],
    wishlistIds: []
  });

  readonly currentUser = this._currentUser.asReadonly();

  // --- CART ---
  private _cart = signal<CartItem[]>([]);
  readonly cartItems = this._cart.asReadonly();
  readonly cartSubtotal = computed(() =>
    this._cart().reduce((sum, item) => sum + item.bookPrice * item.quantity, 0)
  );

  // --- ORDERS ---
  private _orders = signal<Order[]>([]);
  readonly orders = this._orders.asReadonly();

  constructor() {}

  // Methods to interact with mock data
  addToCart(book: Book) {
    this._cart.update(items => {
      const existing = items.find(i => i.bookId === book.id);
      if (existing) {
        return items.map(i => i.bookId === book.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, {
        id: Math.random().toString(36).substr(2, 9),
        bookId: book.id,
        bookTitle: book.title,
        bookPrice: book.price,
        quantity: 1,
        imageUrl: book.imageUrl
      }];
    });
  }

  removeFromCart(itemId: string) {
    this._cart.update(items => items.filter(i => i.id !== itemId));
  }

  updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }
    this._cart.update(items => items.map(i => i.id === itemId ? { ...i, quantity } : i));
  }

  placeOrder(address: Address, paymentMethod: string) {
    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: this._currentUser()?.id || 'guest',
      items: [...this._cart()],
      total: this.cartSubtotal(),
      shippingAddress: address,
      paymentMethod,
      status: OrderStatus.PENDING,
      orderDate: new Date()
    };
    this._orders.update(orders => [newOrder, ...orders]);
    this._cart.set([]);
    return newOrder;
  }
}
