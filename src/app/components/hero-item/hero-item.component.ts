import { Component, computed, input, output } from '@angular/core';
import { Hero, PowerStat } from '../../shared/interfaces/hero.interface';
import { HeroPowerstatsChange } from '../../shared/interfaces/hero-powerstats-change';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-item',
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-item.component.html',
})
export class HeroItemComponent {
  hero = input.required<Hero>();
  readonly = input<boolean>(false);
  powerstatsChange = output<HeroPowerstatsChange>();
  removeHero = output<Hero>();
  isHeroVillain = computed(() => this.hero().alignment === 'bad');

  decrementPowerStats(powerstat: PowerStat): void {
    this.powerstatsChange.emit({ hero: this.hero(), powerstat, value: -1 });
  }

  incrementPowerStats(powerstat: PowerStat): void {
    this.powerstatsChange.emit({ hero: this.hero(), powerstat, value: 1 });
  }
  remove(hero: Hero) {
    this.removeHero.emit(hero);
  }
}
