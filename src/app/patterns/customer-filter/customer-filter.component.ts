import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import type { Filter } from '../../core/models/filter.model';
import { StepComponent } from './components/step/step.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerFilterService } from './customer-filter.service';

export interface FilterValue {
  steps: {
    eventType: string | null;
    rules: {
      field: string | null;
      operator: string | null;
      value: string | number | null;
    }[];
  }[];
}

@Component({
  selector: 'app-customer-filter',
  imports: [ReactiveFormsModule, StepComponent],
  templateUrl: './customer-filter.component.html',
  styleUrl: './customer-filter.component.scss',
  providers: [CustomerFilterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerFilterComponent {
  public filterConfig = input.required<Filter[], Filter[] | null>({
    transform: (x) => (x ? x : []),
  });
  public applyFilters = output<FilterValue>();

  public cfs = inject(CustomerFilterService);

  public get isRemovalAllowed() {
    return this.cfs.steps.length > 1;
  }

  public discardFilters() {
    this.cfs.discardFilters();
  }

  public removeStep(index: number) {
    this.cfs.removeStepAt(index);
  }

  public copyStep(index: number) {
    this.cfs.copyStepAt(index);
  }

  public addEmptyStep() {
    this.cfs.addEmptyStep();
  }

  public onApplyFilters() {
    const filterValue = this.cfs.customerFilterFormGroup.getRawValue();
    this.applyFilters.emit(filterValue);
  }
}
