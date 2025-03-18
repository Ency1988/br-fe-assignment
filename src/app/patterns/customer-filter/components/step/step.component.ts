import { Component, computed, input, output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  isFormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RuleComponent } from '../rule/rule.component';
import type { Filter } from '../../../../core/models/filter.model';
import { SearchableDropdownComponent } from '../../controls/searchable-dropdown/searchable-dropdown.component';

@Component({
  selector: 'app-step',
  imports: [ReactiveFormsModule, RuleComponent, SearchableDropdownComponent],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss',
})
export class StepComponent {
  public index = input<number | null>(null);
  public isRemovalAllowed = input<boolean>(true);
  public filterConfig = input.required<Filter[]>();
  public stepFormGroup = input.required<
    FormGroup<{
      eventType: FormControl;
      rules: FormArray<
        FormGroup<{
          field: FormControl<string | null>;
          operator: FormControl<string | null>;
          value: FormControl<string | null>;
        }>
      >;
    }>
  >();

  public removeStep = output<void>();

  public eventsTypes = computed<string[]>(() => {
    return this.filterConfig().map((x) => x.type);
  });

  get rules(): FormArray<
    FormGroup<{
      field: FormControl<string | null>;
      operator: FormControl<string | null>;
      value: FormControl<string | number | null>;
    }>
  > {
    return this.stepFormGroup()!.get('rules') as FormArray<
      FormGroup<{
        field: FormControl<string | null>;
        operator: FormControl<string | null>;
        value: FormControl<string | number | null>;
      }>
    >;
  }

  createRule(): FormGroup<{
    field: FormControl<string | null>;
    operator: FormControl<string | null>;
    value: FormControl<string | number | null>;
  }> {
    return new FormGroup({
      field: new FormControl<string | null>('', [Validators.required]),
      operator: new FormControl<string | null>('', [Validators.required]),
      value: new FormControl<string | number | null>('', [Validators.required]),
    });
  }

  addRule(): void {
    this.rules.push(this.createRule());
  }

  removeRule(index: number): void {
    this.rules.removeAt(index);
  }

  public transformType(control: unknown): FormControl {
    if (isFormControl(control)) {
      return control;
    }
    throw Error('control must be an Control');
  }

  getAttributesForEvent() {
    const selectedEvent = this.stepFormGroup().get('eventType')
      ?.value as string;
    return this.filterConfig().find((c) => c.type === selectedEvent)!
      .properties;
  }
}
