import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
  }

  register(rDto: RegisterDto): Observable<User> {
    const url = `${environment.backendUrl}/api/v1/users`;
    console.log('post to: ', url);
    return this.http.post<User>(url, rDto);
  }

  authorise(usernameDto: string, passwordDto: string): Observable<TokenDto> {
    const url = `${environment.backendUrl}/api/v1/auth`;
    console.log(usernameDto + ':' + passwordDto);
    return this.http.post<TokenDto>(url, {username: usernameDto, password: passwordDto});
  }

  authoriseEmpty(): Observable<AuthDto> {
    const url = `${environment.backendUrl}/api/v1/auth`;
    console.log('sending empty auth', url);
    return this.http.get<AuthDto>(url);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}


export class RegisterDto {
  username: string;
  password: string;
  email: string;
}

export class User {
  id: number;
  username: string;
  frogs: string;
}

export class AuthDto {
  id: number;
  username: string;
  frogs: string;
  money: number;
}

export class TokenDto {
  access_token: string;
}
