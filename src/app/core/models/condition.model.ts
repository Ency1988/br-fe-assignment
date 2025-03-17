export interface Step {
  value: string;
  rules: Rule[];
}

export interface Rule {
  field: string;
  operator: string;
  value: string | number | [number, number];
}
