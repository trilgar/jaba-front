import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  register(rDto: RegisterDto): Observable<User> {
    const url = `${environment.backendUrl}/api/v1/users`;
    console.log('post to: ', url);
    return this.http.post<User>(url, rDto);
  }

  authorise(username: string, password: string): Observable<AuthDto> {
    const url = `${environment.backendUrl}/api/v1/auth`;
    console.log(username + ':' + password);
    const head = new HttpHeaders({
      Authorization: 'Basic ' + btoa(username + ':' + password)
    });
    return this.http.get<AuthDto>(url, {headers: head});
  }

  authoriseEmpty(): Observable<AuthDto> {
    const url = `${environment.backendUrl}/api/v1/auth`;
    return this.http.get<AuthDto>(url);
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
