import { ChangeDetectionStrategy, Component, inject, input, resource, signal } from '@angular/core';
import { CountryList } from "../../shared/components/country-list/country-list";
import { SearchInput } from "../../shared/components/search-input/search-input";
import { CountryService } from '../../country.service';
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-by-country-page',
  imports: [CountryList, SearchInput],
  templateUrl: './by-country-page.html',
  standalone:true
})
export class ByCountryPage { 

  countryService = inject(CountryService);
  query = signal(''); 

  countryResource = rxResource({
    params: ()=> ({query: this.query()}),
    stream: ({params}) => {
      if(!params.query)return of ([]);

      return this.countryService.searchByCountry(params.query)
    }
  })

}
