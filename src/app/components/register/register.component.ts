import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ValidationErrors, Validators} from '@angular/forms';
import {AuthService, RegisterDto} from '../../services/auth/auth.service';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm = this.fb.group({
      username: new FormControl('', [
        Validators.maxLength(10),
        Validators.minLength(4),
        Validators.required
      ]),
      password: new FormControl('', [
        this.passwordValidator
      ]),
      email: new FormControl('', [Validators.email, Validators.required])
    }
  );
  errorMessage: string;
  errorFlag = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
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
    const isLengthValid = value ? value.length > 8 : false;

    /** Общая проверка */
    const passwordValid = hasNumber && (hasCapitalLetter || hasLowercaseLetter) && isLengthValid;

    if (!passwordValid) {
      return {invalidPassword: 'Пароль не прошел валидацию'};
    }
    return null;
  }

  onSubmit(): void {
    const dto = new RegisterDto();
    dto.email = this.registerForm.get('email').value;
    dto.username = this.registerForm.get('username').value;
    dto.password = this.registerForm.get('password').value;
    this.authService.register(dto).pipe(take(1))
      .subscribe(data => {
        console.log('registration of user', data, ' successful');
        localStorage.setItem('email', dto.email);
        localStorage.setItem('password', dto.password);
        this.router.navigate(['/login']);
      }, error => {
        console.log('error during registration occurred');
        console.log(error);
        let unexpected = true;
        if (error.error.message.password != null) {
          this.errorMessage = error.error.message.password;
          this.errorFlag = true;
          unexpected = false;
        }
        if (error.error.message.email != null) {
          this.errorMessage += error.error.message.email;
          this.errorFlag = true;
          unexpected = false;
        }
        if (error.status === 500) {
          this.errorMessage = 'unexpected error. please,contact administrator.';
          this.errorFlag = true;
          return;
        }
        if (unexpected === true) {
          this.errorMessage = error.error.message;
          this.errorFlag = true;
        }

      });
  }
}
