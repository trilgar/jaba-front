import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {UserService} from '../user/user.service';
import {WebsocketService} from '../websocket/websocket.service';
import {WsMessageType} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FrogService {

  constructor(private http: HttpClient, private userService: UserService, private wsService: WebsocketService) {
  }

  getAllFrogs(): Observable<any> {
    this.wsService.sendMessage(JSON.stringify({
      action: 'get',
      resource: 'my_frogs'
    }));
    return this.wsService.currentMessage;
  }

  getFrogsByUserId(userId: number): Observable<any> {
    this.wsService.sendMessage(JSON.stringify({
      action: 'get',
      resource: 'frogs',
      user_id: userId
    }));
    return this.wsService.currentMessage;
  }

  feedFrog(idDto: number): Observable<any> {
    this.wsService.sendMessage(JSON.stringify({
      action: 'interact',
      subaction: 'feed',
      frog_id: idDto
    }));
    return this.wsService.currentMessage;
  }

  washFrog(idDto: number): Observable<any> {
    this.wsService.sendMessage(JSON.stringify({
      action: 'interact',
      subaction: 'wash',
      frog_id: idDto
    }));
    return this.wsService.currentMessage;
  }

  collectMoney(idDto: number): Observable<any> {
    this.wsService.sendMessage(JSON.stringify({
      action: 'interact',
      subaction: 'collect',
      frog_id: idDto
    }));
    return this.wsService.currentMessage;
  }

  frogById(id: number): Observable<Frog> {
    const url = `${environment.backendUrl}/api/v1/frogs/${id}`;
    return this.http.get<Frog>(url);
  }

  buyFrog(): Observable<any> {
    this.wsService.sendMessage(JSON.stringify({
      action: 'buy'
    }));
    return this.wsService.currentMessage;
  }
}

export class Frog {
  id: number;
  url: string;
  name: string;
  food: number;
  money: number;
  cleanliness: number;
  image: string;
  level: number;
}


export class WSHttpPackage {
  authorization: string;  // это токен
  action: string;
  payload: any; // body запроса
}

export class FrogsResponce {
  type: WsMessageType;
  content_type: string;
  payload: Frog[];
}
