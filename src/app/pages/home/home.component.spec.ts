import {MockBuilder, MockRender} from 'ng-mocks';
import {provideMockStore, MockStore} from '@ngrx/store/testing';

import {Book, Category} from '../../models/models';
import {HomeComponent} from './home.component';
import {selectAllBooks} from '../../store/books/books.selectors';
import {selectAllCategories} from '../../store/categories/categories.selectors';

describe('HomeComponent', () => {
  let store: MockStore;

  beforeEach(() => {
    return MockBuilder(HomeComponent).provide(
      provideMockStore({
        selectors: [
          {selector: selectAllBooks, value: []},
          {selector: selectAllCategories, value: []},
        ],
      }),
    );
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    const fixture = MockRender(HomeComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should expose books signal from store as featuredBooks', () => {
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

    store = MockRender(HomeComponent).point.injector.get(MockStore);
    store.overrideSelector(selectAllBooks, mockBooks);
    store.refreshState();

    const fixture = MockRender(HomeComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.featuredBooks()).toEqual(mockBooks);
  });

  it('should expose categories signal from store', () => {
    const mockCats: Category[] = [
      {id: '1', name: 'Fiction'},
      {id: '2', name: 'Science'},
    ];

    store = MockRender(HomeComponent).point.injector.get(MockStore);
    store.overrideSelector(selectAllCategories, mockCats);
    store.refreshState();

    const fixture = MockRender(HomeComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.categories()).toEqual(mockCats);
  });
});
