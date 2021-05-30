import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {Router} from '@angular/router';
import {AuthService, User} from '../../services/auth/auth.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  money = -1;
  searchTerm$ = new Subject<string>();
  users: User[] = [];
  @ViewChild('term') term;
  dropDown = true;

  constructor(private userService: UserService, private router: Router, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.money = this.getCurrentMoney();
    console.log('money: ', localStorage.getItem('money'));
    this.userService.currentMessage.subscribe(moneyChange => this.money = this.getCurrentMoney());

    this.userService.search(this.searchTerm$)
      .subscribe(results => {
        this.users = results;
      });
  }

  getCurrentMoney(): number {
    return parseInt(localStorage.getItem('money'), 10);
  }

  goToFrogs(): void {
    this.router.navigate(['dashboard']);
  }

  logout(): void {
    this.userService.changeMoney(-1);
    this.authService.logout();
  }


  userProfile(id: number): void {
    console.log('redirecting', `users/${id}`);
    this.router.navigate([`users/${id}`]);
  }

  getDropdownFalse(): void {
    setTimeout(() => this.dropDown = false, 150);
  }

  toMyProfile(): void {
    const id = localStorage.getItem('userId');
    console.log('redirecting', `users/${id}`);
    this.router.navigate([`users/${id}`]);
  }

  userIdExists(): boolean {
    return localStorage.getItem('userId') !== null;
  }
}
