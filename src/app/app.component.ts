import { Component } from '@angular/core';
import { HeroListComponent } from './components/hero-list/hero-list.component';

@Component({
  selector: 'app-root',
  imports: [HeroListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Bro';
}
