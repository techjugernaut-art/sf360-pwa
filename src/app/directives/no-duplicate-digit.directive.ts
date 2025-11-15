import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[noDuplicate]'
})
export class NoDuplicateDirective {
  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[\\d*(\\d)\\1{2}\\d*]/g, '');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}