import {Component, Input} from '@angular/core';
import {ArticleShortType} from "../../../../types/article-short.type";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input() article!: ArticleShortType;

}
