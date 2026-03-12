import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';
import { Book } from '../../models/models';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent {
  private route = inject(ActivatedRoute);
  private mockData = inject(MockDataService);

  book = signal<Book | undefined>(undefined);

  constructor() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.book.set(this.mockData.books().find(b => b.id === id));
    });
  }

  addToCart(book: Book) {
    this.mockData.addToCart(book);
    alert(`${book.title} added to cart!`);
  }
}
