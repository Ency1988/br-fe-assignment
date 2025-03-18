import { Component, computed, input } from '@angular/core';
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
import type { Filter } from '../../../core/models/filter.model';

@Component({
  selector: 'app-step',
  imports: [ReactiveFormsModule, RuleComponent],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss',
})
export class StepComponent {
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

  public eventsTypes = computed<string[]>(() => {
    return this.filterConfig().map((x) => x.type);
  });

  constructor(private fb: FormBuilder) {}

  get rules(): FormArray<
    FormGroup<{
      field: FormControl<string | null>;
      operator: FormControl<string | null>;
      value: FormControl<string | null>;
    }>
  > {
    return this.stepFormGroup()!.get('rules') as FormArray<
      FormGroup<{
        field: FormControl<string | null>;
        operator: FormControl<string | null>;
        value: FormControl<string | null>;
      }>
    >;
  }

  createRule(): FormGroup<{
    field: FormControl<string | null>;
    operator: FormControl<string | null>;
    value: FormControl<string | null>;
  }> {
    return new FormGroup({
      field: new FormControl('', [Validators.required]),
      operator: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
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
