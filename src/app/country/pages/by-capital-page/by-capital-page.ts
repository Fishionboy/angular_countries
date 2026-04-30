import { Component, inject, resource, signal } from '@angular/core';
import { CountryService } from '../../country.service';
import type{ Country } from '../../interfaces/country.interface';
import { CountryList } from "../../shared/components/country-list/country-list";
import { SearchInput } from "../../shared/components/search-input/search-input";
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

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
  query = signal('');

  countryResource = rxResource(
  {
    params: () => ( {query: this.query()} ),
    stream: ({params}) => {
      if(!params.query) return of([]);
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
