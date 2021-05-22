import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {User} from '../auth/auth.service';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _userId: number;
  public editDataDetails: any = [];
  public subject = new Subject<any>();
  private messageSource = new BehaviorSubject(this.editDataDetails);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient) {
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

  getUser(id: number): Observable<User> {
    const url = `${environment.backendUrl}/api/v1/users/${id}`;
    return this.http.get<User>(url);
  }
}
