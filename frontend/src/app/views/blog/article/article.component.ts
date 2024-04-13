import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ArticleFullType} from "../../../../types/article-full.type";
import {RequestsService} from "../../../shared/services/requests.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ArticleShortType} from "../../../../types/article-short.type";
import {AuthService} from "../../../core/auth/auth.service";
import {MultiCommentsType} from "../../../../types/multi-comments.type";
import {CommentType} from "../../../../types/comment.type";
import {CommentActionEnum} from "../../../../types/comment-action.enum";
import {CommentActionType} from "../../../../types/comment-action.type";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArticleComponent implements OnInit {

  article!: ArticleFullType;
  url!: string;
  relatedArticles!: ArticleShortType[];
  isLogged = false;

  comments!: CommentType[];
  commentsCount!: number;
  textarea = '';
  offset = 0;
  commentActionEnum = CommentActionEnum;

  constructor(private activatedRoute: ActivatedRoute,
              private requestsService: RequestsService,
              private _snackBar: MatSnackBar,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.isLogged = this.authService.getIsLoggedIn();

    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.url = params['id'];

        this.getArticle();
        this.getRelatedArticles();
      });

    this.authService.isLogged$
      .subscribe((isLogged: boolean) => {
        this.isLogged = isLogged;
      });
  }

  getArticle() {
    this.requestsService.getArticle(this.url)
      .subscribe({
        next: (response: ArticleFullType | DefaultResponseType) => {

          const error: string | undefined = (response as DefaultResponseType).message;

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          this.article = (response as ArticleFullType);
          this.commentsCount = this.article.commentsCount;

          this.comments = (this.article.comments as CommentType[]);

          this.comments = this.setDateFormat(this.comments)
          this.markLikedDisliked();

        },
        error: (error: HttpErrorResponse) => {
          this._snackBar.open(error.message);
        }
      });
  }


  getRelatedArticles() {
    this.requestsService.getRelatedArticles(this.url)
      .subscribe({
        next: (relatedArticles: ArticleShortType[] | DefaultResponseType) => {

          const error: string | undefined = (relatedArticles as DefaultResponseType).message;

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          this.relatedArticles = (relatedArticles as ArticleShortType[]);


        },
        error: (error: HttpErrorResponse) => {
          this._snackBar.open(error.message);

        }
      });
  }


  postComment() {
    console.log(this.comments)
    this.requestsService.postComment(this.textarea, this.article.id)
      .subscribe((response: DefaultResponseType) => {
          this._snackBar.open(response.message);

          if (response.error) {
            throw new Error(response.message);
          }

          this.textarea = '';

          this.requestsService.getComments(this.article.id, 0)
            .subscribe({
              next: (response: MultiCommentsType | DefaultResponseType) => {
                const error: string | undefined = (response as DefaultResponseType).message;
                if (error) {
                  this._snackBar.open(error);
                  throw new Error(error);
                }

                const newComment = this.setDateFormat([(response as MultiCommentsType).comments[0]] as CommentType[])

                this.comments = [...newComment, ...this.comments];

              },
              error: (error: HttpErrorResponse) => {
                this._snackBar.open(error.message);
              }
            });
        }
      );
  }

  getMoreComments() {
    this.requestsService.getComments(this.article.id, this.offset)
      .subscribe({
        next: (response: MultiCommentsType | DefaultResponseType) => {
          const error: string | undefined = (response as DefaultResponseType).message;

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          const loadedComments = this.setDateFormat((response as MultiCommentsType).comments)

          if (this.offset === 0) {
            this.comments = (response as MultiCommentsType).comments;
          } else {
            this.comments = [...this.comments, ...loadedComments];
          }


          this.offset += 10;

          this.markLikedDisliked();

        },
        error: (error: HttpErrorResponse) => {
          this._snackBar.open(error.message);
        }
      });
  }

  commentAction(commentId: string, action: CommentActionEnum) {
    if (this.isLogged) {
      const comment = this.comments.find(c => c.id === commentId);

      this.requestsService.commentAction(commentId, action)
        .subscribe({
          next: (r: DefaultResponseType) => {
            if (r.error) {
              this._snackBar.open('Ваша жалоба уже отправлена');
              throw new Error(r.message);
            }
          },
          error: () => {
            if (action === CommentActionEnum.violate) {
              this._snackBar.open('Ваша жалоба уже отправлена');
            }
          }
        });

      if (comment) {
        if (action === CommentActionEnum.like && !comment.likeApplied) {
          comment.likesCount++;
          comment.likeApplied = true;
          if (comment.dislikeApplied) {
            comment.dislikesCount--;
            comment.dislikeApplied = false;
          }
        } else if (action === CommentActionEnum.like && comment.likeApplied) {
          comment.likesCount--;
          comment.likeApplied = false;
        }
        if (action === CommentActionEnum.dislike && !comment.dislikeApplied) {
          comment.dislikesCount++;
          comment.dislikeApplied = true;
          if (comment.likeApplied) {
            comment.likesCount--;
            comment.likeApplied = false;
          }
        } else if (action === CommentActionEnum.dislike && comment.dislikeApplied) {
          comment.dislikesCount--;
          comment.dislikeApplied = false;
        }
        if (action === CommentActionEnum.violate && !comment.violateApplied) {
          comment.violateApplied = true;
        }
      }
    } else {
      this._snackBar.open('Для оценки комментария необходимо зарегистрироваться');
    }


  }

  getActionsForComment(commentId: string) {
    // all the work is done locally without http request
    this.requestsService.getActionsForComment(commentId)
      .subscribe({
        next: (response: CommentActionType[] | DefaultResponseType) => {
          const error: string | undefined = (response as DefaultResponseType).message;
          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }
        },
        error: (error: HttpErrorResponse) => {
          this._snackBar.open(error.message);
        }
      });
  }

  markLikedDisliked() {
    if (this.isLogged) {
      this.requestsService.getUserCommentActions(this.article.id)
        .subscribe({
          next: (r: CommentActionType[] | DefaultResponseType) => {
            const error: string | undefined = (r as DefaultResponseType).message;
            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            const commentsWithUserAction = r as CommentActionType[];

            this.comments.forEach(comment => {
              commentsWithUserAction.forEach(markedComment => {

                if (comment.id === markedComment.comment) {
                  if (markedComment.action === CommentActionEnum.like) {
                    comment.likeApplied = true;
                  }
                  if (markedComment.action === CommentActionEnum.dislike) {
                    comment.dislikeApplied = true;
                  }
                  if (markedComment.action === CommentActionEnum.violate) {
                    comment.violateApplied = true;
                  }
                }
              });
            });
          },
          error: (e: HttpErrorResponse) => {
            this._snackBar.open(e.message);
          }
        });
    }
  }

  setDateFormat(comments: CommentType[]) {

    comments.forEach(comment => {
      const date = new Date(comment.date);
      comment.date = `${("0" + date.getDate()).slice(-2)}.${("0" + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()} ${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`;
    });

    return comments;
  }


}
