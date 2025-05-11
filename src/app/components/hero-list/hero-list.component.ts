import { Component, input } from '@angular/core';
import { HeroItemComponent } from '../hero-item/hero-item.component';
import { Hero } from '../../shared/interfaces/hero.interface';
import { HeroPowerstatsChange } from '../../shared/interfaces/hero-powerstats-change';

@Component({
  selector: 'app-hero-list',
  imports: [HeroItemComponent],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.css',
})
export class HeroListComponent {
  public heroes = input.required<Hero[]>();

  savePowerstats({ hero, powerstat, value }: HeroPowerstatsChange) {
    hero.powerstats[powerstat] += value;
  }
}
