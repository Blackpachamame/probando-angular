import { Component, DestroyRef, inject } from '@angular/core';
import { HeroListComponent } from '../../components/hero-list/hero-list.component';
import { HeroService } from '../../shared/services/hero.service';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [HeroListComponent, AsyncPipe],
  template: `
    @let heroes = heroes$ | async; @if(heroes){
    <app-hero-list [heroes]="heroes" />
    }
  `,
})
export class HomeComponent {
  readonly #heroService = inject(HeroService);
  readonly #destroyRef = inject(DestroyRef);
  heroes$ = this.#heroService.heroes$;

  constructor() {
    this.#heroService
      .load()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe();
  }
}
