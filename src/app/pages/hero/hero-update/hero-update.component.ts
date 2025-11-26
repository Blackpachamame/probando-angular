import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  ResourceStatus,
  signal,
} from '@angular/core';
import { HeroFormComponent } from '../../../components/hero-form/hero-form.component';
import { Hero } from '../../../shared/interfaces/hero.interface';
import { Router } from '@angular/router';
import { HeroService } from '../../../shared/services/hero.service';
import { HeroItemNotFoundComponent } from '../../../components/hero-item-not-found/hero-item-not-found.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { NEVER } from 'rxjs';

@Component({
  selector: 'app-hero-update',
  imports: [HeroFormComponent, HeroItemNotFoundComponent],
  template: ` @if(isValidHero()){
    <div class="flex flex-col items-center bg-indigo-500">
      <h3 class="text-2xl font-bold text-white">Update an Hero!</h3>
      <app-hero-form
        [hero]="hero()"
        (sendHero)="updateHero($event)"
      ></app-hero-form>
    </div>
    } @else {
    <app-hero-item-not-found />
    }`,
})
export class HeroUpdateComponent {
  readonly #router = inject(Router);
  readonly #heroService = inject(HeroService);
  readonly id = input(0, { transform: numberAttribute });

  readonly #heroResource = rxResource({
    request: () => this.id(),
    loader: () => this.#heroService.findOne(this.id()),
  });
  readonly hero = computed(
    () => this.#heroResource.value() ?? this.#heroService.defaultHero
  );
  readonly isValidHero = computed(
    () => !this.#heroService.isNullHero(this.hero())
  );

  readonly heroSignal = signal<Hero>(this.#heroService.defaultHero);
  readonly #heroToUpdateResource = rxResource({
    request: () => this.heroSignal(),
    loader: ({ request: hero }) =>
      this.#heroService.isDefaultHero(hero)
        ? NEVER
        : this.#heroService.update(hero),
    equal: (hero1, hero2) => hero1.id === hero2.id,
  });

  isLoading = this.#heroToUpdateResource.isLoading;
  error = this.#heroToUpdateResource.error;
  isHeroToUpdateResouceCompleted = computed(
    () => this.#heroToUpdateResource.status() === ResourceStatus.Resolved
  );

  navigateEffect = effect(() => {
    if (
      !this.#heroService.isDefaultHero(this.heroSignal()) &&
      this.isHeroToUpdateResouceCompleted()
    ) {
      this.#router.navigate(['/home']);
    }
  });

  errorEffect = effect(() => {
    if (this.error()) {
      console.log('Error', this.error());
    }
  });

  updateHero(hero: Hero) {
    console.log('Updating Hero', hero);
    this.heroSignal.set(hero);
  }
}
