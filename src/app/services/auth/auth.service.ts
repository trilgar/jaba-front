import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

environment;

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
    console.log(btoa(username + ':' + password));
    const head = new HttpHeaders({
      Authorization: 'Basic ' + btoa(username + ':' + password)
    });
    console.log(head);
    return this.http.get<AuthDto>(url, {headers: head});
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
  money: string;
}
