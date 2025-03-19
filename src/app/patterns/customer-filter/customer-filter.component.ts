import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import type { Filter } from '../../core/models/filter.model';
import type { Step } from '../../core/models/condition.model';
import { StepComponent } from './components/step/step.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerFilterService } from './customer-filter.service';

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
    transform: (x) => (!!x ? x : []),
  });
  public applyFilters = output<Step[]>();

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
    console.log('RESULT');
    console.log(this.cfs.customerFilterFormGroup.value);
  }
}
