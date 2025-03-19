import { inject, Injectable } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  isFormGroup,
  Validators,
} from '@angular/forms';

export interface RuleFormGroup {
  field: FormControl<string | null>;
  operator: FormControl<string | null>;
  value: FormControl<string | number | null>;
}

export interface StepGroup {
  eventType: FormControl<string | null>;
  rules: FormArray<FormGroup<RuleFormGroup>>;
}

export type CustomerFilterFormGroup = FormGroup<{
  steps: FormArray<FormGroup<StepGroup>>;
}>;

@Injectable()
export class CustomerFilterService {
  private fb = inject(FormBuilder);

  public customerFilterFormGroup: CustomerFilterFormGroup = this.getEmptyForm();

  get steps() {
    return this.customerFilterFormGroup.get('steps') as FormArray<
      FormGroup<StepGroup>
    >;
  }

  public addEmptyStep(): void {
    this.steps.push(this.createEmptyStep());
  }

  public removeStepAt(stepIndex: number) {
    this.steps.removeAt(stepIndex);
  }

  public discardFilters() {
    this.customerFilterFormGroup = this.fb.group({
      steps: this.fb.array([this.createEmptyStep()]),
    });
  }

  copyStepAt(indexOfStep: number) {
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

  public createEmptyStep(): FormGroup<StepGroup> {
    return this.fb.group({
      eventType: ['', Validators.required],
      rules: this.fb.array<FormGroup<RuleFormGroup>>([]),
    });
  }

  private getEmptyForm(): CustomerFilterFormGroup {
    return this.fb.group({
      steps: this.fb.array([this.createEmptyStep()]),
    });
  }

  public createRule(): FormGroup<RuleFormGroup> {
    return new FormGroup({
      field: new FormControl<string | null>('', [Validators.required]),
      operator: new FormControl<string | null>('', [Validators.required]),
      value: new FormControl<string | number | null>('', [Validators.required]),
    });
  }

  public getRulesForStepGroup(
    stepGroup: FormGroup<StepGroup>,
  ): FormArray<FormGroup<RuleFormGroup>> {
    return stepGroup.controls['rules'];
  }

  public addRuleForStepGroup(stepGroup: FormGroup<StepGroup>): void {
    this.getRulesForStepGroup(stepGroup).push(this.createRule());
  }

  public removeRuleAtForStepGroup(
    stepGroup: FormGroup<StepGroup>,
    indexOfRule: number,
  ): void {
    this.getRulesForStepGroup(stepGroup).removeAt(indexOfRule);
  }
}
