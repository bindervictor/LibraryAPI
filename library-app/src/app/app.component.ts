import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LibraryAppService } from './library-app.service';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { Book } from './models/book.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'library-app';
  LibraryApp: Book[] = []; 

  LibraryAppService = inject(LibraryAppService);

  constructor() {
    this.LibraryAppService.getBooks().subscribe((LibraryApp: Book[]) => {
      this.LibraryApp = LibraryApp; 
    });
  }
}