import {ActivatedRoute} from '@angular/router';
import {MockBuilder, MockRender} from 'ng-mocks';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {of} from 'rxjs';

import {Book, CartItem} from '../../models/models';
import {BookDetailsComponent} from './book-details.component';
import {selectSelectedBookDetail, selectBooksLoading} from '../../store/books/books.selectors';
import {selectCartItems} from '../../store/cart/cart.selectors';
import {BooksActions} from '../../store/books/books.actions';
import {CartActions} from '../../store/cart/cart.actions';

const MOCK_BOOK: Book = {
  id: '1',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  description: 'A handbook of agile software craftsmanship',
  price: 34.99,
  availability: true,
  stock: 25,
  category: 'Technology',
  genre: ['Software Development'],
  isbn: '9780132350884',
  rating: 4.7,
  reviews: [],
  imageUrl: 'https://picsum.photos/seed/1/200/300',
  createdAt: new Date('2025-10-01'),
};

const MOCK_CART_ITEM: CartItem = {
  id: 'ci1',
  bookId: '1',
  bookTitle: 'Clean Code',
  bookPrice: 34.99,
  quantity: 2,
  imageUrl: 'https://picsum.photos/seed/1/200/300',
};

describe('BookDetailsComponent', () => {
  let store: MockStore;

  beforeEach(() => {
    return MockBuilder(BookDetailsComponent)
      .provide(
        provideMockStore({
          selectors: [
            {selector: selectSelectedBookDetail, value: null},
            {selector: selectBooksLoading, value: false},
            {selector: selectCartItems, value: []},
          ],
        }),
      )
      .provide({
        provide: ActivatedRoute,
        useValue: {
          params: of({id: '1'}),
        },
      });
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    const fixture = MockRender(BookDetailsComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should dispatch loadBook on init', () => {
    const fixture = MockRender(BookDetailsComponent);
    store = fixture.point.injector.get(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture.point.componentInstance.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(BooksActions.loadBook({id: '1'}));
  });

  it('should expose book from store selector', () => {
    store = MockRender(BookDetailsComponent).point.injector.get(MockStore);
    store.overrideSelector(selectSelectedBookDetail, MOCK_BOOK);
    store.refreshState();

    const fixture = MockRender(BookDetailsComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.book()).toEqual(MOCK_BOOK);
  });

  it('should dispatch addToCart', () => {
    const fixture = MockRender(BookDetailsComponent);
    store = fixture.point.injector.get(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture.point.componentInstance.addToCart(MOCK_BOOK);

    expect(store.dispatch).toHaveBeenCalledWith(CartActions.addToCart({book: MOCK_BOOK}));
  });

  it('should compute cartQuantity from cartItems', () => {
    store = MockRender(BookDetailsComponent).point.injector.get(MockStore);
    store.overrideSelector(selectSelectedBookDetail, MOCK_BOOK);
    store.overrideSelector(selectCartItems, [{...MOCK_CART_ITEM, quantity: 3}]);
    store.refreshState();

    const fixture = MockRender(BookDetailsComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.cartQuantity()).toBe(3);
  });

  it('should dispatch updateQuantity on incrementQuantity', () => {
    store = MockRender(BookDetailsComponent).point.injector.get(MockStore);
    store.overrideSelector(selectSelectedBookDetail, MOCK_BOOK);
    store.overrideSelector(selectCartItems, [{...MOCK_CART_ITEM}]);
    store.refreshState();

    const fixture = MockRender(BookDetailsComponent);
    store = fixture.point.injector.get(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
    fixture.point.componentInstance.incrementQuantity();

    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.updateQuantity({itemId: 'ci1', quantity: 3}),
    );
  });

  it('should dispatch updateQuantity on decrementQuantity', () => {
    store = MockRender(BookDetailsComponent).point.injector.get(MockStore);
    store.overrideSelector(selectSelectedBookDetail, MOCK_BOOK);
    store.overrideSelector(selectCartItems, [{...MOCK_CART_ITEM}]);
    store.refreshState();

    const fixture = MockRender(BookDetailsComponent);
    store = fixture.point.injector.get(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
    fixture.point.componentInstance.decrementQuantity();

    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.updateQuantity({itemId: 'ci1', quantity: 1}),
    );
  });
});
