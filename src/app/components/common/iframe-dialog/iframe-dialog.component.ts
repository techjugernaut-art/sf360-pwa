import { Component, OnInit, Inject, ViewChild, ComponentFactoryResolver, ApplicationRef, Injector, OnDestroy, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkPortal, DomPortalHost, DomPortalOutlet } from '@angular/cdk/portal';

@Component({
  selector: 'app-iframe-dialog',
  templateUrl: './iframe-dialog.component.html',
  styleUrls: ['./iframe-dialog.component.scss']
})
export class IframeDialogComponent implements OnInit, OnDestroy {
  @ViewChild(CdkPortal, {static: true}) portal: CdkPortal;
  @Input() src = '';
  private externalWindow = null;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) { }

  ngOnInit() {
    this.externalWindow = window.open(this.src, '', 'width=800,height=600,left=200,top=200');
    const host = new DomPortalOutlet(
      this.externalWindow.document.body,
      this.componentFactoryResolver,
      this.applicationRef,
      this.injector
      );
    host.attach(this.portal);
  }
  ngOnDestroy() {
    this.externalWindow.close();
  }
}
