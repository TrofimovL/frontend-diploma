import { Component } from '@angular/core';
import {DialogComponent} from "../../components/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {OrderTypeEnum} from "../../../../types/order-type.enum";
import {RequestsService} from "../../services/requests.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  protected readonly orderTypeEnum = OrderTypeEnum;

  constructor(private dialog: MatDialog,
              private requestsService: RequestsService) {
  }

  openDialog(service: string, orderType: OrderTypeEnum, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.requestsService.setData(service, orderType);

    this.dialog.open(DialogComponent, {
      width: '727px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

}
