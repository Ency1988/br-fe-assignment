export interface Filter {
  type: string;
  properties: { property: string; type: 'string' | 'number' }[];
}
