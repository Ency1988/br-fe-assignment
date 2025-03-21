import { Component, inject } from '@angular/core';
import { CustomersRepository } from '../../../core/customers/customers.repository';
import {
  CustomerFilterComponent,
  FilterValue,
} from '../../../patterns/customer-filter/customer-filter.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-customers',
  imports: [CustomerFilterComponent, AsyncPipe],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
  providers: [CustomersRepository],
})
export class CustomersComponent {
  private customerRepository = inject(CustomersRepository);

  public filters = this.customerRepository.getFilterConfigData();

  public showFilters(filters: FilterValue) {
    console.log('### RESULT ###');
    console.log(JSON.stringify(filters, null, 2));
  }
}
