import { ElementRef, HostListener } from '@angular/core';
import { Directive } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[alphaNumericOnly]'
})
export class AlphaNumericOnlyDirective {

   // Allow decimal numbers and negative values
   private regex: RegExp = new RegExp(/^[A-Za-z0-9 ]+$/);
   // Allow key codes for special events. Reflect :
   // Backspace, tab, end, home
   private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

   constructor(private el: ElementRef) {
   }
   @HostListener('keydown', ['$event'])
   onKeyDown(event: KeyboardEvent) {
     // Allow Backspace, tab, end, and home keys
     if (this.specialKeys.indexOf(event.key) !== -1) {
       return;
     }
     const current: string = this.el.nativeElement.value;
     const next: string = current.concat(event.key);
     if (next && !String(next).match(this.regex)) {
       event.preventDefault();
     }
   }

}
