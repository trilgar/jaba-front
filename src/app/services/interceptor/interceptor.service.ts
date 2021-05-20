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
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    const isLoggedIn = username != null && password != null;
    const isApiUrl = req.url.startsWith(environment.backendUrl);
    if (isLoggedIn && isApiUrl) {
      req = req.clone({
        setHeaders: {Authorization: 'Basic ' + btoa(username + ':' + password)}
      });
    }
    console.log('intercepted:', req);
    return next.handle(req);
  }


}
