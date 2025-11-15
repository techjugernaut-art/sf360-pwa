import { Directive, Renderer2, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[setFloatingClassOnPhoneInput]'
})
export class SetFloatingClassOnPhoneInputDirective {

  constructor(private renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'ngx-floating');
  }

}
