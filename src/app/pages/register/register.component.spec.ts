import {RegisterComponent} from './register.component';
import {MockBuilder, MockRender, ngMocks} from 'ng-mocks';
import {MockDataService} from '../../services/mock-data.service';
import {Router} from '@angular/router';

describe('RegisterComponent', () => {
  beforeEach(() => {
    return MockBuilder(RegisterComponent).mock(MockDataService).mock(Router);
  });

  it('should create', () => {
    const fixture = MockRender(RegisterComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should have default initial form values', () => {
    const fixture = MockRender(RegisterComponent);
    const component = fixture.point.componentInstance;

    expect(component.name).toBe('');
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.hide).toBe(true);
  });

  it('should navigate to login on register', () => {
    const fixture = MockRender(RegisterComponent);
    const component = fixture.point.componentInstance;
    const router = ngMocks.get(Router);
    window.alert = jest.fn();

    component.register();

    expect(window.alert).toHaveBeenCalledWith('Account created successfully (Mock)!');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
