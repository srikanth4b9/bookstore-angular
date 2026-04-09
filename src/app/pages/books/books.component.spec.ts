import {MockBuilder, MockRender, ngMocks} from 'ng-mocks';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';

import {BooksComponent} from './books.component';
import {Book} from '../../models/models';
import {Action} from '@ngrx/store';
import {
  selectAllBooks,
  selectBooksPagination,
  selectBooksLoading,
} from '../../store/books/books.selectors';
import {selectAllCategories} from '../../store/categories/categories.selectors';
import {selectCartBookMap} from '../../store/cart/cart.selectors';
import {BooksActions} from '../../store/books/books.actions';
import {CartActions} from '../../store/cart/cart.actions';

const MOCK_BOOK: Book = {
  id: '1',
  title: 'Test Book',
  author: 'Author',
  price: 10,
  imageUrl: '',
  category: 'Tech',
  description: '',
  rating: 5,
  genre: [],
  availability: true,
  stock: 10,
  reviews: [],
  createdAt: new Date(),
  isbn: '123',
};

const DEFAULT_SELECTORS = [
  {selector: selectAllBooks, value: [] as Book[]},
  {selector: selectAllCategories, value: []},
  {selector: selectBooksPagination, value: {total: 0, page: 1, limit: 12, pages: 1}},
  {selector: selectBooksLoading, value: false},
  {selector: selectCartBookMap, value: new Map()},
];

class BooksUI {
  constructor(private fixture: ReturnType<typeof MockRender<BooksComponent>>) {}

  get searchInput() {
    return ngMocks.find('input[placeholder="Title, author, ISBN..."]');
  }

  get firstAddButton() {
    return ngMocks.find('.add-btn');
  }

  get booksGrid() {
    return ngMocks.find('.book-grid', null);
  }

  get booksList() {
    return ngMocks.find('.book-list-view', null);
  }

  triggerSearch(value: string) {
    ngMocks.trigger(this.searchInput, 'input', {target: {value}} as unknown as Event);
    this.fixture.detectChanges();
  }

  clickFirstAddButton() {
    ngMocks.click(this.firstAddButton);
    this.fixture.detectChanges();
  }
}

function collectActions(store: MockStore): unknown[] {
  const dispatched: unknown[] = [];
  store.scannedActions$.subscribe((action) => dispatched.push(action));
  return dispatched;
}

function renderWithDispatchSpy(): {
  fixture: ReturnType<typeof MockRender<BooksComponent>>;
  store: MockStore;
} {
  const fixture = MockRender(BooksComponent);
  const store = fixture.point.injector.get(MockStore);
  jest.spyOn(store, 'dispatch');
  return {fixture, store};
}

function renderWithSelectorOverrides(overrides: {selector: unknown; value: unknown}[]): MockStore {
  const store = MockRender(BooksComponent).point.injector.get(MockStore);
  for (const {selector, value} of overrides) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.overrideSelector(selector as any, value);
  }
  store.refreshState();
  return store;
}

