import { AbstractControl, ValidationErrors, FormGroup, ValidatorFn } from '@angular/forms';

export function passwordMatch(fieldName: string, comparingFieldName: string) {
  return (c: AbstractControl): ValidationErrors | null => {
    if (!c.parent || !c) { return null; }
    const pwd = c.parent.get(fieldName);
    const cpwd = c.parent.get(comparingFieldName);
    if (!pwd || !cpwd) { return null; }
    if (pwd.value !== cpwd.value) {
      return { valid: false };
    }
  };
}

export function atLeastOneCheckboxCheckedValidator(minRequired = 1): ValidatorFn {
  return function validate(formGroup: FormGroup) {
    let checked = 0;

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];

      if (control.value) {
        checked++;
      }
    });

    if (checked < minRequired) {
      return {
        valid: false
      };
    }

    return null;
  };
}
