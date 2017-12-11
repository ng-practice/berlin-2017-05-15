import { Observable } from 'rxjs/Observable';
import { Book } from './../models/book';
import { GoogleBooksService } from './../core/google-books.service';
import { Component, OnInit, EventEmitter } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/retry';

import 'rxjs/add/observable/of';

@Component({
  selector: 'tr-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.sass']
})
export class BookSearchComponent implements OnInit {
  searchViewIsDisabled = true;

  books$: Observable<Book[]>;
  queryChange = new EventEmitter<string>();

  constructor(private googleBooks: GoogleBooksService) {
    this.books$ = this.queryChange
      .retry()
      .debounceTime(500)
      .distinctUntilChanged()
      .filter(query => query && query.length > 0)
      .do(() => this.searchViewIsDisabled = false)
      .switchMap(query => this.googleBooks.getByQuery(query))
      .catch(err => {
        console.log(err);
        return Observable.of([]);
      });
  }

  ngOnInit() {
  }

}
