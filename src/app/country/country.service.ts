import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import type { Country } from './interfaces/country.interface';
import { RestCountry } from './interfaces/rest-countries.interfaces';
import { CountryMapper } from './mappers/country.mapper';
import { CountryList } from './shared/components/country-list/country-list';
import { regionType } from './types/region.type';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheByCountry = new Map<string, Country[]>();
  private cacheByRegion = new Map<string, Country[]>();

  searchByCapital(query: string): Observable<Country[]> {
    const url = `${API_URL}/capital/${query}`
    query = query.toLocaleLowerCase();

    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    return this.http.get<RestCountry[]>(url)
      .pipe(
        map((resp) => CountryMapper.restCountryArrayToCountryArray(resp)),
        tap(countries => this.queryCacheCapital.set(query, countries)),
        catchError(error => {
          console.log('Error fetching', error);

          if (error.status === 404) {
            return of([]);
          }

          return throwError(() => new Error(`No se puedo obtener países con ese query ${query}`))
        })
      );
  }

  searchByCountry(query: string): Observable<Country[]> {
    query = query.toLocaleLowerCase();
    const url = `${API_URL}/name/${query}`

    if (this.queryCacheByCountry.has(query)) {
      return of(this.queryCacheByCountry.get(query) ?? []);
    }

    console.log(`Llegando al servidor por ${query}`);


    return this.http.get<RestCountry[]>(url)
      .pipe(
        map((resp) => CountryMapper.restCountryArrayToCountryArray(resp)),
        tap(cacheByCountry => this.queryCacheByCountry.set(query, cacheByCountry)),
        delay(2000),
        catchError(error => {
          console.log('Error fetching', error)

          return throwError(
            () => new Error(`No se pudo obtener países con ese ${query}`)
          );
        })
      )

  }

  searchCountryByAlphaCode(code: string) {
    const url = `${API_URL}/alpha/${code}`;

    return this.http.get<RestCountry[]>(url)
      .pipe(
        map((resp) => CountryMapper.restCountryArrayToCountryArray(resp)),
        map(countries => countries.at(0)),
        catchError(error => {
          console.log('Error fetching', error)
          return throwError(() => new Error(`No se pudo obtener países con ese código ${code}`))
        })
      )

  }

  searchByRegion(region: regionType) {
    const query = region.toLowerCase();
    const url = `${API_URL}/region/${query}`;

    if (this.cacheByRegion.has(query)) {
      return of(this.cacheByRegion.get(query) ?? [])
    }

    console.log(`Llegando al servidor por ${query}`);
    return this.http.get<RestCountry[]>(url)
      .pipe(
        map((resp) => CountryMapper.restCountryArrayToCountryArray(resp)),
        tap(cacheByRegion => this.cacheByRegion.set(query, cacheByRegion)),

        catchError(error => {
          console.log('Error fetching Region Countries', error)

          return throwError(
            () => new Error(`No se pudo obtener países por región con ${query}`)
          )
        })
      )
  }


}
