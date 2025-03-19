import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RuleComponent } from '../rule/rule.component';
import type { Filter } from '../../../../core/models/filter.model';
import { SearchableDropdownComponent } from '../../controls/searchable-dropdown/searchable-dropdown.component';
import {
  CustomerFilterService,
  RuleFormGroup,
  StepGroup,
} from '../../customer-filter.service';

@Component({
  selector: 'app-step',
  imports: [ReactiveFormsModule, RuleComponent, SearchableDropdownComponent],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepComponent {
  private cfs = inject(CustomerFilterService);

  public index = input<number | null>(null);
  public isRemovalAllowed = input<boolean>(true);
  public filterConfig = input.required<Filter[]>();
  public stepFormGroup = input.required<FormGroup<StepGroup>>();

  public removeStep = output<void>();
  public copyStep = output<void>();

  public eventsTypes = computed<string[]>(() => {
    return this.filterConfig().map((x) => x.type);
  });

  public get rules(): FormArray<FormGroup<RuleFormGroup>> {
    return this.cfs.getRulesForStepGroup(this.stepFormGroup());
  }

  public get hasRules(): boolean {
    return this.cfs.getRulesForStepGroup(this.stepFormGroup()).length > 0;
  }

  public addRule() {
    this.cfs.addRuleForStepGroup(this.stepFormGroup());
  }

  public removeRule(index: number) {
    this.cfs.removeRuleAtForStepGroup(this.stepFormGroup(), index);
  }

  public getAttributesForEvent() {
    const selectedEventType = this.stepFormGroup().getRawValue().eventType;
    return (
      this.filterConfig().find((c) => c.type === selectedEventType)
        ?.properties || []
    );
  }
}
