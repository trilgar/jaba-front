import {Component, OnInit} from '@angular/core';
import {Frog, FrogService} from '../../services/frog/frog.service';
import {Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../services/auth/auth.service';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  jaby: Frog[] = [];


  constructor(private router: Router, private frogService: FrogService, private authService: AuthService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.refreshFrogs();
  }

  private getFullImageLink(shortened: string): string {
    return environment.backendUrl + shortened;
  }

  refreshFrogs(): void {
    this.frogService.getAllFrogs().pipe(take(1)).subscribe(data => this.jaby = data.map(jaba => {
      jaba.image = this.getFullImageLink(jaba.image);
      return jaba;
    }));
  }

  calculateProgressStyle(percent: number, color: string): string {
    return 'width:' + percent.toString() + '%; background:' + color;
  }

  goToShop(): void {
    this.router.navigate(['shop']);
  }

  feedFrog(id: number): void {
    if (this.findFrogById(id).food === 100) {
      return;
    }
    this.frogService.feedFrog(id).pipe(take(1)).subscribe(frog => {
      this.findFrogById(id).food = frog.food;
      this.findFrogById(id).cleanliness = frog.cleanliness;
    });
  }

  collectMoney(id: number): void {
    if (this.findFrogById(id).money === 0) {
      return;
    }
    this.frogService.collectMoney(id).pipe(take(1)).subscribe(frog => {
      this.authService.authoriseEmpty().pipe(take(1)).subscribe(user => this.userService.changeMoney(user.money));
      this.findFrogById(id).money = 0;
    });
  }

  washFrog(id: number): void {
    if (this.findFrogById(id).cleanliness === 100) {
      return;
    }
    this.frogService.washFrog(id).pipe(take(1)).subscribe(frog => {
      this.findFrogById(id).food = frog.food;
      this.findFrogById(id).cleanliness = frog.cleanliness;
    });
  }

  findFrogById(id: number): Frog {
    return this.jaby.find(frog => frog.id === id);
  }
}
