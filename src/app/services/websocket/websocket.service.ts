import {Injectable} from '@angular/core';
import {interval, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  pingInterval = 10000;
  source = interval(this.pingInterval);
  firstConnection = true;

  public subject = new Subject<any>();
  private messageSource = new Subject();
  currentMessage = this.messageSource.asObservable();

  private ws: WebSocket;
  openedStatus: boolean;
  private skipOne = false;


  constructor() {
    this.initConnection();
    localStorage.setItem('refresh', 'used');
    this.source.subscribe(() => this.sendMessage('PING'));
  }

  initConnection(): void {
    this.connect();
    this.ws.onmessage = (data: MessageEvent) => {
      if (!this.skipOne) {
        this.messageSource.next(data);
        this.openedStatus = true;
      } else {
        this.skipOne = false;
      }
    };

    this.ws.onclose = () => {
      console.log('ONCLOSE');
      this.connect();
      this.initConnection();
    };
  }


  public connect(): void {
    this.ws = new WebSocket(environment.websocketUrl);
    console.log('localstorage check:', localStorage.getItem('username'), localStorage.getItem('password'));
    if (localStorage.getItem('refresh') === 'used' && localStorage.getItem('username') !== null
      && localStorage.getItem('password') != null) {
      this.skipOne = true;
      this.sendMessage(JSON.stringify({
        action: 'authorization',
        username: localStorage.getItem('username'),
        password: localStorage.getItem('password')
      }));
    }
  }


  sendMessage(msg: any): void {
    if (this.ws.readyState !== 1) {
      setTimeout(() => this.ws.send(msg), 400);
    } else {
      console.log('sending message: ', msg);
      this.ws.send(msg);
    }

  }

  close(): void {
    this.ws.close();
  }

}
