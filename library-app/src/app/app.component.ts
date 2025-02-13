import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LibraryAppService } from './library-app.service';
import { MatToolbarModule } from '@angular/material/toolbar'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'library-app';
  LibraryApp: any[] = []; 

  LibraryAppService = inject(LibraryAppService);

  constructor() {
    this.LibraryAppService.getBooks().subscribe((LibraryApp: any[]) => {
      this.LibraryApp = LibraryApp; 
    });
  }
}