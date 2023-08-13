import {RequestsService} from "./requests.service";
import {HttpClient} from "@angular/common/http";
import {OrderTypeEnum} from "../../../types/order-type.enum";
import {of} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {TestBed} from "@angular/core/testing";
import {CommentActionEnum} from "../../../types/comment-action.enum";

describe('requests service', () => {

  let requestsService: RequestsService;
  let httpServiceSpy: jasmine.SpyObj<HttpClient>;
  const service = 'serviceString';
  let orderType: OrderTypeEnum;

  const DefaultResponseTypeError: DefaultResponseType = {error: true, message: 'message'};
  const DefaultResponseTypeSuccess: DefaultResponseType = {error: false, message: 'message'};

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [
        RequestsService,
        {provide: HttpClient, useValue: httpServiceSpy}
      ]
    });

    requestsService = TestBed.inject(RequestsService);

  });

  it('should set data', () => {
    orderType = OrderTypeEnum.order;
    requestsService.setData(service, orderType);
    expect(requestsService['service']).toBe(service);
    expect(requestsService['orderType']).toBe(orderType);

    orderType = OrderTypeEnum.consultation;
    requestsService.setData(service, orderType);
    expect(requestsService['service']).toBe(service);
    expect(requestsService['orderType']).toBe(orderType);
  });

  it('should get data', () => {
    orderType = OrderTypeEnum.order;
    const data = requestsService.getData();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBe(2);
  });

  it('should post requests DefaultResponseTypeSuccess', (done: DoneFn) => {
    httpServiceSpy.post.and.returnValue(of(DefaultResponseTypeSuccess));

    requestsService.requests('name', 'phone', 'service', OrderTypeEnum.consultation)
      .subscribe((value) => {
        expect(value).toBe(DefaultResponseTypeSuccess);
        done();
      });
  });

  it('should post requests DefaultResponseTypeError', (done: DoneFn) => {
    httpServiceSpy.post.and.returnValue(of(DefaultResponseTypeError));

    requestsService.requests('name', 'phone', 'service', OrderTypeEnum.consultation)
      .subscribe((value) => {
        expect(value).toBe(DefaultResponseTypeError);
        done();
      });
  });


  it('should post comment', (done: DoneFn) => {
    httpServiceSpy.post.and.returnValue(of(DefaultResponseTypeSuccess));

    requestsService.postComment('text', 'article')
      .subscribe((value) => {
        expect(value).toBe(DefaultResponseTypeSuccess);
        done();
      });
  });

  it('should post comment action', (done: DoneFn) => {
    httpServiceSpy.post.and.returnValue(of(DefaultResponseTypeSuccess));

    requestsService.commentAction('commentId', CommentActionEnum.like)
      .subscribe((value) => {
        expect(value).toBe(DefaultResponseTypeSuccess);
        done();
      });
  });




});
