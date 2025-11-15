import { FdkApiCallsService } from './services/network-calls/fdk-api-calls.service';
import { Component, OnInit } from '@angular/core';
import { MessagingService } from './services/messaging.service';
import {TranslateService} from '@ngx-translate/core';
import { OnlineStatusService } from './services/online-status.service';
import { OrdersApiCallsService } from './services/network-calls/orders-api-calls.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'KudiGo Storefront 360';
  message;
  refreshInterval;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private translate: TranslateService,
    private ordersApiCallsService: OrdersApiCallsService,
    private onlineStatus: OnlineStatusService,
    private swUpdate: SwUpdate,
    private messagingService: MessagingService ) {
      translate.addLangs(['en', 'fr']);
      const browserLang = translate.getBrowserLang().match(/en|fr/) ? translate.getBrowserLang() : 'en';
      translate.setDefaultLang(browserLang);
      translate.use(browserLang);
  }
  ngOnInit() {

    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if(confirm("New version available. Load New Version?")) {
          window.location.reload();
        }
      });

    }

    if (this.onlineStatus.isOnline) {
      this.ordersApiCallsService.syncSalesData((error, result) => {

      });
    }
    this.onlineStatus.connectionStatus.subscribe((isOnline: boolean) => {
      this.ordersApiCallsService.syncSalesData((error, result) => {

      });
    });

    this.refreshInterval = setInterval(() => {
      if (this.onlineStatus.isOnline) {
        this.ordersApiCallsService.syncSalesData((error, result) => {

        });
      }
    }, 3600000);
    this.getRouteTitle();
  }

  getChild(route: ActivatedRoute) {
    if (route.firstChild) {
      return this.getChild(route.firstChild);
    } else {
      return route;
    }
  }
  getRouteTitle(){
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe(() => {
      const childRoute = this.getChild(this.route);
      childRoute.data.subscribe((data) => {
        const title = data.title
        if(title){
          this.titleService.setTitle(title + ' | ' + this.title );
        }
        else if(title === undefined || title === ''){
          this.titleService.setTitle(this.title );
        }
      });
    });
  }

}
