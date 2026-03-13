import {Injectable, signal, computed, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Book, Category, CartItem, User, UserRole, Order, Address} from '../models/models';
import {firstValueFrom} from 'rxjs';
import {API_CONFIG} from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private http = inject(HttpClient);
  private apiUrl = API_CONFIG.baseUrl;

  // --- BOOKS ---
  private _books = signal<Book[]>([]);
  readonly books = this._books.asReadonly();

  private _pagination = signal({total: 0, page: 1, limit: 12, pages: 1});
  readonly pagination = this._pagination.asReadonly();

  // --- CATEGORIES ---
  private _categories = signal<Category[]>([]);
  readonly categories = this._categories.asReadonly();

  // --- USER ---
  private _currentUser = signal<User | null>({
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.USER,
    addresses: [
      {
        id: 'a1',
        street: '123 Main St',
        city: 'Reading',
        state: 'PA',
        zipCode: '19601',
        country: 'USA',
        isDefault: true,
      },
    ],
    orderHistoryIds: [],
    wishlistIds: [],
  });

  readonly currentUser = this._currentUser.asReadonly();

  // --- CART ---
  private _cart = signal<CartItem[]>([]);
  readonly cartItems = this._cart.asReadonly();
  readonly cartSubtotal = computed(() =>
    this._cart().reduce((sum, item) => sum + item.bookPrice * item.quantity, 0),
  );

  // --- ORDERS ---
  private _orders = signal<Order[]>([]);
  readonly orders = this._orders.asReadonly();

  // --- LOADING ---
  private _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    this.fetchInitialData();
  }

  private async fetchInitialData() {
    this._isLoading.set(true);
    try {
      await this.fetchBooks(1, 12);

      const [categoriesData, ordersData] = await Promise.all([
        firstValueFrom(this.http.get<Category[]>(`${this.apiUrl}/categories`)),
        firstValueFrom(this.http.get<Order[]>(`${this.apiUrl}/orders`)),
      ]);
      this._categories.set(categoriesData);
      this._orders.set(ordersData);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      this._isLoading.set(false);
    }
  }

  async fetchBooks(
    page = 1,
    limit = 12,
    search?: string,
    category?: string,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    this._isLoading.set(true);
    try {
      const params: Record<string, string | number> = {page, limit, sortBy, sortOrder};
      if (search) params['search'] = search;
      if (category) params['category'] = category;

      const response = await firstValueFrom(
        this.http.get<{
          books: Book[];
          pagination: {total: number; page: number; limit: number; pages: number};
        }>(`${this.apiUrl}/books`, {params}),
      );
      this._books.set(response.books);
      this._pagination.set(response.pagination);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      this._isLoading.set(false);
    }
  }

  // Methods to interact with data
  addToCart(book: Book) {
    this._cart.update((items) => {
      const existing = items.find((i) => i.bookId === book.id);
      if (existing) {
        return items.map((i) => (i.bookId === book.id ? {...i, quantity: i.quantity + 1} : i));
      }
      return [
        ...items,
        {
          id: Math.random().toString(36).substr(2, 9),
          bookId: book.id,
          bookTitle: book.title,
          bookPrice: book.price,
          quantity: 1,
          imageUrl: book.imageUrl,
        },
      ];
    });
  }

  removeFromCart(itemId: string) {
    this._cart.update((items) => items.filter((i) => i.id !== itemId));
  }

  updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }
    this._cart.update((items) => items.map((i) => (i.id === itemId ? {...i, quantity} : i)));
  }

  async placeOrder(address: Address, paymentMethod: string) {
    const orderData = {
      userId: this._currentUser()?.id || 'guest',
      items: [...this._cart()],
      total: this.cartSubtotal(),
      shippingAddress: address,
      paymentMethod,
    };

    try {
      const newOrder = await firstValueFrom(
        this.http.post<Order>(`${this.apiUrl}/orders`, orderData),
      );
      this._orders.update((orders) => [newOrder, ...orders]);
      this._cart.set([]);
      return newOrder;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  // Admin methods
  async addBook(book: Partial<Book>) {
    const newBook = await firstValueFrom(this.http.post<Book>(`${this.apiUrl}/books`, book));
    this._books.update((books) => [...books, newBook]);
    return newBook;
  }

  async updateBook(id: string, book: Partial<Book>) {
    const updatedBook = await firstValueFrom(
      this.http.put<Book>(`${this.apiUrl}/books/${id}`, book),
    );
    this._books.update((books) => books.map((b) => (b.id === id ? updatedBook : b)));
    return updatedBook;
  }

  async deleteBook(id: string) {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/books/${id}`));
    this._books.update((books) => books.filter((b) => b.id !== id));
  }
}
