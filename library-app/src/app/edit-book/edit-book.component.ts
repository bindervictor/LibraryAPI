import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LibraryAppService } from '../library-app.service';
import { CategoryDTO } from '../models/category.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class EditBookComponent implements OnInit {
  editBookForm!: FormGroup;
  categories: CategoryDTO[] = []; 
  bookId!: number;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private libraryService: LibraryAppService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));

    this.editBookForm = this.fb.group({
      name: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1), Validators.max(this.currentYear)]],
      categoryIds: [[], [Validators.required, Validators.maxLength(3)]]
    });

    this.loadCategories();
    this.loadBookData();
  }

  loadCategories() {
    this.libraryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Erro ao carregar categorias:', err)
    });
  }

  loadBookData() {
    this.libraryService.getBook(this.bookId).subscribe({
      next: (book) => {
        this.editBookForm.patchValue({
          name: book.name,
          year: book.year,
          categoryIds: book.categories.map((c: CategoryDTO) => c.id)
        });
      },
      error: (err) => console.error('Erro ao carregar o livro:', err),
    });
  }

  onCategorySelectionChange(selectedIds: number[]) {
    this.editBookForm.get('categoryIds')?.setValue(selectedIds);
    this.editBookForm.get('categoryIds')?.updateValueAndValidity();
  }

  saveChanges(): void {
    if (this.editBookForm.valid) {
      this.libraryService.updateBook(this.bookId, this.editBookForm.value).subscribe({
        next: () => {
          alert('Livro atualizado com sucesso!');
          this.router.navigate(['']);
        },
        error: (err) => console.error('Erro ao atualizar o livro:', err),
      });
    }
  }

  cancel(): void {
    this.router.navigate(['']);
  }
}
