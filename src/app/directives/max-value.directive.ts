import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[maxValue]'
})
export class MaxValueDirective {
@Input() maxValue = 0;
 // Backspace, tab, end, home
 private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];
  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log(this.maxValue);
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && +next > this.maxValue) {
      event.preventDefault();
    }
  }

}
