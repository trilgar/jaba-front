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
    this.connect();
    this.ws.onmessage = (data: MessageEvent) => {
      console.log('skip one: ', this.skipOne);
      if (!this.skipOne) {
        this.messageSource.next(data);
        this.openedStatus = true;
      } else {
        this.skipOne = false;
      }
    };

    this.ws.onclose = () => {
      this.openedStatus = false;
    };
    localStorage.setItem('refresh', 'used');
    this.source.subscribe(() => this.sendMessage('PING'));
    /*this.ws.onclose = (e) => {
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
      setTimeout(() => {
        this.connect();
        this.ws.onopen = () => {
          this.sendMessage(JSON.stringify({
            action: 'authorization',
            username: localStorage.getItem('username'),
            password: localStorage.getItem('password')
          }));
        };
      }, 1000);
    };*/
  }


  public connect(): void {
    this.ws = new WebSocket(environment.websocketUrl);

    if (localStorage.getItem('refresh') === 'used') {
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
