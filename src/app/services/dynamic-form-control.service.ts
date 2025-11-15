import { DynamicFormBase } from './../models/dynamic-form-base';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormControlService {

  constructor() { }
  toFormGroup(controls: DynamicFormBase<string>[] ) {
    const group: any = {};

    controls.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
                                              : new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }
}
