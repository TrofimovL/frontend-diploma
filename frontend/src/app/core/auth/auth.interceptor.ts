import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {catchError, finalize, Observable, switchMap, throwError} from 'rxjs';
import {LoaderService} from "../../shared/services/loader.service";
import {AuthService} from "./auth.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService,
              private authService: AuthService,
              private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loaderService.show();

    const tokens = this.authService.getTokens();

    if (tokens && tokens.accessToken) {
      const authReq = request.clone({
        headers: request.headers.set('x-auth', tokens.accessToken)
      });

      return next.handle(authReq)
        .pipe(
          catchError((error) => {
            if (error.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
              this.handle401Error(authReq, next);
            }

            return throwError(() => error);
          }),
          finalize(() => {
            this.loaderService.hide();
          })
        );
    }

    return next.handle(request)
      .pipe(finalize(() => this.loaderService.hide()));
  }

  handle401Error(request: HttpRequest<unknown>, next: HttpHandler) {
    return this.authService.refresh()
      .pipe(
        switchMap((result: DefaultResponseType | LoginResponseType) => {

          let error = '';

          if ((result as DefaultResponseType).error !== undefined) {
            error = (result as DefaultResponseType).message;
          }

          const refreshResult = result as LoginResponseType;

          if (!refreshResult.refreshToken || !refreshResult.accessToken || !refreshResult.userId) {
            error = 'Ошибка авторизации';
          }

          if (error) {
            return throwError(() => new Error(error));
          }

          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);
          this.authService.userId = refreshResult.userId;

          const authReq = request.clone({
            headers: request.headers.set('x-access-token', refreshResult.refreshToken)
          });

          return next.handle(authReq);
        }),

        catchError((error)=>{
          this.authService.removeTokens();
          this.authService.userId = null;
          this.router.navigate(['/']);
          return throwError(()=> error);
        })
      );
  }
}
