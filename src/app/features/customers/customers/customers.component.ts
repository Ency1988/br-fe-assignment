import { Component, inject } from '@angular/core';
import { CustomersRepository } from '../../../core/customers/customers.repository';
import { toSignal } from '@angular/core/rxjs-interop';
import { CustomerFilterComponent } from '../../../patterns/customer-filter/customer-filter.component';

@Component({
  selector: 'app-customers',
  imports: [CustomerFilterComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
  providers: [CustomersRepository],
})
export class CustomersComponent {
  public customerRepository = inject(CustomersRepository);
  public filterConfig = toSignal(this.customerRepository.getFilterConfigData());

  public showFilters(filters: any) {
    console.log();
  }
}