describe('BooksComponent', () => {
  let store: MockStore;

  beforeEach(() => {
    return MockBuilder(BooksComponent)
      .provide(provideMockStore({selectors: DEFAULT_SELECTORS}))
      .provide({
        provide: ActivatedRoute,
        useValue: {queryParams: of({})},
      });
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should dispatch loadBooks on init', () => {
    const fixture = MockRender(BooksComponent);
    store = fixture.point.injector.get(MockStore);
    const dispatched = collectActions(store);

    expect(dispatched.some((a) => (a as Action).type === BooksActions.loadBooks.type)).toBe(true);
  });

  it('should dispatch loadBooks with search term after debounce', () => {
    jest.useFakeTimers();

    const fixture = MockRender(BooksComponent);
    store = fixture.point.injector.get(MockStore);
    const ui = new BooksUI(fixture);

    ui.triggerSearch('Angular');
    jest.advanceTimersByTime(400);
    fixture.detectChanges();

    const dispatched = collectActions(store);

    expect(
      dispatched.some(
        (a) =>
          (a as Action).type === BooksActions.loadBooks.type &&
          (a as Action & {search: string}).search === 'Angular',
      ),
    ).toBe(true);

    jest.useRealTimers();
  });

  it('should dispatch addToCart when clicking add button', async () => {
    renderWithSelectorOverrides([{selector: selectAllBooks, value: [MOCK_BOOK]}]);

    const {fixture, store: s} = renderWithDispatchSpy();
    store = s;

    await fixture.whenStable();
    fixture.detectChanges();

    const ui = new BooksUI(fixture);
    ui.clickFirstAddButton();

    expect(store.dispatch).toHaveBeenCalledWith(CartActions.addToCart({book: MOCK_BOOK}));
  });

  it('should dispatch loadBooks when category changes', () => {
    const {fixture, store: s} = renderWithDispatchSpy();
    store = s;

    fixture.point.componentInstance.selectedCategory.set('Tech');
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(
      BooksActions.loadBooks({
        page: 1,
        limit: 12,
        search: undefined,
        category: 'Tech',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    );
  });

  it('should dispatch loadBooks when sortBy changes', () => {
    const {fixture, store: s} = renderWithDispatchSpy();
    store = s;

    fixture.point.componentInstance.sortBy.set('price');
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(
      BooksActions.loadBooks({
        page: 1,
        limit: 12,
        search: undefined,
        category: undefined,
        sortBy: 'price',
        sortOrder: 'desc',
      }),
    );
  });

  it('should dispatch loadBooks when sortOrder changes', () => {
    const {fixture, store: s} = renderWithDispatchSpy();
    store = s;

    fixture.point.componentInstance.sortOrder.set('asc');
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(
      BooksActions.loadBooks({
        page: 1,
        limit: 12,
        search: undefined,
        category: undefined,
        sortBy: 'createdAt',
        sortOrder: 'asc',
      }),
    );
  });

  it('should dispatch loadBooks when onPageChange is called', () => {
    const {fixture, store: s} = renderWithDispatchSpy();
    store = s;

    fixture.point.componentInstance.onPageChange({
      pageIndex: 1,
      pageSize: 24,
      length: 100,
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      BooksActions.loadBooks({
        page: 2,
        limit: 24,
        search: undefined,
        category: undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    );
  });

  it('should toggle view mode', async () => {
    renderWithSelectorOverrides([{selector: selectAllBooks, value: [MOCK_BOOK]}]);

    const fixture = MockRender(BooksComponent);
    const ui = new BooksUI(fixture);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.point.componentInstance.viewMode()).toBe('grid');
    expect(ui.booksGrid).toBeTruthy();

    fixture.point.componentInstance.viewMode.set('list');
    fixture.detectChanges();
    expect(ui.booksList).toBeTruthy();

    fixture.point.componentInstance.viewMode.set('grid');
    fixture.detectChanges();
    expect(ui.booksGrid).toBeTruthy();
  });

  it('should set category from query params on init', async () => {
    await MockBuilder(BooksComponent)
      .provide(provideMockStore({selectors: DEFAULT_SELECTORS}))
      .provide({
        provide: ActivatedRoute,
        useValue: {queryParams: of({category: 'Tech'})},
      });

    const fixture = MockRender(BooksComponent);
    store = fixture.point.injector.get(MockStore);

    expect(fixture.point.componentInstance.selectedCategory()).toBe('Tech');

    const dispatched = collectActions(store);

    expect(
      dispatched.some(
        (a) =>
          (a as Action).type === BooksActions.loadBooks.type &&
          (a as Action & {category: string}).category === 'Tech',
      ),
    ).toBe(true);
  });

  it('should build cartBookMap from store selector', () => {
    const cartMap = new Map([['b1', {cartItemId: 'ci1', quantity: 2}]]);
    renderWithSelectorOverrides([{selector: selectCartBookMap, value: cartMap}]);

    const fixture = MockRender(BooksComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.cartBookMap().get('b1')).toEqual({
      cartItemId: 'ci1',
      quantity: 2,
    });
  });

  it('should dispatch updateQuantity when incrementQuantity is called', () => {
    const cartMap = new Map([['b1', {cartItemId: 'ci1', quantity: 2}]]);
    renderWithSelectorOverrides([{selector: selectCartBookMap, value: cartMap}]);

    const {fixture, store: s} = renderWithDispatchSpy();
    store = s;

    fixture.point.componentInstance.incrementQuantity('b1');
    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.updateQuantity({itemId: 'ci1', quantity: 3}),
    );
  });

  it('should dispatch updateQuantity when decrementQuantity is called', () => {
    const cartMap = new Map([['b1', {cartItemId: 'ci1', quantity: 3}]]);
    renderWithSelectorOverrides([{selector: selectCartBookMap, value: cartMap}]);

    const {fixture, store: s} = renderWithDispatchSpy();
    store = s;

    fixture.point.componentInstance.decrementQuantity('b1');
    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.updateQuantity({itemId: 'ci1', quantity: 2}),
    );
  });
});
