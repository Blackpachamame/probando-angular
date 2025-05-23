import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  numberAttribute,
  OnChanges,
  signal,
} from '@angular/core';
import { HeroService } from '../../../shared/services/hero.service';
import { Hero } from '../../../shared/interfaces/hero.interface';
import { HeroItemComponent } from '../../../components/hero-item/hero-item.component';
import { HeroItemNotFoundComponent } from '../../../components/hero-item-not-found/hero-item-not-found.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hero-detail',
  imports: [HeroItemComponent, HeroItemNotFoundComponent],
  template: ` @if(hero()){
    <app-hero-item [hero]="hero()" [readonly]="true" />
    } @else {
    <app-hero-item-not-found />
    }`,
})
export class HeroDetailComponent {
  id = input(0, { transform: numberAttribute });
  readonly #heroService = inject(HeroService);
  hero = signal<Hero>(this.#heroService.NullHero);

  constructor(private destroyRef: DestroyRef) {
    effect(() => {
      this.#heroService
        .findOne(this.id())
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe({
          next: (_hero) => this.hero.set(_hero),
        });
    });
  }
}
