import {NavbarComponent} from './navbar.component';
import {MockBuilder, MockRender, ngMocks} from 'ng-mocks';
import {MockDataService} from '../../services/mock-data.service';
import {signal, WritableSignal} from '@angular/core';
import {CartItem, User, UserRole} from '../../models/models';

describe('NavbarComponent', () => {
  beforeEach(() => {
    return MockBuilder(NavbarComponent).mock(MockDataService, {
      currentUser: signal(null),
      cartItems: signal([]),
    });
  });

  it('should create', () => {
    const fixture = MockRender(NavbarComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should expose user signal from MockDataService', () => {
    const mockUser: User = {
      id: 'u1',
      name: 'John Doe',
      email: 'john@example.com',
      role: UserRole.USER,
      addresses: [],
      orderHistoryIds: [],
      wishlistIds: [],
    };
    const mockDataService = ngMocks.get(MockDataService);
    (mockDataService.currentUser as WritableSignal<User | null>).set(mockUser);

    const fixture = MockRender(NavbarComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.user()).toEqual(mockUser);
  });

  it('should compute cart count from cart items', () => {
    const mockItems: CartItem[] = [
      {id: 'ci-1', bookId: '1', bookTitle: 'Book 1', bookPrice: 10, quantity: 2, imageUrl: ''},
      {id: 'ci-2', bookId: '2', bookTitle: 'Book 2', bookPrice: 20, quantity: 3, imageUrl: ''},
    ];
    const mockDataService = ngMocks.get(MockDataService);
    (mockDataService.cartItems as WritableSignal<CartItem[]>).set(mockItems);

    const fixture = MockRender(NavbarComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.cartCount()).toBe(5);
  });

  it('should return 0 cart count when cart is empty', () => {
    const fixture = MockRender(NavbarComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.cartCount()).toBe(0);
  });
});
