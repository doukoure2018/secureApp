import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { DataState } from '../../../enum/datastate.enum';
import { CustomHttpResponse } from '../../../interfaces/appstates';
import { CustomerService } from '../../../services/customer.service';
import { UserService } from '../../../services/user.service';
import { State } from '../../../interfaces/state';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersComponent implements OnInit {
  customersState$: Observable<State<CustomHttpResponse<any>>> =
    new Observable();
  private dataSubject = new BehaviorSubject<CustomHttpResponse<any> | null>(
    null
  );
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  readonly DataState = DataState;

  constructor(
    private userService: UserService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    // the spinner start when it is true
    this.isLoadingSubject.next(true);
    this.customersState$ = this.customerService.customers$().pipe(
      map((response) => {
        console.log(response);
        this.isLoadingSubject.next(false);
        this.dataSubject.next(response);
        return {
          dataState: DataState.LOADED,
          appData: response,
        };
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        this.isLoadingSubject.next(false);
        return of({
          dataState: DataState.ERROR,
          error,
        });
      })
    );
  }

  searchCustomers(searchForm: NgForm): void {
    this.currentPageSubject.next(0);
    this.isLoadingSubject.next(true);
    this.customersState$ = this.customerService
      .searchCustomers$(searchForm.value.name)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.isLoadingSubject.next(false);
          return {
            dataState: DataState.LOADED,
            appData: response,
          };
        }),
        startWith({
          dataState: DataState.LOADED,
          appData: this.dataSubject.value ?? undefined,
        }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({
            dataState: DataState.ERROR,
            error,
          });
        })
      );
  }

  goToPage(pageNumber?: number, name?: string): void {
    this.customersState$ = this.customerService
      .searchCustomers$(name, pageNumber)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.currentPageSubject.next(pageNumber!);
          return { dataState: DataState.LOADED, appData: response };
        }),
        startWith({
          dataState: DataState.LOADED,
          appData: this.dataSubject.value ?? undefined,
        }),
        catchError((error: string) => {
          return of({
            dataState: DataState.LOADED,
            error,
            appData: this.dataSubject.value ?? undefined,
          });
        })
      );
  }

  goToNextOrPreviousPage(direction?: string, name?: string): void {
    this.goToPage(
      direction === 'forward'
        ? this.currentPageSubject.value + 1
        : this.currentPageSubject.value - 1,
      name
    );
  }
}
