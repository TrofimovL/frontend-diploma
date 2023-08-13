import {AbstractControl, ValidationErrors} from "@angular/forms";
import {Observable, of} from "rxjs";

export class CustomValidators {

  static nameValidator(control: AbstractControl): ValidationErrors | null {
    const result = /(([А-Я])([а-я]+\s|[а-я]+))+$/.test(control.value);
    return result ? null : {name: {value: control.value}};
  }

  static emailValidator(control: AbstractControl): ValidationErrors | null {
    const result = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(control.value);
    return result ? null : {email: {value: control.value}};
  }

  static passwordValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const result = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(control.value);
    return of(result ? null : {password: {value: control.value}});
  }

  static phoneValidator(control: AbstractControl): ValidationErrors | null {
    const result = /^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}/.test(control.value);
    return result ? null : {phone: {value: control.value}};
  }

}
