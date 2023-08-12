import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {OrderTypeEnum} from "../../../types/order-type.enum";
import {DefaultResponseType} from "../../../types/default-response.type";
// import {environment} from "../../../environments/environment.development";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ArticleShortType} from "../../../types/article-short.type";
import {ArticlesBlogType} from "../../../types/articles-blog.type";
import {CategoryType} from "../../../types/category.type";
import {ArticleFullType} from "../../../types/article-full.type";
import {MultiCommentsType} from "../../../types/multi-comments.type";
import {CommentActionEnum} from "../../../types/comment-action.enum";
import {CommentActionType} from "../../../types/comment-action.type";
import {Params} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private service!: string;
  private orderType!: OrderTypeEnum;
  isBlogPage$: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) {
  }


  setData(service: string, orderType: OrderTypeEnum): void {
    this.service = service;
    this.orderType = orderType;
  }

  getData(): [string, OrderTypeEnum] {
    return [this.service, this.orderType];
  }


  requests(name: string, phone: string, service: string, type: OrderTypeEnum): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', {
      name: name,
      phone: phone,
      service: service,
      type: type
    });
  }

  getTopArticles(): Observable<ArticleShortType[] | DefaultResponseType> {
    return this.http.get<ArticleShortType[] | DefaultResponseType>(environment.api + 'articles/top');
  }

  getArticles(params: Params): Observable<ArticlesBlogType | DefaultResponseType> {
    return this.http.get<ArticlesBlogType | DefaultResponseType>(environment.api + 'articles', {
      params: params
    });
  }

  getArticle(url: string): Observable<ArticleFullType | DefaultResponseType> {
    return this.http.get<ArticleFullType | DefaultResponseType>(environment.api + 'articles/' + url);
  }

  getRelatedArticles(url: string): Observable<ArticleShortType[] | DefaultResponseType> {
    return this.http.get<ArticleShortType[] | DefaultResponseType>(environment.api + 'articles/related/' + url);
  }

  getCategories(): Observable<CategoryType[] | DefaultResponseType> {
    return this.http.get<CategoryType[] | DefaultResponseType>(environment.api + 'categories');
  }

  isBlogPage(key: boolean): void {
    this.isBlogPage$.next(key);
  }

  getComments(article: string, offset: number): Observable<MultiCommentsType | DefaultResponseType> {
    return this.http.get<MultiCommentsType | DefaultResponseType>(`${environment.api}comments?offset=${offset}&article=${article}`);
  }

  postComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text: text,
      article: article
    });
  }

  commentAction(commentId: string, action: CommentActionEnum): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {
      action: action
    });
  }

  getUserCommentActions(articleId: string): Observable<CommentActionType[] | DefaultResponseType> {
    return this.http.get<CommentActionType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions?articleId=' + articleId);
  }

  getActionsForComment(commentId: string): Observable<CommentActionType[] | DefaultResponseType> {
    return this.http.get<CommentActionType[] | DefaultResponseType>(environment.api + 'comments/' + commentId + '/actions');
  }


}
