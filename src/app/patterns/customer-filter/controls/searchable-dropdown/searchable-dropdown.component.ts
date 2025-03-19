import {
  Component,
  computed,
  effect,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-searchable-dropdown',
  imports: [OverlayModule],
  templateUrl: './searchable-dropdown.component.html',
  styleUrl: './searchable-dropdown.component.scss',
  host: {
    '(click)': 'isOpen.set(true)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SearchableDropdownComponent,
      multi: true,
    },
  ],
})
export class SearchableDropdownComponent implements ControlValueAccessor {
  public placeholder = input<string>('Select value');
  public filterPlaceholder = input<string>('Filter value');
  parentBadge = input<string | null>(null);

  public options = input<string[]>([]);
  public filterQuery = signal('');

  public filteredOptions = computed<string[]>(() => {
    const filterQuery = this.filterQuery();
    return !!filterQuery
      ? this.options().filter((option) => option.includes(filterQuery))
      : this.options();
  });

  public isOpen = model(false);
  public value = signal<string | null>('');

  constructor() {
    effect(() => {
      if (!this.isOpen()) {
        untracked(() => {
          this.filterQuery.set('');
        });
      }
    });
  }

  protected valueChange: (value: string | null) => void = () => {};
  protected onTouched = () => {};

  writeValue(value: string | null): void {
    this.value.set(value);
  }
  registerOnChange(fn: typeof this.valueChange): void {
    this.valueChange = fn;
  }
  registerOnTouched(fn: typeof this.onTouched): void {
    this.onTouched = fn;
  }

  markAsTouched() {
    if (!this.isOpen()) {
      this.onTouched();
    }
  }

  public setValue(option: string) {
    this.value.set(option);
    this.closePanel();
    this.valueChange(option);
  }

  handleFilterChange(inputEvent: Event) {
    let filterValue = (inputEvent.target as HTMLInputElement).value;
    this.filterQuery.set(filterValue);
  }

  closePanel() {
    this.isOpen.set(false);
    this.markAsTouched();
  }
}
