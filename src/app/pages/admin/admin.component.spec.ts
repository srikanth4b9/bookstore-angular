import {signal, WritableSignal} from '@angular/core';
import {MockBuilder, MockRender, ngMocks} from 'ng-mocks';

import {Book, Order, OrderStatus} from '../../models/models';
import {MockDataService} from '../../services/mock-data.service';
import {AdminComponent} from './admin.component';

describe('AdminComponent', () => {
  beforeEach(() => {
    return MockBuilder(AdminComponent).mock(MockDataService, {
      books: signal([]),
      orders: signal([]),
    });
  });

  it('should create', () => {
    const fixture = MockRender(AdminComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should expose books and orders from MockDataService', () => {
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

    const mockDataService = ngMocks.get(MockDataService);
    (mockDataService.books as WritableSignal<Book[]>).set(mockBooks);
    (mockDataService.orders as WritableSignal<Order[]>).set(mockOrders);

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

  it('should compute totalSales from orders', () => {
    const mockOrders: Order[] = [
      {id: 'ORD-1', total: 34.99} as Order,
      {id: 'ORD-2', total: 25.01} as Order,
    ];
    const mockDataService = ngMocks.get(MockDataService);
    (mockDataService.orders as WritableSignal<Order[]>).set(mockOrders);

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

  it('should call addBook and hide form', () => {
    const fixture = MockRender(AdminComponent);
    const component = fixture.point.componentInstance;
    window.alert = jest.fn();

    component.showAddForm.set(true);
    component.addBook();

    expect(window.alert).toHaveBeenCalledWith('Book added successfully (Mock)!');
    expect(component.showAddForm()).toBe(false);
  });

  it('should have default newBook values', () => {
    const fixture = MockRender(AdminComponent);
    const component = fixture.point.componentInstance;

    expect(component.newBook).toEqual({title: '', author: '', price: 0});
  });
});
