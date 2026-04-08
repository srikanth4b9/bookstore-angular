import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Order, CartItem, Address} from '../models/models';
import {API_CONFIG} from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class OrdersApiService {
  private http = inject(HttpClient);
  private apiUrl = API_CONFIG.baseUrl;

  fetchOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  placeOrder(orderData: {
    userId: string;
    items: CartItem[];
    total: number;
    shippingAddress: Address;
    paymentMethod: string;
  }): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, orderData);
  }
}
