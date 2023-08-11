import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CustomValidators} from "../../../shared/services/validators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm = this.fb.group({
    email: ['', {updateOn: 'blur', validators: [Validators.required, CustomValidators.emailValidator]}],
    password: ['', {updateOn: 'blur', validators: [Validators.required]}],
    rememberMe: [false]
  });

  passwordHidden = true;


  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) {
  }

  login() {

    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {

      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (response: LoginResponseType | DefaultResponseType) => {

            let error: string | undefined = (response as DefaultResponseType).message;

            const loginResponse: LoginResponseType = (response as LoginResponseType);

            if (!loginResponse.refreshToken || !loginResponse.accessToken || !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;

            this._snackBar.open('Вы успешно авторизовались');
            this.router.navigate(['/']);


          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка авторизации');
            }
          }
        });


    }


  }

  passwordHiddenToggle(){
    this.passwordHidden = !this.passwordHidden;
  }

  // getUserInfo(){
  //   this.authService.getUserInfo()
  //     .subscribe({
  //       next: (resp: UserInfoType | DefaultResponseType) => {
  //
  //         let error: string | undefined = (resp as DefaultResponseType).message;
  //
  //         if (error) {
  //           this._snackBar.open(error);
  //           throw new Error(error);
  //         }
  //
  //         this.userName = (resp as UserInfoType).name;
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         this._snackBar.open(error.message);
  //
  //       }
  //     })
  // }


}
