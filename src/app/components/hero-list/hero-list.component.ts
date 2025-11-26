import {
  Component,
  computed,
  inject,
  input,
  ResourceStatus,
  signal,
} from '@angular/core';
import { HeroItemComponent } from '../hero-item/hero-item.component';
import { Hero } from '../../shared/interfaces/hero.interface';
import { HeroPowerstatsChange } from '../../shared/interfaces/hero-powerstats-change';
import { HeroService } from '../../shared/services/hero.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { NEVER } from 'rxjs';

@Component({
  selector: 'app-hero-list',
  imports: [HeroItemComponent],
  template: `
    <div class="flex flex-wrap justify-center gap-4 px-2 py-4 ">
      @for (hero of heroes(); track hero.id) {
      <app-hero-item
        [hero]="hero"
        (powerstatsChange)="savePowerstats($event)"
        (removeHero)="removeHero($event)"
      />
      } @empty {
      <h1 aria-hidden="true">There are no Heroes.</h1>
      }
    </div>
  `,
})
export class HeroListComponent {
  readonly #heroService = inject(HeroService);
  public heroes = input.required<Hero[]>();

  #heroToRemoveSignal = signal<Hero>(this.#heroService.defaultHero);
  #heroToUpdateSignal = signal<HeroPowerstatsChange>({
    hero: this.#heroService.defaultHero,
    powerstat: 'intelligence',
    value: 0,
  });

  #heroToRemoveResource = rxResource({
    request: () => this.#heroToRemoveSignal(),
    loader: ({ request: hero }) =>
      this.#heroService.isDefaultHero(hero)
        ? NEVER
        : this.#heroService.remove(hero),
  });
  #heroToUpdateResource = rxResource({
    request: () => this.#heroToUpdateSignal(),
    loader: ({ request: { hero, powerstat, value } }) =>
      this.#heroService.isDefaultHero(hero)
        ? NEVER
        : this.#heroService.updatePowerstat(hero, powerstat, value),
  });

  isHeroToRemoveResourceCompleted = computed(
    () =>
      !this.#heroService.isDefaultHero(this.#heroToRemoveSignal()) &&
      this.#heroToRemoveResource.status() === ResourceStatus.Reloading
  );

  isHeroToUpdateResourceCompleted = computed(
    () =>
      this.#heroToUpdateSignal().value !== 0 &&
      this.#heroToUpdateResource.status() === ResourceStatus.Reloading
  );

  savePowerstats({ hero, powerstat, value }: HeroPowerstatsChange) {
    this.#heroToUpdateSignal.set({ hero, powerstat, value });
  }
  removeHero(hero: Hero) {
    this.#heroToRemoveSignal.set(hero);
  }
}
