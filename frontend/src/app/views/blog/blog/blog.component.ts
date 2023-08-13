import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {RequestsService} from "../../../shared/services/requests.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ArticlesBlogType} from "../../../../types/articles-blog.type";
import {CategoryType} from "../../../../types/category.type";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs";
import {LoaderService} from "../../../shared/services/loader.service";
import {ActiveCategoryType} from "../../../../types/active-category.type";
import {SearchParamsType} from "../../../../types/search-params.type";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {

  filterOpen = false;
  pagesArray: number[] = [];
  blogData: ArticlesBlogType = {
    count: 0,
    pages: 0,
    items: []
  };
  categories: ActiveCategoryType[] = [];
  searchParams: SearchParamsType = {categories: [], page: 1};
  appliedFilters: { name: string, url: string }[] = [];


  constructor(private requestsService: RequestsService,
              private _snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.requestsService.isBlogPage(true);
    this.initArticles();
    this.getCategories();
  }

  ngOnDestroy() {
    this.requestsService.isBlogPage(false);
  }


  initArticles() {
    this.activatedRoute.queryParams
      .subscribe((params) => {
        this.loaderService.show();

        this.searchParams = ActiveParamsUtil.processParams(params);

        if (this.categories.length > 0) {
          this.setActiveParams();
        }


        this.requestsService.getArticles(params)
          .pipe(finalize(() => {
            this.loaderService.hide();
          }))
          .subscribe({
            next: (response: ArticlesBlogType | DefaultResponseType) => {

              const error: string | undefined = (response as DefaultResponseType).message;

              if (error) {
                this._snackBar.open(error);
                throw new Error(error);
              }

              this.blogData = (response as ArticlesBlogType);

              this.pagesArray = [...Array(this.blogData.pages).keys()].map(page => ++page);

            },
            error: (error: HttpErrorResponse) => {
              this._snackBar.open(error.message);
            }
          });
      });
  }

  getCategories() {
    this.requestsService.getCategories()
      .subscribe({
        next: (value: CategoryType[] | DefaultResponseType) => {

          const error: string | undefined = (value as DefaultResponseType).message;

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          const categories = value as CategoryType[];

          if (categories) {
            this.categories = categories.map(c => {
              return {
                name: c.name,
                active: false,
                url: c.url
              };
            });
          }

          this.setActiveParams();

        },
        error: (error: HttpErrorResponse) => {
          this._snackBar.open(error.message);
        }
      });
  }

  setActiveParams() {
    const activeCategoryNames: string[] = this.searchParams.categories;
    this.appliedFilters = [];

    if (activeCategoryNames.length > 0) {
      this.categories.forEach(category => {
        category.active = false;

        activeCategoryNames.forEach((activeCategoryName: string) => {
          if (category.url === activeCategoryName) {
            category.active = true;
            this.appliedFilters.push({
              name: category.name,
              url: category.url
            });
          }
        });
      });
    }
  }

  // functions further will be activated only by user

  filterToggle(): void {
    this.filterOpen = !this.filterOpen;
  }

  updateSearchParams(categoryUrl: string) {
    const isIncluded = !!this.searchParams.categories.find(c => c === categoryUrl);

    if (isIncluded) {
      this.searchParams.categories = this.searchParams.categories.filter(c => c !== categoryUrl);
      const category = this.categories.find(category => category.url === categoryUrl);
      if (category) {
        category.active = false;
        this.appliedFilters = this.appliedFilters.filter(filter => filter.url !== categoryUrl);
      }
    } else {
      this.searchParams.categories = [...this.searchParams.categories, categoryUrl];
      const category = this.categories.find(category => category.url === categoryUrl);
      if (category) {
        category.active = true;
        this.appliedFilters.push({
          name: category.name,
          url: category.url
        });
      }
    }
    this.searchParams.page = 1;

    this.router.navigate(['/blog'], {
      queryParams: this.searchParams
    });
  }

  openPrevPage() {
    if (this.searchParams.page && this.searchParams.page > 1) {
      this.searchParams.page--;

      this.router.navigate(['/blog'], {
        queryParams: this.searchParams
      });
    }
  }

  openPage(page: number) {
    if (this.searchParams.page !== page) {
      this.searchParams.page = page;

      this.router.navigate(['/blog'], {
        queryParams: this.searchParams
      });
    }
  }

  openNextPage() {
    if (this.searchParams.page && this.searchParams.page < this.blogData.pages) {
      this.searchParams.page++;

      this.router.navigate(['/blog'], {
        queryParams: this.searchParams
      });
    }
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.filterOpen && !(event.target as Element).closest('.filter-block')) {
      this.filterOpen = false;
    }
  }


}
