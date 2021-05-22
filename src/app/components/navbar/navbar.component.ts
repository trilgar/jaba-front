import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  money = -1;

  constructor(private userService: UserService, private router: Router, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.money = this.getCurrentMoney();
    console.log('money: ', localStorage.getItem('money'));
    this.userService.currentMessage.subscribe(moneyChange => this.money = this.getCurrentMoney());
  }

  getCurrentMoney(): number {
    return parseInt(localStorage.getItem('money'), 10);
  }

  goToFrogs(): void {
    this.router.navigate(['dashboard']);
  }

  logout(): void {
    this.authService.logout();
  }
}
