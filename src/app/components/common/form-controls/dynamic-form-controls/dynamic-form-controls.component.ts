import { ControlTypes } from './../../../../utils/enums';
import { DynamicFormBase } from './../../../../models/dynamic-form-base';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form-controls',
  templateUrl: './dynamic-form-controls.component.html',
  styleUrls: ['./dynamic-form-controls.component.scss']
})
export class DynamicFormControlsComponent implements OnInit {
  @Input() control: DynamicFormBase<string>;
  @Input() form: FormGroup;
  controlTypes = ControlTypes;
  get isValid() { return this.form.controls[this.control.key].valid; }
  constructor() { }

  ngOnInit() {
  }

}
