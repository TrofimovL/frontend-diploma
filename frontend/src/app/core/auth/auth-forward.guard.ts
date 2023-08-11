import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";

export const authForwardGuard: CanActivateFn = () => {

  const authService = inject(AuthService);

  if(authService.getIsLoggedIn()){
    console.log('if');

    history.back();
    return false;
  }

  return true;
};
