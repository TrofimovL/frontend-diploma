import {CustomValidators} from "./validators";
import {FormControl} from "@angular/forms";

describe('custom validators', () => {

  it('should validate names', () => {
    const names = [
      {name: 'abc', valid: false},
      {name: 'Abc', valid: false},
      {name: 'абв', valid: false},
      {name: 'Абв', valid: true},
      {name: 'Абв7', valid: false},
      {name: 'Абв Абв', valid: true},
      {name: 'БББ', valid: false},
      {name: 'бББ', valid: false},
    ];

    names.forEach(item => {
      expect(CustomValidators.nameValidator(new FormControl(item.name))).toEqual(item.valid ? null : {'name': {'value': item.name}});
    });
  });

  it('should validate email', () => {
    const emails = [
      {name: 'abc', valid: false},
      {name: 'abc.com', valid: false},
      {name: '777@777.com', valid: true},
      {name: '@.com', valid: false},
      {name: 'a@.com', valid: false},
      {name: '@test.com', valid: false},
      {name: '@test.c', valid: false},
      {name: '@test.longtext', valid: false},
      {name: 'test@test.123', valid: false},
      {name: 'a@b.ru', valid: true},
      {name: 'A@B.RU', valid: true},
      {name: '      ', valid: false},
    ];

    emails.forEach(item => {
      expect(CustomValidators.emailValidator(new FormControl(item.name))).toEqual(item.valid ? null : {'email': {'value': item.name}});
    });
  });

  it('should validate password', () => {
    const passwords = [
      {name: 'abc', valid: false},
      {name: 'Aaa888!!!', valid: true},
      {name: '             ', valid: false},
      {name: '12345678Qq', valid: true},
      {name: 'NormalPassword1234', valid: true},
    ];

    passwords.forEach(item => {
      CustomValidators.passwordValidator(new FormControl(item.name))
        .subscribe(nextItem=>{
          expect(nextItem).toEqual(item.valid ? null : {password: {value: item.name}});
        });
    });
  });

  it('should validate phone', () => {
    const phones = [
      {name: '1234567890', valid: false},
      {name: '89991112233', valid: false},
      {name: '+7(111)222-33-44', valid: true},
    ];

    phones.forEach(item => {
      expect(CustomValidators.phoneValidator(new FormControl(item.name))).toEqual(item.valid ? null : {'phone': {'value': item.name}});
    });
  });


});
