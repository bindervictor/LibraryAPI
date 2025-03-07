import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LibraryAppService } from '../library-app.service';
import { Book } from '../models/book.model';
import { Category } from '../models/category.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})

export class BookDetailComponent implements OnInit {
  book: Book | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private libraryAppService: LibraryAppService
  ) {}

  goBack() {
    this.router.navigate(['']); 
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.libraryAppService.getBook(id).subscribe({
      next: (data) => (this.book = data),
      error: (err) => console.error('Erro ao buscar livro:', err),
    });
  }

  getCategoryNames(categories: Category[]): string {
    return categories.map((cat) => cat.name).join(', ');
  }
}
