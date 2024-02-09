import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {RequestsService} from "../../services/requests.service";
import {UserInfoType} from "../../../../types/user-info.type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged = false;
  userName = '';
  isBlogPage = false;

  constructor(private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar,
              private requestsService: RequestsService) {
    this.isLogged = this.authService.getIsLoggedIn();
    // this.userName = this.authService.getUserName();
  }

  ngOnInit() {

    this.isLogged = this.authService.getIsLoggedIn();

    this.authService.isLogged$
      .subscribe((isLogged: boolean) => {
        this.isLogged = isLogged;

        if (this.isLogged) {
          this.getUserInfo();
        }
      });

    if (this.isLogged) {
      this.getUserInfo();
    }

    this.requestsService.isBlogPage$
      .subscribe((key) => {
        this.isBlogPage = key;
      });


  }

  getUserInfo() {
    this.authService.getUserInfo()
      .subscribe({
        next: (resp: UserInfoType | DefaultResponseType) => {

          const error: string | undefined = (resp as DefaultResponseType).message;

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          this.userName = (resp as UserInfoType).name;
        },
        error: (error: HttpErrorResponse) => {
          this._snackBar.open(error.message);

        }
      });
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.authService.removeTokens();
          this._snackBar.open('Вы вышли из системы');
        },
        error: () => {
          this.authService.removeTokens();
          this._snackBar.open('Вы вышли из системы');
        }
      });
  }

  // setUserName(userName: string | null){
  //   if(userName){
  //     this.userName = userName;
  //   } else{
  //     this.userName = null;
  //   }
  // }

}
