import { Component, DestroyRef, inject } from '@angular/core';
import { HeroListComponent } from '../../components/hero-list/hero-list.component';
import { HeroService } from '../../shared/services/hero.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [HeroListComponent],
  template: `
    @if(heroes()){
    <app-hero-list [heroes]="heroes()" />
    }
  `,
})
export class HomeComponent {
  readonly #heroService = inject(HeroService);
  readonly heroes = this.#heroService.heroes;

  constructor(private destroyRef: DestroyRef) {
    this.#heroService
      .load()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
