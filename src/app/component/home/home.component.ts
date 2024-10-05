import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { State } from '../../interfaces/state';
import { CustomHttpResponse, Page } from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../interfaces/customer';
import { Router } from '@angular/router';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  homeState$: Observable<State<CustomHttpResponse<any>>> = new Observable();
  private dataSubject = new BehaviorSubject<CustomHttpResponse<any> | null>(
    null
  );
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();

  private fileStatusSubject = new BehaviorSubject<{
    status: string;
    type: string;
    percent: number;
  }>({ status: '', type: '', percent: 0 });
  fileStatus$ = this.fileStatusSubject.asObservable();
  readonly DataState = DataState;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.homeState$ = this.customerService.customers$().pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next(response);
        return {
          dataState: DataState.LOADED,
          appData: response,
        };
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        return of({
          dataState: DataState.ERROR,
          error,
        });
      })
    );
  }

  goToPage(pageNumber?: number): void {
    this.isLoadingSubject.next(true);
    this.homeState$ = this.customerService.customers$(pageNumber).pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next(response);
        this.isLoadingSubject.next(false);
        this.currentPageSubject.next(pageNumber!);
        return { dataState: DataState.LOADED, appData: response };
      }),
      startWith({
        dataState: DataState.LOADED,
        appData: this.dataSubject.value ?? undefined,
      }),
      catchError((error: string) => {
        this.isLoadingSubject.next(false);
        return of({
          dataState: DataState.LOADED,
          error,
          appData: this.dataSubject.value ?? undefined,
        });
      })
    );
  }

  goToNextOrPreviousPage(direction?: string): void {
    this.goToPage(
      direction === 'forward'
        ? this.currentPageSubject.value + 1
        : this.currentPageSubject.value - 1
    );
  }

  selectCustomer(customer: Customer): void {
    this.router.navigate([`customers/${customer.id}`]);
  }

  downlaodReport(): void {
    this.homeState$ = this.customerService.downloadReport$().pipe(
      map((response) => {
        console.log(response);
        this.reportProgress(response);
        return {
          dataState: DataState.LOADED,
          appData: this.dataSubject.value ?? undefined,
        };
      }),
      startWith({
        dataState: DataState.LOADED,
        appData: this.dataSubject.value ?? undefined,
      }),
      catchError((error: string) => {
        return of({
          dataState: DataState.ERROR,
          appData: this.dataSubject.value ?? undefined,
          error,
        });
      })
    );
  }

  private reportProgress(httpEvent: HttpEvent<string[] | Blob>): void {
    switch (httpEvent.type) {
      case HttpEventType.DownloadProgress || HttpEventType.UploadProgress:
        const total = httpEvent.total ?? 1;
        const percent = Math.round((100 * httpEvent.loaded) / total);
        this.fileStatusSubject.next({
          status: 'progress',
          type: 'Downloading...',
          percent: percent,
        });
        break;
      case HttpEventType.ResponseHeader:
        console.log('Got response Headers', httpEvent);
        break;
      case HttpEventType.Response:
        const fileName =
          httpEvent.headers.get('File-Name') || 'unknown-filename';
        const contentType =
          httpEvent.headers.get('Content-Type') || 'application/octet-stream';

        saveAs(
          new File([<Blob>httpEvent.body], fileName, {
            type: `${contentType};charset-utf-8`,
          })
        );
        this.fileStatusSubject.next({
          status: '',
          type: '',
          percent: 0,
        });
        break;
      default:
        console.log(httpEvent);
        break;
    }
  }
}
