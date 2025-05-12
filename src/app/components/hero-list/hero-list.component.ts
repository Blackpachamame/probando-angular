import { Component, inject, input } from '@angular/core';
import { HeroItemComponent } from '../hero-item/hero-item.component';
import { Hero } from '../../shared/interfaces/hero.interface';
import { HeroPowerstatsChange } from '../../shared/interfaces/hero-powerstats-change';
import { HeroService } from '../../shared/services/hero.service';

@Component({
  selector: 'app-hero-list',
  imports: [HeroItemComponent],
  templateUrl: './hero-list.component.html',
})
export class HeroListComponent {
  public heroes = input.required<Hero[]>();
  readonly #heroService = inject(HeroService);

  savePowerstats({ hero, powerstat, value }: HeroPowerstatsChange) {
    this.#heroService.update(hero, powerstat, value);
  }
}
