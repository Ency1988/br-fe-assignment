import { Component, input, output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-rule',
  imports: [ReactiveFormsModule],
  templateUrl: './rule.component.html',
  styleUrl: './rule.component.scss',
})
export class RuleComponent {
  public ruleFormGroup = input.required<any>();
  public removeRule = output<void>();
}
