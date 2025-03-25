import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Book, BookCreateDTO } from './models/book.model';
import { CategoryDTO } from './models/category.model';

@Injectable({
  providedIn: 'root',
})
export class LibraryAppService {
  private apiUrl = environment.apiURL + '/api/books';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`); 
  }

  getCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${this.apiUrl}/categories`);
  }

  addBook(book: BookCreateDTO): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: BookCreateDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}