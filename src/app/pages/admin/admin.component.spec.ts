import {MockBuilder, MockRender} from 'ng-mocks';
import {provideMockStore, MockStore} from '@ngrx/store/testing';

import {Book, Order, OrderStatus} from '../../models/models';
import {AdminComponent} from './admin.component';
import {selectAllBooks} from '../../store/books/books.selectors';
import {selectAllOrders, selectTotalSales} from '../../store/orders/orders.selectors';
import {BooksActions} from '../../store/books/books.actions';

describe('AdminComponent', () => {
  let store: MockStore;

  beforeEach(() => {
    return MockBuilder(AdminComponent).provide(
      provideMockStore({
        selectors: [
          {selector: selectAllBooks, value: []},
          {selector: selectAllOrders, value: []},
          {selector: selectTotalSales, value: 0},
        ],
      }),
    );
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    const fixture = MockRender(AdminComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should expose books and orders from store', () => {
    const mockBooks: Book[] = [{id: '1', title: 'Book 1', author: 'Author 1', price: 10} as Book];
    const mockOrders: Order[] = [
      {
        id: 'ORD-1',
        userId: 'u1',
        items: [],
        total: 34.99,
        shippingAddress: {
          id: 'a1',
          street: '123 Main',
          city: 'City',
          state: 'ST',
          zipCode: '12345',
          country: 'USA',
          isDefault: true,
        },
        paymentMethod: 'Credit Card',
        status: OrderStatus.DELIVERED,
        orderDate: new Date(),
      },
    ];

    store = MockRender(AdminComponent).point.injector.get(MockStore);
    store.overrideSelector(selectAllBooks, mockBooks);
    store.overrideSelector(selectAllOrders, mockOrders);
    store.refreshState();

    const fixture = MockRender(AdminComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.books()).toEqual(mockBooks);
    expect(fixture.point.componentInstance.orders()).toEqual(mockOrders);
  });

  it('should have correct column definitions', () => {
    const fixture = MockRender(AdminComponent);
    const component = fixture.point.componentInstance;

    expect(component.bookColumns).toEqual(['id', 'title', 'author', 'price', 'stock', 'actions']);
    expect(component.orderColumns).toEqual([
      'id',
      'orderDate',
      'userId',
      'total',
      'status',
      'actions',
    ]);
  });

  it('should get totalSales from store selector', () => {
    store = MockRender(AdminComponent).point.injector.get(MockStore);
    store.overrideSelector(selectTotalSales, 60);
    store.refreshState();

    const fixture = MockRender(AdminComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.totalSales()).toBe(60);
  });

  it('should toggle showAddForm', () => {
    const fixture = MockRender(AdminComponent);
    const component = fixture.point.componentInstance;

    expect(component.showAddForm()).toBe(false);
    component.showAddForm.set(true);
    expect(component.showAddForm()).toBe(true);
  });

  it('should dispatch addBook action and hide form', () => {
    const fixture = MockRender(AdminComponent);
    const component = fixture.point.componentInstance;
    store = fixture.point.injector.get(MockStore);
    jest.spyOn(store, 'dispatch');

    component.showAddForm.set(true);
    component.newBook = {title: 'New Book', author: 'Author', price: 25};
    component.addBook();

    expect(store.dispatch).toHaveBeenCalledWith(
      BooksActions.addBook({book: {title: 'New Book', author: 'Author', price: 25}}),
    );
    expect(component.showAddForm()).toBe(false);
  });

  it('should have default newBook values', () => {
    const fixture = MockRender(AdminComponent);
    const component = fixture.point.componentInstance;

    expect(component.newBook).toEqual({title: '', author: '', price: 0});
  });
});
