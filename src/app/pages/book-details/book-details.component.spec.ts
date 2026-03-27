import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ActivatedRoute} from '@angular/router';
import {MockBuilder, MockRender, ngMocks} from 'ng-mocks';
import {of} from 'rxjs';
import {signal} from '@angular/core';

import {Book} from '../../models/models';
import {MockDataService} from '../../services/mock-data.service';
import {BookDetailsComponent} from './book-details.component';

describe('BookDetailsComponent', () => {
  beforeEach(() => {
    return MockBuilder(BookDetailsComponent)
      .mock(MockDataService, {
        addToCart: jest.fn(),
        cartItems: signal([]),
        updateQuantity: jest.fn(),
      })
      .replace(HttpClientTestingModule, HttpClientTestingModule)
      .provide({
        provide: ActivatedRoute,
        useValue: {
          params: of({id: '1'}),
        },
      });
  });

  it('should create', () => {
    const fixture = MockRender(BookDetailsComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should fetch book details on init', async () => {
    const fixture = MockRender(BookDetailsComponent);
    const httpMock = ngMocks.get(HttpTestingController);

    const mockBook: Book = {
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

    const req = httpMock.expectOne((r) => r.url.includes('/books/1'));
    req.flush(mockBook);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fixture.point.componentInstance.book()).toEqual(mockBook);
    expect(fixture.point.componentInstance.isLoading()).toBe(false);
  });

  it('should handle fetch error gracefully', async () => {
    const fixture = MockRender(BookDetailsComponent);
    const httpMock = ngMocks.get(HttpTestingController);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const req = httpMock.expectOne((r) => r.url.includes('/books/1'));
    req.error(new ProgressEvent('Network error'));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fixture.point.componentInstance.book()).toBeUndefined();
    expect(fixture.point.componentInstance.isLoading()).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should add book to cart', () => {
    const fixture = MockRender(BookDetailsComponent);
    const httpMock = ngMocks.get(HttpTestingController);
    httpMock.match(() => true).forEach((r) => r.flush({}));

    const component = fixture.point.componentInstance;
    const mockDataService = ngMocks.get(MockDataService);
    const mockBook = {id: '1', title: 'Test'} as Book;

    component.addToCart(mockBook);

    expect(mockDataService.addToCart).toHaveBeenCalledWith(mockBook);
  });

  it('should compute cartQuantity from cartItems', async () => {
    const mockBook: Book = {
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

    const cartItems = signal([
      {id: 'ci1', bookId: '1', title: 'Clean Code', price: 34.99, quantity: 3},
    ]);

    await MockBuilder(BookDetailsComponent)
      .mock(MockDataService, {
        addToCart: jest.fn(),
        cartItems,
        updateQuantity: jest.fn(),
      })
      .replace(HttpClientTestingModule, HttpClientTestingModule)
      .provide({
        provide: ActivatedRoute,
        useValue: {params: of({id: '1'})},
      });

    const fixture = MockRender(BookDetailsComponent);
    const httpMock = ngMocks.get(HttpTestingController);
    const req = httpMock.expectOne((r) => r.url.includes('/books/1'));
    req.flush(mockBook);

    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    expect(fixture.point.componentInstance.cartQuantity()).toBe(3);
  });

  it('should call updateQuantity on incrementQuantity', async () => {
    const mockBook: Book = {
      id: '1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      description: 'Test',
      price: 34.99,
      availability: true,
      stock: 25,
      category: 'Technology',
      genre: [],
      isbn: '9780132350884',
      rating: 4.7,
      reviews: [],
      imageUrl: '',
      createdAt: new Date('2025-10-01'),
    };

    const cartItems = signal([
      {id: 'ci1', bookId: '1', title: 'Clean Code', price: 34.99, quantity: 2},
    ]);
    const updateQuantity = jest.fn();

    await MockBuilder(BookDetailsComponent)
      .mock(MockDataService, {
        addToCart: jest.fn(),
        cartItems,
        updateQuantity,
      })
      .replace(HttpClientTestingModule, HttpClientTestingModule)
      .provide({
        provide: ActivatedRoute,
        useValue: {params: of({id: '1'})},
      });

    const fixture = MockRender(BookDetailsComponent);
    const httpMock = ngMocks.get(HttpTestingController);
    const req = httpMock.expectOne((r) => r.url.includes('/books/1'));
    req.flush(mockBook);

    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    fixture.point.componentInstance.incrementQuantity();
    expect(updateQuantity).toHaveBeenCalledWith('ci1', 3);
  });

  it('should call updateQuantity on decrementQuantity', async () => {
    const mockBook: Book = {
      id: '1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      description: 'Test',
      price: 34.99,
      availability: true,
      stock: 25,
      category: 'Technology',
      genre: [],
      isbn: '9780132350884',
      rating: 4.7,
      reviews: [],
      imageUrl: '',
      createdAt: new Date('2025-10-01'),
    };

    const cartItems = signal([
      {id: 'ci1', bookId: '1', title: 'Clean Code', price: 34.99, quantity: 2},
    ]);
    const updateQuantity = jest.fn();

    await MockBuilder(BookDetailsComponent)
      .mock(MockDataService, {
        addToCart: jest.fn(),
        cartItems,
        updateQuantity,
      })
      .replace(HttpClientTestingModule, HttpClientTestingModule)
      .provide({
        provide: ActivatedRoute,
        useValue: {params: of({id: '1'})},
      });

    const fixture = MockRender(BookDetailsComponent);
    const httpMock = ngMocks.get(HttpTestingController);
    const req = httpMock.expectOne((r) => r.url.includes('/books/1'));
    req.flush(mockBook);

    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    fixture.point.componentInstance.decrementQuantity();
    expect(updateQuantity).toHaveBeenCalledWith('ci1', 1);
  });
});
