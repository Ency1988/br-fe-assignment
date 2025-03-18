import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ControlType = 'number' | 'string' | 'numbers';

@Component({
  selector: 'app-rule',
  imports: [ReactiveFormsModule],
  templateUrl: './rule.component.html',
  styleUrl: './rule.component.scss',
})
export class RuleComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  public operators: {
    value: string;
    typeOperator: ControlType;
  }[] = [
    { value: 'equal to', typeOperator: 'number' },
    { value: 'is between', typeOperator: 'numbers' },
    { value: 'less than', typeOperator: 'number' },
    { value: 'greater then', typeOperator: 'number' },
    { value: 'equals', typeOperator: 'string' },
    { value: 'does not equal', typeOperator: 'string' },
    { value: 'contains', typeOperator: 'string' },
    { value: 'does not contain', typeOperator: 'string' },
  ];

  public controlTypeToUse = signal<ControlType>('string');

  public ruleFormGroup = input.required<
    FormGroup<{
      field: FormControl<string | null>;
      operator: FormControl<string | null>;
      value: FormControl<string | number | null>;
    }>
  >();
  public supportedAttributes =
    input.required<{ type: 'string' | 'number'; property: string }[]>();

  public removeRule = output<void>();

  ngOnInit(): void {
    this.attachSideEffects();
  }

  private attachSideEffects() {
    this.setDefaultOperatorAfterFieldChange();
    this.selectValueFieldAfterOperatorChangeSideEffect();
  }

  private setDefaultOperatorAfterFieldChange() {
    this.ruleFormGroup()
      .controls['field'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => {
        console.log(v);
        if (v) {
          const expectedAttributeType: 'string' | 'number' =
            this.supportedAttributes().find((x) => x.property === v)?.type!;
          const defaultValue =
            expectedAttributeType === 'string' ? 'equals' : 'equal to';
          this.ruleFormGroup().get('operator')?.setValue(defaultValue);
        }
      });
  }

  private selectValueFieldAfterOperatorChangeSideEffect() {
    this.ruleFormGroup()
      .controls['operator'].valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((operatorValue) => {
        const operatorType = this.operators.find(
          (o) => o.value === operatorValue,
        )?.typeOperator;
        if (operatorType && operatorValue !== this.controlTypeToUse()) {
          const valueField = this.ruleFormGroup().controls['value'];

          // TODO: Extract default value setting into custom control
          if (operatorType === 'string') {
            valueField.setValue('');
          } else if (operatorType === 'number') {
            valueField.setValue(0);
          }
          // TODO: Numbers
          this.controlTypeToUse.set(operatorType);
        }
      });
  }
}
