import { Component, inject } from '@angular/core';
import { HeroListComponent } from '../../components/hero-list/hero-list.component';
import { HeroService } from '../../shared/services/hero.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [HeroListComponent, AsyncPipe],
  template: `
    @let heroes = (heroes$ | async)?.heroes; @if(heroes){
    <app-hero-list [heroes]="heroes" />
    }
  `,
})
export class HomeComponent {
  readonly #heroService = inject(HeroService);
  heroes$ = this.#heroService.load();
}
