import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from "./components/main-page/main-page.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {CanActivateService} from "./services/can-activate/can-activate.service";

const routes: Routes = [
  {
    path: 'dashboard',
    component: MainPageComponent,
    canActivate: [CanActivateService]
  },
  {path: 'register', component: RegisterComponent},
  {path: '**', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
