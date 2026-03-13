import 'jest-preset-angular/setup-env/zoneless';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { ngMocks } from 'ng-mocks';

// IntersectionObserver Mock
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
  observe(target: Element) {}
  unobserve(target: Element) {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
} as any;

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Optional: Global config for ng-mocks
ngMocks.config({
  // You can add global configurations here
});
