import { Component, Input, OnInit } from '@angular/core';
import { State } from '../../interfaces/state';
import { NgForm } from '@angular/forms';
import {
  Observable,
  BehaviorSubject,
  map,
  startWith,
  catchError,
  of,
  switchMap,
} from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { CustomerState, CustomHttpResponse } from '../../interfaces/appstates';
import { CustomerService } from '../../services/customer.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { response } from 'express';
import { error } from 'console';
import { NgFor } from '@angular/common';
import { get } from 'http';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss',
})
export class CustomerComponent implements OnInit {
  customerState$: Observable<State<CustomHttpResponse<CustomerState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<CustomerState> | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  readonly DataState = DataState;
  private readonly CUSTOMER_ID: string = 'id';

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.customerState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.customerService
          .customer$(+params.get(this.CUSTOMER_ID)!)
          .pipe(
            map((response) => {
              console.log(response);
              this.dataSubject.next(response);
              return {
                dataState: DataState.LOADED,
                appData: this.dataSubject.value ?? response,
              };
            }),
            startWith({
              dataState: DataState.LOADING,
              appData: this.dataSubject.value ?? undefined,
            }),
            catchError((error: string) => {
              return of({ dataState: DataState.ERROR, error });
            })
          );
      })
    );
  }

  updateCustomer(customerForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.customerState$ = this.customerService
      .updateCustomer$(customerForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next({
            ...response,
            data: {
              ...response.data,
              customer: {
                ...response.data?.customer,
                invoices: this.dataSubject.value?.data?.customer?.invoices,
              },
            },
          });
          this.isLoadingSubject.next(false);
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
          this.isLoadingSubject.next(false);
          return of({
            dataState: DataState.ERROR,
            appData: this.dataSubject.value ?? undefined,
            error,
          });
        })
      );
  }
}
