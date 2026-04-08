import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Book, Pagination} from '../models/models';
import {API_CONFIG} from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class BooksApiService {
  private http = inject(HttpClient);
  private apiUrl = API_CONFIG.baseUrl;

  fetchBooks(
    page = 1,
    limit = 12,
    search?: string,
    category?: string,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Observable<{books: Book[]; pagination: Pagination}> {
    const params: Record<string, string | number> = {page, limit, sortBy, sortOrder};
    if (search) params['search'] = search;
    if (category) params['category'] = category;

    return this.http.get<{books: Book[]; pagination: Pagination}>(`${this.apiUrl}/books`, {params});
  }

  fetchBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/books/${id}`);
  }

  addBook(book: Partial<Book>): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/books`, book);
  }

  updateBook(id: string, book: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/books/${id}`, book);
  }

  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/books/${id}`);
  }
}
