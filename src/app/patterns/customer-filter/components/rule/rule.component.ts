import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchableDropdownComponent } from '../../controls/searchable-dropdown/searchable-dropdown.component';
import { RangeValueControlComponent } from '../../controls/range-value-control/range-value-control.component';
import {
  OperatorDropdownComponent,
  OperatorOption,
} from '../../controls/operator-dropdown/operator-dropdown.component';
import { startWith } from 'rxjs';
import {
  CustomerFilterService,
  RuleFormGroup,
} from '../../customer-filter.service';

@Component({
  selector: 'app-rule',
  imports: [
    ReactiveFormsModule,
    SearchableDropdownComponent,
    RangeValueControlComponent,
    OperatorDropdownComponent,
  ],
  templateUrl: './rule.component.html',
  styleUrl: './rule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RuleComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  public cfs = inject(CustomerFilterService);

  public controlTypeToUse = signal<OperatorOption['typeOperator']>('string');
  public ruleFormGroup = input.required<FormGroup<RuleFormGroup>>();
  public parentEvent = input<string | null>(null);
  public supportedAttributes =
    input.required<{ type: 'string' | 'number'; property: string }[]>();

  public attributesValues = computed<string[]>(() =>
    this.supportedAttributes().map((a) => a.property),
  );

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
      .controls['field'].valueChanges.pipe(
        startWith(this.ruleFormGroup().value.field),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((fieldValue) => {
        if (fieldValue) {
          const expectedAttributeType: 'string' | 'number' | undefined =
            this.supportedAttributes().find(
              (x) => x.property === fieldValue,
            )?.type;
          const defaultValue =
            expectedAttributeType === 'string' ? 'equals' : 'equal to';
          if (!this.ruleFormGroup().value.operator) {
            this.ruleFormGroup().get('operator')?.setValue(defaultValue);
            this.cdr.markForCheck();
          }
        }
      });
  }

  private selectValueFieldAfterOperatorChangeSideEffect() {
    this.ruleFormGroup()
      .controls['operator'].valueChanges.pipe(
        startWith(this.ruleFormGroup().value.operator),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((operatorValue) => {
        const operatorType = this.cfs.operators.find(
          (o) => o.value === operatorValue,
        )?.typeOperator;
        if (operatorType && operatorValue !== this.controlTypeToUse()) {
          this.controlTypeToUse.set(operatorType);
        }
      });
  }
}
