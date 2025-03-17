import { Component, input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Rule } from '../../../core/models/condition.model';
import { RuleComponent } from '../rule/rule.component';

@Component({
  selector: 'app-step',
  imports: [ReactiveFormsModule, RuleComponent],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss',
})
export class StepComponent {
  public eventTypes = input.required<string[]>();

  public eventTypeControl = new FormControl();

  ////

  ruleForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.ruleForm = this.fb.group({
      rules: this.fb.array([]), // Initialize as empty FormArray
    });
  }

  get rules(): FormArray {
    return this.ruleForm.get('rules') as FormArray;
  }

  createRule(): FormGroup {
    return this.fb.group({
      field: ['', Validators.required],
      operator: ['', Validators.required],
      value: ['', Validators.required], // Change based on value type
    });
  }

  addRule(): void {
    this.rules.push(this.createRule());
  }

  removeRule(index: number): void {
    this.rules.removeAt(index);
  }

  submit(): void {
    if (this.ruleForm.valid) {
      const rules: Rule[] = this.ruleForm.value.rules;
      console.log('Submitted Rules:', rules);
    }
  }

  showRules() {
    console.log(this.ruleForm);
  }
}
