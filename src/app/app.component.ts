import { Component, inject } from '@angular/core';
import { HeroListComponent } from './components/hero-list/hero-list.component';
import { HeroNewComponent } from './components/hero-new/hero-new.component';
import { Hero } from './shared/interfaces/hero.interface';
import { HeroService } from './shared/services/hero.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    HeroListComponent,
    HeroNewComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly #heroService = inject(HeroService);
  heroes = this.#heroService.findAll();

  addHero(hero: Hero) {
    this.#heroService.add(hero);
  }
}
