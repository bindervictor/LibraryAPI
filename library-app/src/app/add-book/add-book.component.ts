import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LibraryAppService } from '../library-app.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category, CategoryDTO } from '../models/category.model';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css'],
})
export class AddBookComponent implements OnInit {
  categories: CategoryDTO[] = []; 
  bookForm: FormGroup;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private bookService: LibraryAppService,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      name: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.min(1), Validators.max(this.currentYear)]],
      categoryIds: this.fb.control([], [Validators.required, Validators.maxLength(3)])
    });
    this.bookForm.valueChanges.subscribe
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.bookService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Erro ao carregar categorias:', err)
    });
  }

  onCategorySelectionChange(selectedIds: number[]) {
    this.bookForm.get('categoryIds')?.setValue(selectedIds);
    this.bookForm.get('categoryIds')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.bookForm.valid) {
      this.bookService.addBook(this.bookForm.value).subscribe({
        next: () => {
          this.router.navigateByUrl('');
          this.bookForm.reset();
        },
        error: (err) => console.error('Erro ao adicionar livro:', err)
      });
    }
  }
}
