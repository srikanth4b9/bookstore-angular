import {BookDetailsComponent} from './book-details.component';
import {MockBuilder, MockRender, ngMocks} from 'ng-mocks';
import {MockDataService} from '../../services/mock-data.service';
import {ActivatedRoute} from '@angular/router';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {of} from 'rxjs';
import {Book} from '../../models/models';

describe('BookDetailsComponent', () => {
  beforeEach(() => {
    return MockBuilder(BookDetailsComponent)
      .mock(MockDataService, {
        addToCart: jest.fn(),
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
});
