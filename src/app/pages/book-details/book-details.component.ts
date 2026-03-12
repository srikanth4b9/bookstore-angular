import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MockDataService } from '../../services/mock-data.service';
import { Book } from '../../models/models';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../config/api.config';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private mockData = inject(MockDataService);
  private http = inject(HttpClient);
  private apiUrl = API_CONFIG.baseUrl;

  book = signal<Book | undefined>(undefined);
  isLoading = signal(false);

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      const id = params['id'];
      this.isLoading.set(true);
      try {
        const bookData = await firstValueFrom(this.http.get<Book>(`${this.apiUrl}/books/${id}`));
        this.book.set(bookData);
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        this.isLoading.set(false);
      }
    });
  }

  addToCart(book: Book) {
    this.mockData.addToCart(book);
  }
}
