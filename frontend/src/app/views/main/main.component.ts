import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChildren
} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {CarouselCardType} from "../../../types/carousel-card.type";
import {ServicesType} from "../../../types/services.type";
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {RequestsService} from "../../shared/services/requests.service";
import {OrderTypeEnum} from "../../../types/order-type.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ArticleShortType} from "../../../types/article-short.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {

  @ViewChildren('canvas') private canvas!: ElementRef<HTMLCanvasElement>[];

  protected readonly orderTypeEnum = OrderTypeEnum;
  topArticles: ArticleShortType[] = [];

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoWidth: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  };

  carouselInfo: CarouselCardType[] = [
    {
      about: 'Предложение месяца',
      titlePrev: 'Продвижение в Instagram для вашего бизнеса',
      titleEmphasis: '-15%',
      titleNext: '!',
      alias: 'instagram'
    },
    {
      about: 'Акция',
      titlePrev: 'Нужен грамотный',
      titleEmphasis: 'копирайтер',
      titleNext: '?',
      description: 'Весь декабрь у нас действует акция на работу копирайтера.',
      alias: '6th-place'

    },
    {
      about: 'Новость дня',
      titlePrev: '',
      titleEmphasis: '6 место',
      titleNext: 'в ТОП-10 SMM-агенств Москвы!',
      description: 'Мы благодарим каждого, кто голосовал за нас!',
      alias: 'instagram'
    },
  ];

  servicesInfo: ServicesType[] = [
    {
      title: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7 500'
    },
    {
      title: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3 500'
    },
    {
      title: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: '1 000'
    },
    {
      title: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: '750'
    },
  ];

  advantages = [
    {
      title: 'Мастерски вовлекаем аудиторию в процесс.',
      text: 'Мы увеличиваем процент вовлечённости за короткий промежуток времени.'
    },
    {
      title: 'Разрабатываем бомбическую визуальную концепцию.',
      text: 'Наши специалисты знают как создать уникальный образ вашего проекта.'
    },
    {
      title: 'Создаём мощные воронки с помощью текстов.',
      text: 'Наши копирайтеры создают не только вкусные текста, но и классные воронки.'
    },
    {
      title: 'Помогаем продавать больше.',
      text: 'Мы не только помогаем разработать стратегию по продажам, но также корректируем её под нужды заказчика.'
    },
  ];

  customOptionsRev: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoWidth: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 3
      },
    },
    nav: false
  };

  reviews = [
    {
      name: 'Станислав',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
  ];


  constructor(private dialog: MatDialog,
              private requestsService: RequestsService,
              private _snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.getTopArticles();
  }

  ngAfterViewInit() {
    this.drawCircle();
  }


  drawCircle() {
    this.canvas.forEach(canvas => {

      const context = canvas.nativeElement.getContext('2d');

      if (context) {
        context.beginPath();
        context.arc(0, 0, 702, 0, 2 * Math.PI);
        context.fillStyle = '#B9D5FD';
        context.fill();
      }
    });
  }

  openDialog(service: string, orderType: OrderTypeEnum, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.requestsService.setData(service, orderType);

    this.dialog.open(DialogComponent, {
      width: '727px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  getTopArticles() {
    this.requestsService.getTopArticles()
      .subscribe({
        next: (response: ArticleShortType[] | DefaultResponseType) => {

          const error: string | undefined = (response as DefaultResponseType).message;

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          this.topArticles = (response as ArticleShortType[]);
        },
        error: (error: HttpErrorResponse) => {
          this._snackBar.open(error.message);
        }
      });

  }


}



