import { Component, computed, input } from '@angular/core';
import { Hero, PowerStat } from '../../shared/interfaces/hero.interface';

@Component({
  selector: 'app-hero-item',
  imports: [],
  templateUrl: './hero-item.component.html',
  styleUrl: './hero-item.component.css',
})
export class HeroItemComponent {
  hero = input.required<Hero>();

  isHeroVillain = computed(() => this.hero().alignment === 'bad');

  decrementPowerStats(powerstat: PowerStat): void {
    const value = this.hero().powerstats[powerstat];
    if (value > 0) {
      this.hero().powerstats[powerstat]--;
    }
  }

  incrementPowerStats(powerstat: PowerStat): void {
    const value = this.hero().powerstats[powerstat];
    if (value < 100) {
      this.hero().powerstats[powerstat]++;
    }
  }
}
