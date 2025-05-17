import {
  Component,
  inject,
  input,
  numberAttribute,
  OnChanges,
} from '@angular/core';
import { HeroService } from '../../../shared/services/hero.service';
import { Hero } from '../../../shared/interfaces/hero.interface';
import { HeroItemComponent } from '../../../components/hero-item/hero-item.component';
import { HeroItemNotFoundComponent } from '../../../components/hero-item-not-found/hero-item-not-found.component';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-hero-detail',
  imports: [HeroItemComponent, HeroItemNotFoundComponent, AsyncPipe],
  template: `@let hero = hero$ | async; @if(hero){
    <app-hero-item [hero]="hero" [readonly]="true" />
    } @else {
    <app-hero-item-not-found />
    }`,
})
export class HeroDetailComponent implements OnChanges {
  id = input(0, { transform: numberAttribute });
  readonly #heroService = inject(HeroService);
  hero$: Observable<Hero> = of();

  ngOnChanges() {
    this.hero$ = this.#heroService.findOne(this.id());
  }
}
