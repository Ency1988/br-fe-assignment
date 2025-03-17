import { Component, computed, input, output, signal } from '@angular/core';
import type { Filter } from '../../core/models/filter.model';
import type { Step } from '../../core/models/condition.model';
import { StepComponent } from '../components/step/step.component';

@Component({
  selector: 'app-customer-filter',
  imports: [StepComponent],
  templateUrl: './customer-filter.component.html',
  styleUrl: './customer-filter.component.scss',
})
export class CustomerFilterComponent {
  public filterConfig = input<Filter[]>();
  public applyFilters = output<Step[]>();

  public eventTypes = computed<string[]>(() => {
    const config = this.filterConfig();
    return Array.isArray(config) && config.length > 0
      ? config.map((e) => e.type)
      : [];
  });

  public steps = signal<Step[]>([{ value: '', rules: [] }]);
}
