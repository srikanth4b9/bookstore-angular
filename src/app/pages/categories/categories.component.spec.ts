import {MockBuilder, MockRender} from 'ng-mocks';
import {provideMockStore, MockStore} from '@ngrx/store/testing';

import {Category} from '../../models/models';
import {CategoriesComponent} from './categories.component';
import {
  selectAllCategories,
  selectCategoriesLoading,
} from '../../store/categories/categories.selectors';

describe('CategoriesComponent', () => {
  let store: MockStore;

  beforeEach(() => {
    return MockBuilder(CategoriesComponent).provide(
      provideMockStore({
        selectors: [
          {selector: selectAllCategories, value: []},
          {selector: selectCategoriesLoading, value: false},
        ],
      }),
    );
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    const fixture = MockRender(CategoriesComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should display categories from store', () => {
    const mockCats: Category[] = [
      {id: '1', name: 'Cat 1'},
      {id: '2', name: 'Cat 2'},
    ];

    store = MockRender(CategoriesComponent).point.injector.get(MockStore);
    store.overrideSelector(selectAllCategories, mockCats);
    store.refreshState();

    const fixture = MockRender(CategoriesComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.categories()).toEqual(mockCats);
  });

  it('should reflect isLoading state from store', () => {
    store = MockRender(CategoriesComponent).point.injector.get(MockStore);
    store.overrideSelector(selectCategoriesLoading, true);
    store.refreshState();

    const fixture = MockRender(CategoriesComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.isLoading()).toBe(true);
  });
});
