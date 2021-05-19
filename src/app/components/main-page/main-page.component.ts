import {Component, OnInit} from '@angular/core';
import {Frog, FrogService} from "../../services/frog/frog.service";
import {Router} from "@angular/router";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  jaby: Frog[] = [];


  constructor(private router: Router, private frogService: FrogService) {
  }

  ngOnInit(): void {
    this.frogService.getAllFrogs().pipe(take(1)).subscribe(data => this.jaby = data);
  }


}
