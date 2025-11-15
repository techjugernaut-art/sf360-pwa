import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';


export class AuthInterceptor implements HttpInterceptor {
  constructor(){}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authHeader = req.headers.get('Authorization');
    // if (req.method === 'POST' && req.body !== undefined) {
    //   if (req.body instanceof FormData) {
    //     req =  req.clone({
    //       body: req.body.append('app_id', 'mobile.kudigo.pos.vlisco')
    //     })
    //   } else {

    //     const appId = {}; appId['shop_id'] = (req.body.shop_id !== undefined && req.body.shop_id !== '' &&  req.body.shop_id !== null) ? +req.body.shop_id : '';
    //     req =  req.clone({
    //       body: {...JSON.parse(req.body), ...appId}
    //     })
    //   }
    // }
    if (authHeader !== undefined && authHeader !== null && authHeader !== '' && authHeader === 'Token') {
      const cloneReq = req.clone({
        headers: req.headers.set('Authorization', 'Token ' + localStorage.getItem('token'))
      });
      return next.handle(cloneReq);
    }

    return next.handle(req);
  }
}
