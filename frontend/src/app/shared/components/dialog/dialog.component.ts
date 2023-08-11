import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {CustomValidators} from "../../services/validators";
import {RequestsService} from "../../services/requests.service";
import {OrderTypeEnum} from "../../../../types/order-type.enum";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  service!: string;
  orderType!: OrderTypeEnum;
  success = false;
  services = [
    'Создание сайтов',
    'Продвижение',
    'Реклама',
    'Копирайтинг'
  ];
  protected readonly orderTypeEnum = OrderTypeEnum;


  serviceForm = this.fb.group({
    name: ['', {
      updateOn: 'blur',
      validators: [Validators.required, CustomValidators.nameValidator]
    }],
    phone: ['', {
      updateOn: 'blur',
      validators: [Validators.required, CustomValidators.phoneValidator],
    }],
    service: [''],
    type: ['']
  });


  constructor(private fb: FormBuilder,
              private requestsService: RequestsService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit() {

    [this.service, this.orderType] = this.requestsService.getData();


    if (this.service && this.orderType) {
      this.serviceForm.controls['service'].setValue(this.service);
      this.serviceForm.controls['type'].setValue(this.orderType);
    }
  }

  sendRequest() {
    const name = this.serviceForm.value.name;
    const phone = this.serviceForm.value.phone;
    const service = this.service;
    const type = this.orderType;

    if (name && phone && service && type) {
      this.requestsService.requests(name, phone, service, type)
        .subscribe({
          next: (r) => {
            this._snackBar.open(r.message);
            this.success = true;
          },
          error: (r) => {
            this._snackBar.open(r.message);
          }
        });
    }
  }

  chooseSelectItem(serviceName: string) {
    this.service = serviceName;
  }
}
