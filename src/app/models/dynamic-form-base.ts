import { ControlTypes } from './../utils/enums';
export class DynamicFormBase<T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  type: string;
  options: {key: string, value: string}[];
  constructor(options: {
    value?: T;
    key?: string;
    label?: string;
    required?: boolean;
    order?: number;
    controlType?: string;
    type?: string;
    options?: {key: string, value: string}[];
  } = {}) {
  this.value = options.value;
  this.key = options.key || '';
  this.label = options.label || '';
  this.required = !!options.required;
  this.order = options.order === undefined ? 1 : options.order;
  this.controlType = options.controlType || '';
  this.type = options.type || '';
  this.options = options.options || [];
}
}

export class TextboxControl extends DynamicFormBase<string> {
  controlType = ControlTypes.textbox;
}

export class DropdownControl extends DynamicFormBase<string> {
  controlType = ControlTypes.dropdown;
}

export class ToggleControl extends DynamicFormBase<boolean> {
  controlType = ControlTypes.toggle;
}


