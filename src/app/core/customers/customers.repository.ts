import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Filter } from '../models/filter.model';

@Injectable()
export class CustomersRepository {
  private httpClient = inject(HttpClient);

  public getFilterConfigData(): Observable<Filter[]> {
    return this.httpClient
      .get<{
        events: Filter[];
      }>('https://br-fe-assignment.github.io/customer-events/events.json')
      .pipe(map((d) => d['events']));
  }
}
