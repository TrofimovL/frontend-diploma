import {Params} from "@angular/router";
import {SearchParamsType} from "../../../types/search-params.type";

export class ActiveParamsUtil {

  static processParams(params: Params): SearchParamsType {

    const searchParams: SearchParamsType = {categories: [], page: 1};

    if (params.hasOwnProperty('categories')) {
      searchParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
    }

    if (params.hasOwnProperty('page')) {
      searchParams.page = params['page'];
    }
    return searchParams;
  }
}
