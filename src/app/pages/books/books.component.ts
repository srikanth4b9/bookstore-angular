import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';
import { Book } from '../../models/models';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterLink, FormsModule, CurrencyPipe],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent {
  private mockData = inject(MockDataService);
  private route = inject(ActivatedRoute);

  categories = this.mockData.categories;

  searchTerm = signal('');
  selectedCategory = signal('');
  sortBy = signal('price-asc');

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
    });
  }

  filteredBooks = computed(() => {
    let books = [...this.mockData.books()];

    // Search
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      books = books.filter(b =>
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term) ||
        b.isbn.includes(term)
      );
    }

    // Category
    if (this.selectedCategory()) {
      books = books.filter(b => b.category === this.selectedCategory());
    }

    // Sort
    books.sort((a, b) => {
      if (this.sortBy() === 'price-asc') return a.price - b.price;
      if (this.sortBy() === 'price-desc') return b.price - a.price;
      if (this.sortBy() === 'rating') return b.rating - a.rating;
      return 0;
    });

    return books;
  });

  addToCart(book: Book) {
    this.mockData.addToCart(book);
    alert(`${book.title} added to cart!`);
  }
}
