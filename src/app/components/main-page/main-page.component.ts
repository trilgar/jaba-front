import {Component, OnInit} from '@angular/core';
import {Frog, FrogService} from '../../services/frog/frog.service';
import {Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {AuthService, UserDto, WsMessageType} from '../../services/auth/auth.service';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  warningMessage: string;
  warningFlag = false;
  jaby: Frog[] = [];


  constructor(private router: Router, private frogService: FrogService,
              private authService: AuthService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.authService.authoriseEmpty().pipe(take(1)).subscribe(user => {
      console.log('user', user);
      const payload: UserDto = JSON.parse(user.data).payload;
      console.log('payload', payload);
      this.userService.changeMoney(payload.money);
      localStorage.setItem('userId', payload.id.toString());
      this.refreshFrogs();
    });

  }

  private changeMoney(user: any): void {
    const payload: UserDto = JSON.parse(user.data).payload;
    this.userService.changeMoney(payload.money);
  }

  private getFullImageLink(shortened: string): string {
    return environment.backendUrl + shortened;
  }

  refreshFrogs(): void {
    this.frogService.getAllFrogs().pipe(take(1)).subscribe(data => {
      const frogsDto: Frog[] = JSON.parse(data.data).payload;
      this.jaby = frogsDto.map(jaba => {
        jaba.image = this.getFullImageLink(jaba.image);
        return jaba;
      });
    });
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
    this.frogService.feedFrog(id).pipe(take(1)).subscribe(responce => {
      const frog: Frog = JSON.parse(responce.data).payload;
      this.findFrogById(id).food = frog.food;
      this.findFrogById(id).cleanliness = frog.cleanliness;
      this.findFrogById(id).money = frog.money;
    });
  }

  collectMoney(id: number): void {
    if (this.findFrogById(id).money === 0) {
      return;
    }
    this.frogService.collectMoney(id).pipe(take(1)).subscribe(responce => {
      const frog: Frog = JSON.parse(responce.data).payload;
      this.authService.authoriseEmpty().pipe(take(1)).subscribe(user => this.changeMoney(user));
      this.findFrogById(id).food = frog.food;
      this.findFrogById(id).cleanliness = frog.cleanliness;
      this.findFrogById(id).money = frog.money;
    });
  }

  washFrog(id: number): void {
    if (this.findFrogById(id).cleanliness === 100) {
      return;
    }
    this.frogService.washFrog(id).pipe(take(1)).subscribe(responce => {
      const frog: Frog = JSON.parse(responce.data).payload;
      this.findFrogById(id).food = frog.food;
      this.findFrogById(id).cleanliness = frog.cleanliness;
      this.findFrogById(id).money = frog.money;
    });
  }

  findFrogById(id: number): Frog {
    return this.jaby.find(frog => frog.id === id);
  }

  buyNewFrog(): void {
    this.frogService.buyFrog().pipe(take(1)).subscribe(responce => {
      const data = JSON.parse(responce.data);
      if (data.type === WsMessageType.ERROR) {
        this.warningMessage = data.message;
        this.warningFlag = true;
      }
      const newFrog = data.payload;
      this.jaby.push(newFrog);
      newFrog.image = this.getFullImageLink(newFrog.image);
      console.log('new frog bought:', newFrog);
      this.authService.authoriseEmpty().pipe(take(1)).subscribe(user => this.changeMoney(user));
      const timeStamp = (new Date()).getTime();
    });
  }

  isFrogBuyAvailable(): boolean {
    return this.userService.getCurrentMoney() >= 500;
  }
}
