import {HomeComponent} from './home.component';
import {MockBuilder, MockRender, ngMocks} from 'ng-mocks';
import {MockDataService} from '../../services/mock-data.service';
import {signal, WritableSignal} from '@angular/core';
import {Book, Category} from '../../models/models';

describe('HomeComponent', () => {
  beforeEach(() => {
    return MockBuilder(HomeComponent).mock(MockDataService, {
      books: signal([]),
      categories: signal([]),
    });
  });

  it('should create', () => {
    const fixture = MockRender(HomeComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should expose books signal from MockDataService as featuredBooks', () => {
    const mockBooks: Book[] = [
      {
        id: '1',
        title: 'Featured Book',
        author: 'Author',
        description: 'Desc',
        price: 10,
        availability: true,
        stock: 5,
        category: 'fiction',
        genre: ['fiction'],
        isbn: '0000000001',
        rating: 4,
        reviews: [],
        imageUrl: '',
        createdAt: new Date(),
      },
    ];
    const mockDataService = ngMocks.get(MockDataService);
    (mockDataService.books as WritableSignal<Book[]>).set(mockBooks);

    const fixture = MockRender(HomeComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.featuredBooks()).toEqual(mockBooks);
  });

  it('should expose categories signal from MockDataService', () => {
    const mockCats: Category[] = [
      {id: '1', name: 'Fiction'},
      {id: '2', name: 'Science'},
    ];
    const mockDataService = ngMocks.get(MockDataService);
    (mockDataService.categories as WritableSignal<Category[]>).set(mockCats);

    const fixture = MockRender(HomeComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.categories()).toEqual(mockCats);
  });
});
