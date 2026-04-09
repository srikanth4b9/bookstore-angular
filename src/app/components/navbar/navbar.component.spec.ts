import {MockBuilder, MockRender} from 'ng-mocks';
import {provideMockStore, MockStore} from '@ngrx/store/testing';

import {User, UserRole} from '../../models/models';
import {NavbarComponent} from './navbar.component';
import {selectCurrentUser} from '../../store/auth/auth.selectors';
import {selectCartCount} from '../../store/cart/cart.selectors';

describe('NavbarComponent', () => {
  let store: MockStore;

  beforeEach(() => {
    return MockBuilder(NavbarComponent).provide(
      provideMockStore({
        selectors: [
          {selector: selectCurrentUser, value: null},
          {selector: selectCartCount, value: 0},
        ],
      }),
    );
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    const fixture = MockRender(NavbarComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should expose user signal from store', () => {
    const mockUser: User = {
      id: 'u1',
      name: 'John Doe',
      email: 'john@example.com',
      role: UserRole.USER,
      addresses: [],
      orderHistoryIds: [],
      wishlistIds: [],
    };

    store = MockRender(NavbarComponent).point.injector.get(MockStore);
    store.overrideSelector(selectCurrentUser, mockUser);
    store.refreshState();

    const fixture = MockRender(NavbarComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.user()).toEqual(mockUser);
  });

  it('should compute cart count from store', () => {
    store = MockRender(NavbarComponent).point.injector.get(MockStore);
    store.overrideSelector(selectCartCount, 5);
    store.refreshState();

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
