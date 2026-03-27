import {BooksComponent} from './books.component';
import {MockBuilder, MockRender, ngMocks, MockInstance} from 'ng-mocks';
import {MockDataService} from '../../services/mock-data.service';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {signal} from '@angular/core';
import {Book} from '../../models/models';

class BooksUI {
  constructor(private fixture: ReturnType<typeof MockRender<BooksComponent>>) {}

  get searchInput() {
    return ngMocks.find('input[placeholder="Title, author, ISBN..."]');
  }

  get categorySelect() {
    return ngMocks.find('mat-select[placeholder="Category"]', null);
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

  selectCategory(value: string) {
    if (this.categorySelect) {
      ngMocks.change(this.categorySelect, value);
      this.fixture.detectChanges();
    }
  }

  clickFirstAddButton() {
    ngMocks.click(this.firstAddButton);
    this.fixture.detectChanges();
  }
}

describe('BooksComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(BooksComponent)
      .mock(MockDataService, {
        books: signal([]),
        categories: signal([]),
        pagination: signal({total: 0, page: 1, limit: 12, pages: 1}),
        isLoading: signal(false),
        fetchBooks: jest.fn(),
        addToCart: jest.fn(),
        cartItems: signal([]),
        updateQuantity: jest.fn(),
      })
      .provide({
        provide: ActivatedRoute,
        useValue: {
          queryParams: of({}),
        },
      });
  });

  it('should call fetchBooks on init', () => {
    const fixture = MockRender(BooksComponent);
    const mockDataService = ngMocks.get(MockDataService);
    fixture.detectChanges();

    // Initial call from effect()
    expect(mockDataService.fetchBooks).toHaveBeenCalled();
  });

  it('should update search term when input changes', async () => {
    const fixture = MockRender(BooksComponent);
    const ui = new BooksUI(fixture);
    const mockDataService = ngMocks.get(MockDataService);

    ui.triggerSearch('Angular');

    // Wait for debounceTime(400)
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(mockDataService.fetchBooks).toHaveBeenCalledWith(
      1,
      12,
      'Angular',
      '',
      'createdAt',
      'desc',
    );
  });

  it('should add book to cart when clicking add button', async () => {
    // Setup mock data
    const mockBook: Book = {
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

    MockInstance(MockDataService, () => ({
      books: signal([mockBook]),
      pagination: signal({total: 1, page: 1, limit: 12, pages: 1}),
      isLoading: signal(false),
      fetchBooks: jest.fn(),
      addToCart: jest.fn(),
      cartItems: signal([]),
      updateQuantity: jest.fn(),
    }));

    const fixture = MockRender(BooksComponent);
    const ui = new BooksUI(fixture);

    // Wait for defer block
    await fixture.whenStable();
    fixture.detectChanges();

    ui.clickFirstAddButton();

    const mockDataService = ngMocks.get(MockDataService);
    expect(mockDataService.addToCart).toHaveBeenCalledWith(mockBook);
  });

  it('should change category when selection changes', () => {
    const fixture = MockRender(BooksComponent);
    const mockDataService = ngMocks.get(MockDataService);

    fixture.point.componentInstance.selectedCategory.set('Tech');
    fixture.detectChanges();

    expect(mockDataService.fetchBooks).toHaveBeenCalledWith(1, 12, '', 'Tech', 'createdAt', 'desc');
  });

  it('should call fetchBooks when sortBy changes', () => {
    const fixture = MockRender(BooksComponent);
    const mockDataService = ngMocks.get(MockDataService);

    fixture.point.componentInstance.sortBy.set('price');
    fixture.detectChanges();

    expect(mockDataService.fetchBooks).toHaveBeenCalledWith(1, 12, '', '', 'price', 'desc');
  });

  it('should call fetchBooks when sortOrder changes', () => {
    const fixture = MockRender(BooksComponent);
    const mockDataService = ngMocks.get(MockDataService);

    fixture.point.componentInstance.sortOrder.set('asc');
    fixture.detectChanges();

    expect(mockDataService.fetchBooks).toHaveBeenCalledWith(1, 12, '', '', 'createdAt', 'asc');
  });

  it('should call fetchBooks when onPageChange is called', () => {
    const fixture = MockRender(BooksComponent);
    const mockDataService = ngMocks.get(MockDataService);

    fixture.point.componentInstance.onPageChange({
      pageIndex: 1,
      pageSize: 24,
      length: 100,
    });

    expect(mockDataService.fetchBooks).toHaveBeenCalledWith(2, 24, '', '', 'createdAt', 'desc');
  });

  it('should toggle view mode', async () => {
    // Setup mock data so that the @for loop has something to render
    const mockBook: Book = {
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

    MockInstance(MockDataService, () => ({
      books: signal([mockBook]),
      pagination: signal({total: 1, page: 1, limit: 12, pages: 1}),
      isLoading: signal(false),
      fetchBooks: jest.fn(),
      cartItems: signal([]),
      updateQuantity: jest.fn(),
    }));

    const fixture = MockRender(BooksComponent);
    const ui = new BooksUI(fixture);

    // Wait for defer block
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
      .mock(MockDataService, {
        books: signal([]),
        categories: signal([]),
        pagination: signal({total: 0, page: 1, limit: 12, pages: 1}),
        isLoading: signal(false),
        fetchBooks: jest.fn(),
        addToCart: jest.fn(),
        cartItems: signal([]),
        updateQuantity: jest.fn(),
      })
      .provide({
        provide: ActivatedRoute,
        useValue: {
          queryParams: of({category: 'Tech'}),
        },
      });

    const fixture = MockRender(BooksComponent);
    const mockDataService = ngMocks.get(MockDataService);

    expect(fixture.point.componentInstance.selectedCategory()).toBe('Tech');
    expect(mockDataService.fetchBooks).toHaveBeenCalledWith(1, 12, '', 'Tech', 'createdAt', 'desc');
  });

  it('should build cartBookMap from cartItems', () => {
    MockInstance(MockDataService, () => ({
      books: signal([]),
      pagination: signal({total: 0, page: 1, limit: 12, pages: 1}),
      isLoading: signal(false),
      fetchBooks: jest.fn(),
      addToCart: jest.fn(),
      cartItems: signal([{id: 'ci1', bookId: 'b1', title: 'Test', price: 10, quantity: 2}]),
      updateQuantity: jest.fn(),
    }));

    const fixture = MockRender(BooksComponent);
    fixture.detectChanges();

    const map = fixture.point.componentInstance.cartBookMap();
    expect(map.get('b1')).toEqual({cartItemId: 'ci1', quantity: 2});
  });

  it('should call updateQuantity when incrementQuantity is called', () => {
    const updateQuantity = jest.fn();

    MockInstance(MockDataService, () => ({
      books: signal([]),
      pagination: signal({total: 0, page: 1, limit: 12, pages: 1}),
      isLoading: signal(false),
      fetchBooks: jest.fn(),
      addToCart: jest.fn(),
      cartItems: signal([{id: 'ci1', bookId: 'b1', title: 'Test', price: 10, quantity: 2}]),
      updateQuantity,
    }));

    const fixture = MockRender(BooksComponent);
    fixture.detectChanges();

    fixture.point.componentInstance.incrementQuantity('b1');
    expect(updateQuantity).toHaveBeenCalledWith('ci1', 3);
  });

  it('should call updateQuantity when decrementQuantity is called', () => {
    const updateQuantity = jest.fn();

    MockInstance(MockDataService, () => ({
      books: signal([]),
      pagination: signal({total: 0, page: 1, limit: 12, pages: 1}),
      isLoading: signal(false),
      fetchBooks: jest.fn(),
      addToCart: jest.fn(),
      cartItems: signal([{id: 'ci1', bookId: 'b1', title: 'Test', price: 10, quantity: 3}]),
      updateQuantity,
    }));

    const fixture = MockRender(BooksComponent);
    fixture.detectChanges();

    fixture.point.componentInstance.decrementQuantity('b1');
    expect(updateQuantity).toHaveBeenCalledWith('ci1', 2);
  });
});
