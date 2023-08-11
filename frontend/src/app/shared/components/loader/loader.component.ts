import {Component, OnInit} from '@angular/core';
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  isShown = false;

  constructor(private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.loaderService.isShown$
      .subscribe((isShown: boolean) => {
        this.isShown = isShown;
      });
  }

}
