import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse, HttpParams} from "@angular/common/http";
import {RequestsService} from "../../../shared/services/requests.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ArticlesBlogType} from "../../../../types/articles-blog.type";
import {CategoryType} from "../../../../types/category.type";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs";
import {LoaderService} from "../../../shared/services/loader.service";
import {ActiveCategoryType} from "../../../../types/active-category.type";
import {SearchParamsType} from "../../../../types/search-params.type";

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
  categories!: ActiveCategoryType[];
  urlParams: HttpParams = new HttpParams();
  searchParams: SearchParamsType = {categories: [], page: 1};


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

        this.urlParams = new HttpParams({
          fromObject: params
        });

        const page = this.urlParams.get('page');
        if (page) {
          this.searchParams.page = +page;
        }

        this.getArticles();
      });
  }


  getArticles() {
    this.loaderService.show();

    this.requestsService.getArticles('?' + this.urlParams.toString())
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

          if (this.pagesArray.length === 0) {
            for (let i = 0; i < this.blogData.pages; i++) {
              this.pagesArray.push(i + 1);
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          this._snackBar.open(error.message);
        }
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
    const activeCategoryNames = this.urlParams.getAll('categories');

    if (activeCategoryNames && activeCategoryNames.length > 0) {
      this.categories.forEach(category => {
        category.active = false;

        activeCategoryNames!.forEach(activeCategoryName => {
          if (category.url === activeCategoryName) {
            category.active = true;
            this.searchParams.categories.push(category);

          }
        });
      });
    }
  }


  // functions further will be activated only by user

  filterToggle(): void {
    this.filterOpen = !this.filterOpen;
  }

  removeActiveCategory(activeCategory: ActiveCategoryType) {
    const indexActive = this.searchParams.categories.indexOf(activeCategory);


    if (indexActive !== -1) {
      this.searchParams.categories.splice(indexActive, 1);
    }

    const category = this.categories.find(item => {
      return item === activeCategory;
    });

    if (category) {
      category.active = !category.active;
    }
  }

  activeCategoryToggle(index: number) {
    this.categories[index].active = !this.categories[index].active;

    const isActive = !!this.searchParams.categories.find(item => {
      return item.name === this.categories[index].name;
    });

    if (isActive) {
      const i = this.searchParams.categories.findIndex(item => {
        return item.name === this.categories[index].name;
      });
      this.searchParams.categories.splice(i, 1);
    } else {
      this.searchParams.categories.push(this.categories[index]);
    }
  }

  setQueryParam(key: 'category' | 'page', value: string) {
    if (key === 'page') {
      if (!this.urlParams.toString().includes('page')) {
        this.urlParams = this.urlParams.append('page', value);
      } else {
        this.urlParams = this.urlParams.set('page', value);
      }
    } else if (key === "category") {
      if (this.urlParams.toString().includes('page')) {
        this.searchParams.page = 1;
        this.urlParams = this.urlParams.set('page', 1);
      }

      const isIncluded = this.urlParams.toString().includes(value);

      if (isIncluded) {
        this.urlParams = this.urlParams.delete('categories', value);
      } else {
        this.urlParams = this.urlParams.append('categories', value);
      }
    }

    this.router.navigate([], {
      queryParams: {
        'categories': this.urlParams.getAll('categories'),
        'page': this.urlParams.get('page')
      }
    });
  }

  openPrevPage() {
    if (this.searchParams.page > 1) {
      this.searchParams.page--;
      this.setQueryParam('page', (this.searchParams.page).toString());
    }
  }

  openPage(page: number) {
    if (this.searchParams.page !== page) {
      this.searchParams.page = page;
      this.setQueryParam('page', page.toString());
    }
  }

  openNextPage() {
    if (this.searchParams.page < this.blogData.pages) {
      this.searchParams.page++;
      this.setQueryParam('page', (this.searchParams.page).toString());
    }
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.filterOpen && !(event.target as Element).closest('.filter-block')) {
      this.filterOpen = false;
    }
  }


}
