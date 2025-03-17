import { Component, inject } from '@angular/core';
import { CustomersRepository } from '../../../core/customers/customers.repository';
import { toSignal } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-customers',
  imports: [JsonPipe],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
  providers: [CustomersRepository],
})
export class CustomersComponent {
  public customerRepository = inject(CustomersRepository);
  public filters = toSignal(this.customerRepository.getFiltersData());
}
