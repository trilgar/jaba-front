import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService, WsMessageType} from '../../services/auth/auth.service';
import {take} from 'rxjs/operators';
import {UserService} from '../../services/user/user.service';
import {FormBuilder, FormControl, ValidationErrors, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  registerForm = this.fb.group({
      username: new FormControl('', [
        Validators.maxLength(10),
        Validators.minLength(4),
        Validators.required
      ]),
      password: new FormControl('', [
        this.passwordValidator
      ])
    }
  );
  warningMessage: string;
  warningFlag = false;

  constructor(private router: Router, private authService: AuthService, private userService: UserService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const username = this.registerForm.get('username').value;
    const password = this.registerForm.get('password').value;
    this.authService.authorise(username, password)
      .pipe(take(1)).subscribe(msg => {
      const data = JSON.parse(msg.data);
      console.log('received after auth data: ', data);
      console.log('data type::', data.type);
      if (data.type === WsMessageType.ERROR) {
        console.log('error during auth: ', data.message);
        this.warningMessage = data.message;
        this.warningFlag = true;
      } else {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);

        console.log(localStorage.getItem('username'), localStorage.getItem('password'));
        this.router.navigate(['dashboard']);
      }
    });
  }

  private passwordValidator(control: FormControl): ValidationErrors {
    const value = control.value;
    /** Проверка на содержание цифр */
    const hasNumber = /[0-9]/.test(value);
    /** Проверка на содержание заглавных букв */
    const hasCapitalLetter = /[A-Z]/.test(value);
    /** Проверка на содержание прописных букв */
    const hasLowercaseLetter = /[a-z]/.test(value);
    /** Проверка на минимальную длину пароля */
    const isLengthValid = value ? value.length >= 8 : false;

    /** Общая проверка */
    const passwordValid = hasNumber && (hasCapitalLetter || hasLowercaseLetter) && isLengthValid;

    if (!passwordValid) {
      return {invalidPassword: 'Пароль не прошел валидацию'};
    }
    return null;
  }

  toRegister(): void {
    this.router.navigate(['register']);
  }
}
