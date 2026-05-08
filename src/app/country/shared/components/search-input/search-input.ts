import { ChangeDetectionStrategy, Component, effect, input, linkedSignal, output, signal } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone:true
})
export class SearchInput { 
  placeholder = input<string>('Buscar');
  debounceTime = signal<number>(300);
  initialValue = input<string>('');
  value = output<string>();
  inputValue = linkedSignal<string>(() => this.initialValue() ?? '');

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
