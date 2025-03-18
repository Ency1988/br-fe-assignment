import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { combineLatest, map, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-range-value-control',
  imports: [ReactiveFormsModule],
  templateUrl: './range-value-control.component.html',
  styleUrl: './range-value-control.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RangeValueControlComponent,
      multi: true,
    },
  ],
})
export class RangeValueControlComponent
  implements OnInit, ControlValueAccessor
{
  private destroyRef = inject(DestroyRef);
  protected fromControl = new FormControl(0);
  protected toControl = new FormControl(0);

  public ngOnInit() {
    combineLatest([
      this.fromControl.valueChanges.pipe(startWith(this.fromControl.value)),
      this.toControl.valueChanges.pipe(startWith(this.fromControl.value)),
    ])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((v) => [v[0] || 0, v[1] || 0] as [number, number]),
      )
      .subscribe((v) => {
        this.valueChange(v);
      });
  }

  private onTouched = (): void => {};
  protected valueChange: (value: [number, number]) => void = () => {};

  writeValue(newValue: [number, number]): void {
    this.fromControl.setValue(newValue[0] || 0, { emitEvent: false });
    this.toControl.setValue(newValue[1] || 0, { emitEvent: false });
  }

  registerOnChange(fn: (value: [number, number]) => void): void {
    this.valueChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public handleBlur() {
    this.onTouched();
  }
}
