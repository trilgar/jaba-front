import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment"; environment

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  register(rDto: RegisterDto): Observable<User>{
    const url = `${environment.backendUrl}/api/v1/users`;
    console.log('post to: ', url);
    return this.http.post<User>(url, rDto);
  }
}


export class RegisterDto {
  username: string;
  password: string;
  email: string;
}
export class User{
  id: number;
  username: string;
  frogs: string;
}
