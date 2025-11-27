import {
  Component,
  ResourceStatus,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { Hero } from '../../shared/interfaces/hero.interface';
import { HeroItemComponent } from '../hero-item/hero-item.component';
import { HeroPowerstatsChange } from '../../shared/interfaces/hero-powerstats-change';
import { HeroService } from '../../shared/services/hero.service';
import { of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hero-list',
  imports: [HeroItemComponent],
  template: ` <div class="flex flex-wrap justify-center gap-4 ">
    @for (hero of heroes(); track hero.id) {
    <app-hero-item
      [hero]="hero"
      (powerstatsChange)="savePowerstats($event)"
      (removeHero)="removeHero($event)"
    />
    } @empty {
    <h1 aria-hidden="true">There are no Heroes.</h1>
    }
  </div>`,
})
export class HeroListComponent {
  readonly #heroService = inject(HeroService);
  public heroes = input.required<Hero[]>();

  heroToRemoveSignal = signal<Hero>(this.#heroService.defaultHero);
  heroToUpdateSignal = signal<HeroPowerstatsChange>({
    hero: this.#heroService.defaultHero,
    powerstat: 'intelligence',
    value: 0,
  });

  heroToRemoveResource = rxResource({
    request: () => this.heroToRemoveSignal(),
    loader: ({ request: hero }) =>
      this.#heroService.isDefaultHero(hero)
        ? of(null)
        : this.#heroService.remove(hero),
  });
  heroToUpdateResource = rxResource({
    request: () => this.heroToUpdateSignal(),
    loader: ({ request: { hero, powerstat, value } }) =>
      this.#heroService.isDefaultHero(hero)
        ? of(null)
        : this.#heroService.updatePowerstat(hero, powerstat, value),
  });

  isHeroToRemoveResourceCompleted = computed(
    () =>
      !this.#heroService.isDefaultHero(this.heroToRemoveSignal()) &&
      this.heroToRemoveResource.status() === ResourceStatus.Resolved
  );
  isHeroToUpdateResourceCompleted = computed(
    () =>
      this.heroToUpdateSignal().value !== 0 &&
      this.heroToUpdateResource.status() === ResourceStatus.Resolved
  );

  errorRemoveHeroEffect = effect(() => {
    if (this.heroToRemoveResource.error()) {
      console.log('Error', this.heroToRemoveResource.error());
    }
  });
  errorUpdateHeroEffect = effect(() => {
    if (this.heroToUpdateResource.error()) {
      console.log('Error', this.heroToUpdateResource.error());
    }
  });

  completeRemoveHeroEffect = effect(() => {
    if (this.isHeroToRemoveResourceCompleted()) {
      console.log('Hero removed completed');
    }
  });

  completeUpdateHeroEffect = effect(() => {
    if (this.isHeroToUpdateResourceCompleted()) {
      console.log('Hero update completed');
    }
  });

  savePowerstats({ hero, powerstat, value }: HeroPowerstatsChange) {
    this.heroToUpdateSignal.set({ hero, powerstat, value });
  }

  removeHero(hero: Hero) {
    this.heroToRemoveSignal.set(hero);
  }
}
