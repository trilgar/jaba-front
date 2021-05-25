import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../services/auth/auth.service';
import {UserService} from '../../services/user/user.service';
import {take} from 'rxjs/operators';
import {Frog, FrogService} from '../../services/frog/frog.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  // todo money request
  money = 1000;
  user: User;
  userJaby: Frog[];
  userId: number;
  warningFlag = false;
  warningMessage: string;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private frogService: FrogService) {
  }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id');
    this.userService.getUser(this.userId).pipe(take(1))
      .subscribe(user => this.user = user);
    this.refreshFrogs();
  }

  refreshFrogs(): void {
    this.frogService.getFrogsByUserId(this.userId).pipe(take(1)).subscribe(frogs => this.userJaby = frogs.map(jaba => {
      jaba.image = this.getFullImageLink(jaba.image);
      return jaba;
    }));
  }

  calculateProgressStyle(percent: number, color: string): string {
    return 'width:' + percent.toString() + '%; background:' + color;
  }

  private getFullImageLink(shortened: string): string {
    return environment.backendUrl + shortened;
  }

}
