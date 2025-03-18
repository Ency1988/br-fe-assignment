import { Component, input, output } from '@angular/core';
import type { Filter } from '../../core/models/filter.model';
import type { Step } from '../../core/models/condition.model';
import { StepComponent } from './components/step/step.component';
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
  public filterConfig = input.required<Filter[], Filter[] | null>({
    transform: (x) => (!!x ? x : []),
  });
  public applyFilters = output<Step[]>();

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

  public addStep(): void {
    this.steps.push(this.createStep());
  }

  onApplyFilters() {
    console.log('onApplyFilters');
    console.log(this.stepsForm.value);
  }

  removeStep(stepIndex: number) {
    this.steps.removeAt(stepIndex);
  }
}
