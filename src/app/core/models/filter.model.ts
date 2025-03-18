export interface FilterProperty {
  property: string;
  type: 'string' | 'number';
}

export interface Filter {
  type: string;
  properties: FilterProperty[];
}
