import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import * as Url from "url";

@Injectable({
  providedIn: 'root'
})
export class CanActivateService implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> |
    Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem('username') === null && localStorage.getItem('email') === null) {
      return this.router.createUrlTree(['login']);
    }
    if (localStorage.getItem('password') === null) {
      return this.router.createUrlTree(['login']);
    }
    return true;
  }


}
