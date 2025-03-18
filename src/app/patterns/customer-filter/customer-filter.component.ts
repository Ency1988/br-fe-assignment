import { Component, inject, input, output } from '@angular/core';
import type { Filter } from '../../core/models/filter.model';
import type { Step } from '../../core/models/condition.model';
import { StepComponent } from './components/step/step.component';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  isFormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface RuleFormGroup {
  field: FormControl<string | null>;
  operator: FormControl<string | null>;
  value: FormControl<string | null>;
}

interface StepGroup {
  eventType: FormControl<string | null>;
  rules: FormArray<FormGroup<RuleFormGroup>>;
}

export type CustomerFilterFormGroup = FormGroup<{
  steps: FormArray<FormGroup<StepGroup>>;
}>;

@Component({
  selector: 'app-customer-filter',
  imports: [ReactiveFormsModule, StepComponent],
  templateUrl: './customer-filter.component.html',
  styleUrl: './customer-filter.component.scss',
})
export class CustomerFilterComponent {
  private fb = inject(FormBuilder);

  public filterConfig = input.required<Filter[], Filter[] | null>({
    transform: (x) => (!!x ? x : []),
  });
  public applyFilters = output<Step[]>();

  public customerFilterFormGroup: CustomerFilterFormGroup = this.getEmptyForm();

  private getEmptyForm(): CustomerFilterFormGroup {
    return this.fb.group({
      steps: this.fb.array([this.createStep()]),
    });
  }

  public createStep(): FormGroup<StepGroup> {
    return this.fb.group({
      eventType: ['', Validators.required],
      rules: this.fb.array<FormGroup<RuleFormGroup>>([]),
    });
  }

  get steps() {
    return this.customerFilterFormGroup.get('steps') as FormArray<
      FormGroup<StepGroup>
    >;
  }

  public transformType(control: unknown): FormGroup {
    if (isFormGroup(control)) {
      return control;
    }
    throw Error('control must be an Group');
  }

  public addStep(): void {
    this.steps.push(this.createStep());
  }

  onApplyFilters() {
    console.log('RESULT');
    console.log(this.customerFilterFormGroup.value);
  }

  removeStep(stepIndex: number) {
    this.steps.removeAt(stepIndex);
  }

  discardFilters() {
    this.customerFilterFormGroup = this.fb.group({
      steps: this.fb.array([this.createStep()]),
    });
  }

  copyStep(indexOfStep: number) {
    const stepToCopy = this.steps.at(indexOfStep).getRawValue();
    const newStep = new FormGroup<StepGroup>({
      eventType: new FormControl(stepToCopy.eventType),
      rules: new FormArray<FormGroup<RuleFormGroup>>(
        stepToCopy.rules.map(
          (rule) =>
            new FormGroup<RuleFormGroup>({
              field: new FormControl(rule.field),
              operator: new FormControl(rule.operator),
              value: new FormControl(rule.value),
            }),
        ),
      ),
    });
    this.steps.push(newStep);
  }
}
