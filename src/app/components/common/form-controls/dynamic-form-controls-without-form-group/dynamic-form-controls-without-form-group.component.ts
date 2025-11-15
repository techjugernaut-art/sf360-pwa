import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormBase } from 'src/app/models/dynamic-form-base';

@Component({
  selector: 'app-dynamic-form-controls-without-form-group',
  templateUrl: './dynamic-form-controls-without-form-group.component.html',
  styleUrls: ['./dynamic-form-controls-without-form-group.component.scss']
})
export class DynamicFormControlsWithoutFormGroupComponent implements OnInit {

  @Input() control: DynamicFormBase<string>;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.control.key].valid; }
  constructor() { }

  ngOnInit() {
  }

}
