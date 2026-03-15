import {LoginComponent} from './login.component';
import {MockBuilder, MockRender, ngMocks} from 'ng-mocks';
import {MockDataService} from '../../services/mock-data.service';
import {Router} from '@angular/router';

describe('LoginComponent', () => {
  beforeEach(() => {
    return MockBuilder(LoginComponent).mock(MockDataService).mock(Router);
  });

  it('should create', () => {
    const fixture = MockRender(LoginComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should navigate to home on login', () => {
    const fixture = MockRender(LoginComponent);
    const component = fixture.point.componentInstance;
    const router = ngMocks.get(Router);
    window.alert = jest.fn();

    component.login();

    expect(window.alert).toHaveBeenCalledWith('Logged in successfully (Mock)!');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should have default initial form values', () => {
    const fixture = MockRender(LoginComponent);
    const component = fixture.point.componentInstance;

    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.hide).toBe(true);
  });
});
