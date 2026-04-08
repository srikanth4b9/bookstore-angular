import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Category} from '../models/models';
import {API_CONFIG} from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  private http = inject(HttpClient);
  private apiUrl = API_CONFIG.baseUrl;

  fetchCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
}
