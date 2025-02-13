import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Book } from './models/book.model';

@Injectable({
  providedIn: 'root',
})
export class LibraryAppService {
  private apiUrl = environment.apiURL + '/api/books';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getBook(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`); 
  }

  addBook(book: { name: string; year: number }) {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: { name: string; year: number; categoryIds: number[] }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}