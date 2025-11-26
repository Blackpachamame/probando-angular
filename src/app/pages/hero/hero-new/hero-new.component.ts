import {
  Component,
  computed,
  effect,
  inject,
  ResourceStatus,
  signal,
} from '@angular/core';
import { HeroFormComponent } from '../../../components/hero-form/hero-form.component';
import { Router } from '@angular/router';
import { Hero } from '../../../shared/interfaces/hero.interface';
import { HeroService } from '../../../shared/services/hero.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { NEVER } from 'rxjs';

@Component({
  selector: 'app-hero-new',
  imports: [HeroFormComponent],
  template: `<div class="flex flex-col items-center bg-[cadetblue]">
    <h3 class="text-2xl font-bold text-white p-1">Add an Hero!</h3>
    <app-hero-form (sendHero)="addHero($event)" />
  </div>`,
})
export class HeroNewComponent {
  readonly #heroService = inject(HeroService);
  readonly #router = inject(Router);
  readonly heroSignal = signal<Hero>(this.#heroService.defaultHero);
  readonly #heroResource = rxResource({
    request: () => this.heroSignal(),
    loader: ({ request: hero }) =>
      this.#heroService.isDefaultHero(hero)
        ? NEVER
        : this.#heroService.add(hero),
    equal: (hero1, hero2) => hero1.id === hero2.id,
  });

  isLoading = this.#heroResource.isLoading;
  error = this.#heroResource.error;
  isHeroResouceCompleted = computed(
    () => this.#heroResource.status() === ResourceStatus.Resolved
  );

  navigateEffect = effect(() => {
    if (
      !this.#heroService.isDefaultHero(this.heroSignal()) &&
      this.isHeroResouceCompleted()
    ) {
      this.#router.navigate(['/home']);
    }
  });

  errorEffect = effect(() => {
    if (this.error()) {
      console.log('Error', this.error());
    }
  });

  addHero(_hero: Hero) {
    const hero: Hero = {
      ..._hero,
      id: Math.floor(Math.random() * 1000) + 1,
    };
    console.log('Creating Hero', hero);
    this.heroSignal.set(hero);
  }
}
