import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {User} from '../auth/auth.service';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

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

  getUsersByName(name: string): Observable<User[]> {
    // todo implement real search by name
    const user1: User = {id: 1, username: 'username1', frogs: '/api/v1/users/1/frogs'};
    const user2: User = {id: 2, username: 'username2', frogs: '/api/v1/users/1/frogs'};
    const user3: User = {id: 3, username: 'username3', frogs: '/api/v1/users/1/frogs'};
    const user4: User = {id: 4, username: 'username4', frogs: '/api/v1/users/1/frogs'};
    return of([user1, user2, user3, user4]);
  }

  search(terms: Subject<string>): Observable<User[]> {
    return terms.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      switchMap(term => this.getUsersByName(term)));
  }
}
