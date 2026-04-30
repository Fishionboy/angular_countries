import { CountryService } from './../../country.service';
import { REGIONS, regionType } from './../../types/region.type';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CountryList } from "../../shared/components/country-list/country-list";
import { Country } from '../../interfaces/country.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

@Component({
  selector: 'app-by-region-page',
  imports: [CountryList],
  templateUrl: './by-region-page.html',
 standalone:true
})
export class ByRegionPage {

  public regionsOptions : typeof REGIONS = REGIONS;
  
  selectedRegion= signal <regionType | null> (null);
  isLoading = signal<boolean>(false);
  isError = signal<boolean>(false);
  countries = signal<Country[]>([]);

  countryService = inject(CountryService);
  query = signal('');

  public selectRegion (region : regionType){
    this.selectedRegion.set(region);
  }

  byRegionResource = rxResource(
    {
      params: () => ({region : this.selectedRegion()}),
      stream:({params}) => {
        if(!params.region) return of([]);

        return this.countryService.searchByRegion(params.region);
      }
    }
  )
 }
