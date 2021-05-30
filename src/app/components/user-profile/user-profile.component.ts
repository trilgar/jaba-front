import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserDto} from '../../services/auth/auth.service';
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
  user: UserDto;
  userJaby: Frog[] = [];
  userId: number;
  warningFlag = false;
  warningMessage: string;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private frogService: FrogService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +this.route.snapshot.paramMap.get('id');
      this.userService.getUser(this.userId).pipe(take(1))
        .subscribe(responce => {
          this.user = JSON.parse(responce.data).payload;
          this.refreshFrogs();
        });
    });

  }

  refreshFrogs(): void {
    this.frogService.getFrogsByUserId(this.userId).pipe(take(1)).subscribe(data => {
      const frogsDto: Frog[] = JSON.parse(data.data).payload;
      this.userJaby = frogsDto.map(jaba => {
        jaba.image = this.getFullImageLink(jaba.image);
        return jaba;
      });
    });
  }

  calculateProgressStyle(percent: number, color: string): string {
    return 'width:' + percent.toString() + '%; background:' + color;
  }

  getFullImageLink(shortened: string): string {
    return environment.backendUrl + shortened;
  }

}
