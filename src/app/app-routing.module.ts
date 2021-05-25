import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './components/main-page/main-page.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {CanActivateService} from './services/can-activate/can-activate.service';
import {ShopComponent} from './components/shop/shop.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: 'dashboard',
    component: MainPageComponent,
    canActivate: [CanActivateService]
  },
  {
    path: 'shop',
    component: ShopComponent,
    canActivate: [CanActivateService]
  },
  {path: 'register', component: RegisterComponent},
  {path: 'users/:id', component: UserProfileComponent},
  {path: '**', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
