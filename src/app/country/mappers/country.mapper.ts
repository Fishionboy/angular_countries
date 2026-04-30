import type{ Country } from './../interfaces/country.interface';
import type{ RestCountry } from './../interfaces/rest-countries.interfaces';
export class CountryMapper{

    static mapRestCountryToCountry( restCountry:RestCountry ):Country{
        return{
            cca2: restCountry.cca2,
            flag: restCountry.flag,
            flagSvg: restCountry.flags.svg,
            name: restCountry.translations['spa'].common ?? 'No spanish name',
            capital: restCountry.capital?.join(',') ?? 'No capital',
            population: restCountry.population,
            region: restCountry.region,
            subRegion: restCountry.subregion
        } ;
    }

    static restCountryArrayToCountryArray (restCountries:RestCountry[]):Country[]{
        return restCountries.map(this.mapRestCountryToCountry)
    }
    
}