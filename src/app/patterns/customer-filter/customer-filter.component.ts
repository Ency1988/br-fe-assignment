import { Component, computed, input, output, signal } from '@angular/core';
import type { Filter } from '../../core/models/filter.model';
import type { Step } from '../../core/models/condition.model';
import { StepComponent } from '../components/step/step.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  isFormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-customer-filter',
  imports: [ReactiveFormsModule, StepComponent],
  templateUrl: './customer-filter.component.html',
  styleUrl: './customer-filter.component.scss',
})
export class CustomerFilterComponent {
  public filterConfig = input<Filter[]>();
  public applyFilters = output<Step[]>();

  public eventTypes = computed<Record<string, string[]>>(() => {
    const config = this.filterConfig();
    let result = {};
    if (Array.isArray(config) && config.length > 0) {
      result = config.reduce(
        (acc, current) => {
          acc[current.type] = current.properties.map((p) => p.property);
          return acc;
        },
        {} as Record<string, string[]>,
      );
    }
    return result;
  });

  public stepsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.stepsForm = this.fb.group({
      steps: this.fb.array([this.createStep()]),
    });

    this.stepsForm.valueChanges.subscribe(() => {
      console.log('stepsForm', this.stepsForm.value);
    });
  }

  public createStep(): FormGroup {
    return this.fb.group({
      eventType: ['', Validators.required],
      rules: this.fb.array([]),
    });
  }

  get steps(): FormArray {
    return this.stepsForm.get('steps') as FormArray;
  }

  public transformType(control: unknown): FormGroup {
    if (isFormGroup(control)) {
      return control;
    }
    throw Error('control must be an Group');
  }

  public addStep(): void {}

  onApplyFilters() {
    console.log('onApplyFilters');
    console.log(this.stepsForm.value);
  }
}
