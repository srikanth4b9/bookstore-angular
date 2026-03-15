import {CategoriesComponent} from './categories.component';
import {MockBuilder, MockRender, ngMocks} from 'ng-mocks';
import {MockDataService} from '../../services/mock-data.service';
import {signal, WritableSignal} from '@angular/core';
import {Category} from '../../models/models';

describe('CategoriesComponent', () => {
  beforeEach(() => {
    return MockBuilder(CategoriesComponent).mock(MockDataService, {
      categories: signal([]),
      isLoading: signal(false),
    });
  });

  it('should create', () => {
    const fixture = MockRender(CategoriesComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should display categories from MockDataService', () => {
    const mockCats = [
      {id: '1', name: 'Cat 1'},
      {id: '2', name: 'Cat 2'},
    ];
    const mockDataService = ngMocks.get(MockDataService);
    (mockDataService.categories as WritableSignal<Category[]>).set(mockCats);

    const fixture = MockRender(CategoriesComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.categories()).toEqual(mockCats);
  });

  it('should reflect isLoading state from MockDataService', () => {
    const mockDataService = ngMocks.get(MockDataService);
    (mockDataService.isLoading as WritableSignal<boolean>).set(true);

    const fixture = MockRender(CategoriesComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.isLoading()).toBe(true);
  });
});
