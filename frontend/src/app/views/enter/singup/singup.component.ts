import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/services/validators";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss']
})
export class SignupComponent {

  agree = false;
  passwordHidden = true;

  signupForm = this.fb.group({
    name: ['', {
      updateOn: 'blur',
      validators: [Validators.required, CustomValidators.nameValidator]
    }],
    email: ['', {
      updateOn: 'blur',
      validators: [Validators.required, CustomValidators.emailValidator]
    }],
    password: ['', {
      updateOn: 'blur',
      validators: [Validators.required],
      asyncValidators: [CustomValidators.passwordValidator]
    }],
  });


  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) {
  }


  signup() {

    if (this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email && this.signupForm.value.password && this.agree) {

      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (response: LoginResponseType | DefaultResponseType) => {
            let error: string | undefined = (response as DefaultResponseType).message;

            // signupResponse = loginResponse
            const signupResponse: LoginResponseType = (response as LoginResponseType);

            if (!signupResponse.refreshToken || !signupResponse.accessToken || !signupResponse.userId) {
              error = 'Ошибка регистрации';
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(signupResponse.accessToken, signupResponse.refreshToken);
            this.authService.userId = signupResponse.userId;
            this.setUserName();

            this._snackBar.open('Вы успешно зарегистрировались');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка регистрации');
            }
          }
        });


    }

  }

  agreeToggle(): void {
    this.agree = !this.agree;
  }

  setUserName(){
    let userName = this.signupForm.value.name;
    userName = userName?.split(' ')[0];

    if(userName){
      this.authService.setUserName(userName);
    }
  }

  passwordHiddenToggle(){
    this.passwordHidden = !this.passwordHidden;
  }
}
