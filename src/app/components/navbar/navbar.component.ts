import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  money = -1;

  constructor(private userservice: UserService) {
  }

  ngOnInit(): void {
    this.userservice.currentMessage.subscribe(currentMoney => this.money = currentMoney);
  }

}
