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

@Component({
  selector: 'app-step',
  imports: [ReactiveFormsModule, RuleComponent],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss',
})
export class StepComponent {
  public eventsMap = input.required<Record<string, string[]>>();
  public stepFormGroup = input.required<FormGroup>();

  public eventsTypes = computed<string[]>(() => {
    return Object.keys(this.eventsMap());
  });

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

  getAttributesForEvent() {
    const selectedEvent = this.stepFormGroup().get('eventType')
      ?.value as string;
    return this.eventsMap()[selectedEvent];
  }
}
