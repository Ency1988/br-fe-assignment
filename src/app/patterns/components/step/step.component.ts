import { Component, input } from '@angular/core';
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

@Component({
  selector: 'app-step',
  imports: [ReactiveFormsModule, RuleComponent],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss',
})
export class StepComponent {
  public eventTypes = input.required<string[]>();
  public stepFormGroup = input.required<FormGroup>();

  constructor(private fb: FormBuilder) {}

  get rules(): FormArray {
    return this.stepFormGroup()!.get('rules') as FormArray;
  }

  createRule(): FormGroup {
    return this.fb.group({
      field: ['', Validators.required],
      operator: ['', Validators.required],
      value: ['', Validators.required],
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
}
