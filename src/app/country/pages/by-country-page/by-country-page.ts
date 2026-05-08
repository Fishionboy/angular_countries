import { ChangeDetectionStrategy, Component, inject, input, resource, signal, linkedSignal } from '@angular/core';
import { CountryList } from "../../shared/components/country-list/country-list";
import { SearchInput } from "../../shared/components/search-input/search-input";
import { CountryService } from '../../country.service';
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-country-page',
  imports: [CountryList, SearchInput],
  templateUrl: './by-country-page.html',
  standalone:true
})
export class ByCountryPage { 

  countryService = inject(CountryService);


  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query');
  query = linkedSignal(()=> this.queryParam ?? '');

  countryResource = rxResource({
    params: ()=> ({query: this.query()}),
    stream: ({params}) => {
      if(!params.query)return of ([]);

      this.router.navigate(['/country/by-country'],{
        queryParams:{
          query: params.query
        }
      })

      return this.countryService.searchByCountry(params.query)
    }
  })

}
