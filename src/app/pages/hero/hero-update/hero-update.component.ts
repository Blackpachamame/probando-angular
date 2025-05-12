import { Component, inject } from '@angular/core';
import { HeroFormComponent } from '../../../components/hero-form/hero-form.component';
import { Hero } from '../../../shared/interfaces/hero.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-update',
  imports: [HeroFormComponent],
  template: ` <div class="flex flex-col items-center bg-indigo-500">
    <h3 class="text-2xl font-bold text-white p-1">Update an Hero!</h3>
    <app-hero-form (sendHero)="updateHero($event)"></app-hero-form>
  </div>`,
})
export class HeroUpdateComponent {
  readonly #router = inject(Router);
  updateHero(_hero: Hero) {
    const hero: Hero = {
      ..._hero,
      id: Math.floor(Math.random() * 1000) + 1,
    };
    console.log('Updating Hero', hero);
    this.#router.navigate(['/home']);
  }
}
