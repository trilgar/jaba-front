import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {UserService} from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class FrogService {

  constructor(private http: HttpClient, private userService: UserService) {
  }

  getAllFrogs(): Observable<Frog[]> {
    const url = `${environment.backendUrl}/api/v1/users/${parseInt(localStorage.getItem('userId'), 10)}/frogs`;
    console.log('sending get to :', url);
    return this.http.get<Frog[]>(url);
  }

  getFrogsByUserId(userId: number): Observable<Frog[]> {
    const url = `${environment.backendUrl}/api/v1/users/${userId}/frogs`;
    console.log('sending get to :', url);
    return this.http.get<Frog[]>(url);
  }

  feedFrog(id: number): Observable<Frog> {
    const url = `${environment.backendUrl}/api/v1/frogs/${id}`;
    return this.http.put<Frog>(url, {action: 'feed'});
  }

  washFrog(id: number): Observable<Frog> {
    const url = `${environment.backendUrl}/api/v1/frogs/${id}`;
    return this.http.put<Frog>(url, {action: 'wash'});
  }

  collectMoney(id: number): Observable<Frog> {
    const url = `${environment.backendUrl}/api/v1/frogs/${id}`;
    return this.http.put<Frog>(url, {action: 'collect'});
  }

  frogById(id: number): Observable<Frog> {
    const url = `${environment.backendUrl}/api/v1/frogs/${id}`;
    return this.http.get<Frog>(url);
  }

  buyFrog(): Observable<Frog> {
    const url = `${environment.backendUrl}/api/v1/users/${parseInt(localStorage.getItem('userId'), 10)}/frogs`;
    console.log('sending post to :', url);
    return this.http.post<Frog>(url, null);
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
}
