import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone:true
})
export class SearchInput { 
  placeholder = input<string>('Buscar');
  value = output<string>();
  inputValue = signal<string>('');
  debounceTime = signal<number>(300);

  debounceEffect = effect((onCleanUp)=>{
    const value = this.inputValue();

    const timeout = setTimeout(() =>{
      this.value.emit(value);
    },this.debounceTime());

    onCleanUp(() => {
      clearTimeout(timeout);
    })

  })


}
