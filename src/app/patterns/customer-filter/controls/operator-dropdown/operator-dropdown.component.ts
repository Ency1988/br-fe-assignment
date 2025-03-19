import { Component, computed, input, model, signal } from '@angular/core';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface OperatorOption {
  value: string;
  typeOperator: 'number' | 'string' | 'numbers';
}

@Component({
  selector: 'app-operator-dropdown',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin],
  templateUrl: './operator-dropdown.component.html',
  styleUrl: './operator-dropdown.component.scss',
  host: {
    '(click)': 'isOpen.set(true)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: OperatorDropdownComponent,
      multi: true,
    },
  ],
})
export class OperatorDropdownComponent implements ControlValueAccessor {
  public isOpen = model(false);
  public options = input.required<OperatorOption[]>();
  public placeholder = input<string>('Select operator');
  public value = signal<OperatorOption | undefined>(undefined);

  protected numericOptions = computed<OperatorOption[]>(() =>
    this.options().filter((o) =>
      ['number', 'numbers'].includes(o.typeOperator),
    ),
  );
  protected textOptions = computed<OperatorOption[]>(() =>
    this.options().filter((o) => o.typeOperator === 'string'),
  );

  protected optionTypeToggle = signal<'numeric' | 'text'>('text');

  protected onTouched = () => {
    /* No-op function */
  };
  protected valueChange: (value: string | null) => void = () => {
    /* No-op function */
  };

  writeValue(value: string): void {
    const option = this.options().find((o) => o.value === value);
    this.optionTypeToggle.set(
      option?.typeOperator === 'string' ? 'text' : 'numeric',
    );
    this.value.set(option);
  }
  registerOnChange(fn: typeof this.valueChange): void {
    this.valueChange = fn;
  }
  registerOnTouched(fn: typeof this.onTouched): void {
    this.onTouched = fn;
  }

  public setValue(option: OperatorOption): void {
    this.value.set(option);
    this.closePanel();
    this.valueChange(option.value);
  }

  markAsTouched() {
    if (!this.isOpen()) {
      this.onTouched();
    }
  }

  public closePanel() {
    this.isOpen.set(false);
    this.markAsTouched();
  }
}
