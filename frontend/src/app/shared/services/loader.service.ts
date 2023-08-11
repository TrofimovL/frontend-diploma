import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isShown$: Subject<boolean> = new Subject<boolean>();

  show(){
    this.isShown$.next(true);
  }

  hide(){
    this.isShown$.next(false);
  }
}
