import {Injectable} from '@angular/core';
import {Observable, Subject, throwError} from "rxjs";
import {LoginResponseType} from "../../../types/login-response.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {UserInfoType} from "../../../types/user-info.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  private userIdKey = 'userId';

  private isLogged = false;
  public isLogged$: Subject<boolean> = new Subject<boolean>();
  userName = '';
  userName$: Subject<string> = new Subject<string>();


  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  public login(email: string, password: string, rememberMe: boolean): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'login', {
      email: email,
      password: password,
      rememberMe: rememberMe
    });
  }

  public logout(): Observable<DefaultResponseType> {
    const refreshToken: string | null = this.getTokens().refreshToken;


    return this.http.post<DefaultResponseType>(environment.api + 'logout', {
      refreshToken: refreshToken
    });

  }

  public signup(name: string, email: string, password: string): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'signup', {
      name: name,
      email: email,
      password: password
    });
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    };
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userIdKey);
    this.isLogged = false;
    this.isLogged$.next(false);
    this.userName$.next('');
  }

  set userId(userId: string | null) {
    if (userId) {
      localStorage.setItem(this.userIdKey, userId);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  public getIsLoggedIn() {
    return this.isLogged;
  }

  setUserName(userName: string) {
    this.userName = userName;
    this.userName$.next(userName);
  }

  refresh(): Observable<LoginResponseType | DefaultResponseType> {
    const tokens = this.getTokens();

    if (tokens && tokens.refreshToken) {
      return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      });
    }
    throw throwError(() => 'Can not use token');

  }

  getUserInfo():Observable<UserInfoType | DefaultResponseType>{
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'users');
  }


}
