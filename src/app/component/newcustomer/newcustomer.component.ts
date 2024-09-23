import { Component, OnInit } from '@angular/core';
import { State } from '../../interfaces/state';
import { CustomHttpResponse, Profile } from '../../interfaces/appstates';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { CustomerService } from '../../services/customer.service';
import { UserService } from '../../services/user.service';
import { Customer } from '../../interfaces/customer';
import { NgForm } from '@angular/forms';
import { response } from 'express';

@Component({
  selector: 'app-newcustomer',
  templateUrl: './newcustomer.component.html',
  styleUrl: './newcustomer.component.scss',
})
export class NewcustomerComponent implements OnInit {
  newCustomerState$: Observable<State<CustomHttpResponse<any>>> =
    new Observable();
  private dataSubject = new BehaviorSubject<CustomHttpResponse<any> | null>(
    null
  );
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  readonly DataState = DataState;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.newCustomerState$ = this.customerService.customers$().pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next(response);
        return {
          dataState: DataState.LOADED,
          appData: this.dataSubject.value ?? undefined,
        };
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        return of({
          dataState: DataState.ERROR,
          appData: this.dataSubject.value ?? undefined,
          error,
        });
      })
    );
  }

  /**
   * add new Customer
   * @param newCustomerForm
   */
  createCustomer(newCustomerForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.newCustomerState$ = this.customerService
      .newCustomers$(newCustomerForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          // set the initial value
          newCustomerForm.reset({ type: 'INDIVIDUAL', status: 'ACTIVE' });
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
          return of({ dataState: DataState.ERROR, error });
        })
      );
  }
}
