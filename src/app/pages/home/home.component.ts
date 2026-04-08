import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CurrencyPipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {Store} from '@ngrx/store';

import {selectAllBooks} from '../../store/books/books.selectors';
import {selectAllCategories} from '../../store/categories/categories.selectors';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private store = inject(Store);

  featuredBooks = this.store.selectSignal(selectAllBooks);
  categories = this.store.selectSignal(selectAllCategories);
}
