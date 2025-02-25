import { Component, OnInit } from '@angular/core';
import { LibraryAppService } from '../library-app.service';
import { Book } from '../models/book.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent implements OnInit {
  books: Book[] = [];

  constructor(private libraryAppService: LibraryAppService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.libraryAppService.getBooks().subscribe({
      next: (data) => (this.books = data),
      error: (err) => console.error('Erro ao buscar livros:', err),
    });
  }

  deleteBook(id: number): void {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
      this.libraryAppService.deleteBook(id).subscribe({
        next: () => {
          alert('Livro excluído com sucesso!');
          this.loadBooks(); 
        },
        error: (err) => console.error('Erro ao excluir o livro:', err),
      });
    }
  }

  getCategoryNames(categories: any[]): string {
    return categories.map((cat) => cat.name).join(', ');
  }
}
