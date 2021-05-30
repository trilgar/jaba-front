import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {User} from '../auth/auth.service';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {WebsocketService} from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _userId: number;
  public editDataDetails: any = [];
  public subject = new Subject<any>();
  private messageSource = new BehaviorSubject(this.editDataDetails);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private wsService: WebsocketService) {
  }

  getCurrentMoney(): number {
    return parseInt(localStorage.getItem('money'), 10);
  }

  changeMoney(money: number): void {
    localStorage.setItem('money', money.toString());
    this.messageSource.next(money);
  }


  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }

  getUser(id: number): Observable<any> {
    this.wsService.sendMessage(JSON.stringify({
        action: 'get',
        resource: 'user',
        user_id: id
      }
    ));
    return this.wsService.currentMessage;
  }

  getUsersByName(name: string): Observable<User[]> {
    // todo implement real search by name
    const url = `${environment.backendUrl}/api/v1/users?username=${name}`;
    return this.http.get<User[]>(url);
  }

  search(terms: Subject<string>): Observable<User[]> {
    return terms.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      switchMap(term => this.getUsersByName(term)));
  }
}
