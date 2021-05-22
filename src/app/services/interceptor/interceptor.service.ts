import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const isLoggedIn = token != null;
    const isApiUrl = req.url.startsWith(environment.backendUrl);
    if (isLoggedIn && isApiUrl) {
      req = req.clone({
        setHeaders: {Authorization: 'Bearer ' + token}
      });
    }
    return next.handle(req);
  }


}
