import { ChangeDetectorRef, inject, Injectable } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { OperatorOption } from './controls/operator-dropdown/operator-dropdown.component';

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
  private cdr = inject(ChangeDetectorRef);

  public readonly operators: OperatorOption[] = [
    { value: 'equal to', typeOperator: 'number' },
    { value: 'is between', typeOperator: 'numbers' },
    { value: 'less than', typeOperator: 'number' },
    { value: 'greater then', typeOperator: 'number' },
    { value: 'equals', typeOperator: 'string' },
    { value: 'does not equal', typeOperator: 'string' },
    { value: 'contains', typeOperator: 'string' },
    { value: 'does not contain', typeOperator: 'string' },
  ];

  public customerFilterFormGroup: CustomerFilterFormGroup = this.getEmptyForm();

  get steps() {
    return this.customerFilterFormGroup.get('steps') as FormArray<
      FormGroup<StepGroup>
    >;
  }

  public addEmptyStep(): void {
    this.steps.push(this.createEmptyStep());
    this.cdr.markForCheck();
  }

  public removeStepAt(stepIndex: number) {
    this.steps.removeAt(stepIndex);
    this.cdr.markForCheck();
  }

  public discardFilters() {
    this.customerFilterFormGroup = this.fb.group({
      steps: this.fb.array([this.createEmptyStep()]),
    });
    this.cdr.markForCheck();
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
    this.cdr.markForCheck();
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
    this.cdr.markForCheck();
  }

  public removeRuleAtForStepGroup(
    stepGroup: FormGroup<StepGroup>,
    indexOfRule: number,
  ): void {
    this.getRulesForStepGroup(stepGroup).removeAt(indexOfRule);
    this.cdr.markForCheck();
  }
}
