import { Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { CountryService } from '../../country.service';
import type{ Country } from '../../interfaces/country.interface';
import { CountryList } from "../../shared/components/country-list/country-list";
import { SearchInput } from "../../shared/components/search-input/search-input";
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInput, CountryList],
  templateUrl: './by-capital-page.html',
  standalone:true
})

export class ByCapitalPage {

  isLoading = signal<boolean>(false);
  isError = signal<string|null>(null);
  countries = signal<Country[]>([]);

  countryService = inject(CountryService);
  router = inject(Router);

  
  activatedRoute = inject(ActivatedRoute);
  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';
  query = linkedSignal(() => this.queryParam ?? '');

  countryResource = rxResource(
  {
    params: () => ( {query: this.query()} ),
    stream: ({params}) => {
      if(!params.query) return of([]);

      this.router.navigate(['/country/by-capital'],{
        queryParams:{
          query: params.query
        }
      })
      return  this.countryService.searchByCapital(params.query)
    }
  }
)

  // countryResource = resource({
  //   params:()=> ({ query: this.query()}),
  //   loader: async({params})=>{
  //     if(!params.query )return [];

  //     return await firstValueFrom(
  //       this.countryService.searchByCapital(params.query)
  //     )

      
  //   }
  // })
  // onSearch(query: string){
  //   if(this.isLoading()) return;

  //   this.isLoading.set(true);
  //   this.isError.set(null);

  //  this.countryService.searchByCapital(query)
  //  .subscribe({
  //   next:(countriesResult)=> {
     
  //     this.isLoading.set(false);
  //     this.countries.set(countriesResult);

  //     console.log(countriesResult);
      
   
  //   },
  //   error:(err)=> {
  //     this.isLoading.set(false);
  //     this.countries.set([]);
  //     this.isError.set(err)
  //   },
  //  });
  // }
 
 }
