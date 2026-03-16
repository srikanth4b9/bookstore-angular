import {signal, computed} from '@angular/core';
import {MockDataService} from '../services/mock-data.service';
import {MOCK_BOOKS, MOCK_CATEGORIES, MOCK_CART_ITEMS, MOCK_USER, MOCK_ORDERS} from './mock-data';
import {Book, CartItem, User} from '../models/models';

export function createMockDataService(overrides?: {
  books?: Book[];
  cartItems?: CartItem[];
  user?: User | null;
  isLoading?: boolean;
}) {
  const books = overrides?.books ?? MOCK_BOOKS;
  const cartItems = overrides?.cartItems ?? [];
  const user = overrides?.user !== undefined ? overrides.user : MOCK_USER;
  const isLoading = overrides?.isLoading ?? false;

  const _cartItems = signal(cartItems);

  return {
    provide: MockDataService,
    useValue: {
      books: signal(books),
      pagination: signal({total: books.length, page: 1, limit: 12, pages: 1}),
      categories: signal(MOCK_CATEGORIES),
      currentUser: signal(user),
      cartItems: _cartItems.asReadonly(),
      cartSubtotal: computed(() =>
        _cartItems().reduce((sum, item) => sum + item.bookPrice * item.quantity, 0),
      ),
      orders: signal(MOCK_ORDERS),
      isLoading: signal(isLoading),
      fetchBooks: () => Promise.resolve(),
      fetchInitialData: () => Promise.resolve(),
      addToCart: (book: Book) => {
        _cartItems.update((items) => [
          ...items,
          {
            id: `ci-${Date.now()}`,
            bookId: book.id,
            bookTitle: book.title,
            bookPrice: book.price,
            quantity: 1,
            imageUrl: book.imageUrl,
          },
        ]);
      },
      removeFromCart: (id: string) => {
        _cartItems.update((items) => items.filter((i) => i.id !== id));
      },
      updateQuantity: (id: string, qty: number) => {
        _cartItems.update((items) =>
          qty <= 0
            ? items.filter((i) => i.id !== id)
            : items.map((i) => (i.id === id ? {...i, quantity: qty} : i)),
        );
      },
      placeOrder: () => Promise.resolve(MOCK_ORDERS[0]),
      addBook: () => Promise.resolve(MOCK_BOOKS[0]),
      updateBook: () => Promise.resolve(MOCK_BOOKS[0]),
      deleteBook: () => Promise.resolve(),
    },
  };
}
