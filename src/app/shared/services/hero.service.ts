import { Hero, PowerStats } from '../interfaces/hero.interface';
import { computed, inject, Injectable, signal } from '@angular/core';
import { HeroServiceAbstract } from './hero.service.abstract';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeroService extends HeroServiceAbstract {
  readonly #heroesSignal = signal<Hero[]>([]);
  readonly heroes = computed(() => this.#heroesSignal());

  readonly #httpClient = inject(HttpClient);

  load(): Observable<{ heroes: Hero[]; total: number }> {
    return this.#httpClient
      .get<{ heroes: Hero[]; total: number }>(this.API_ENDPOINT)
      .pipe(
        tap((result) => this.#heroesSignal.set(result.heroes)),
        catchError((error) => {
          console.error('Failed to load heroes', error);
          return throwError(() => error);
        })
      );
  }

  add(hero: Hero): Observable<Hero> {
    return this.#httpClient.post<Hero>(this.API_ENDPOINT, hero).pipe(
      tap((newHero) => {
        this.#heroesSignal.update((currentHeroes) => [
          ...currentHeroes,
          newHero,
        ]);
      }),
      catchError((error) => {
        console.error('Failed to add an hero', error);
        return throwError(() => error);
      })
    );
  }
  updatePowerstat(
    hero: Hero,
    powerstat: keyof PowerStats,
    value: number
  ): Observable<Hero> {
    const heroToUpdate = {
      ...hero,
      powerstats: {
        ...hero.powerstats,
        [powerstat]: hero.powerstats[powerstat] + value,
      },
    };
    return this.update(heroToUpdate);
  }
  update(heroToUpdate: Hero): Observable<Hero> {
    return this.#httpClient
      .put<Hero>(`${this.API_ENDPOINT}/${heroToUpdate.id}`, heroToUpdate)
      .pipe(
        tap((updatedHero) => {
          this.#heroesSignal.update((currentHeroes) =>
            currentHeroes.map((hero) =>
              hero.id === updatedHero.id ? updatedHero : hero
            )
          );
        }),
        catchError((error) => {
          console.error('Failed to update hero', error);
          return throwError(() => error);
        })
      );
  }
  remove(hero: Hero): Observable<void> {
    const { id } = hero;
    return this.#httpClient
      .delete<void>(`${this.API_ENDPOINT}/${hero.id}`)
      .pipe(
        tap(() => {
          this.#heroesSignal.update((currentHeroes) =>
            currentHeroes.filter((hero) => hero.id !== id)
          );
        }),
        catchError((error) => {
          console.error('Error deleting hero', error);
          return throwError(() => error);
        })
      );
  }
  findAll(): Observable<{ heroes: Hero[]; total: number }> {
    return this.#httpClient
      .get<{ heroes: Hero[]; total: number }>(this.API_ENDPOINT)
      .pipe(
        tap((result) => this.#heroesSignal.set(result.heroes)),
        catchError((error) => {
          console.error('Error deleting hero', error);
          return throwError(() => error);
        })
      );
  }
  findOne(id: number): Observable<Hero> {
    return this.#httpClient.get<Hero>(`${this.API_ENDPOINT}/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching hero', error);
        return of(this.NullHero);
      })
    );
  }
}
