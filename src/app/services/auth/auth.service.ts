import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {WebsocketService} from '../websocket/websocket.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router, private wsService: WebsocketService) {
  }

  register(rDto: RegisterDto): Observable<User> {
    const url = `${environment.backendUrl}/api/v1/users`;
    console.log('post to: ', url);
    return this.http.post<User>(url, rDto);
  }

  authorise(usernameDto: string, passwordDto: string): Observable<any> {
    this.wsService.sendMessage(JSON.stringify({action: 'authorization', username: usernameDto, password: passwordDto}));
    return this.wsService.currentMessage;
  }

  authoriseEmpty(): Observable<any> {
    this.wsService.sendMessage(JSON.stringify({
      action: 'get',
      resource: 'me'
    }));
    return this.wsService.currentMessage;
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

export enum WsMessageType {
  ERROR = 'error',
  INFO = 'info',
  CONTENT = 'content'
}

export class UserDto {
  id: number;
  username: string;
  money: number;
  total_money_collected: number;
  total_food_spent: number;
  total_water_spent: number;
}
