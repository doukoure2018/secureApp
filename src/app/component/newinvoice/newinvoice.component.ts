import { Component, OnInit } from '@angular/core';
import { State } from '../../interfaces/state';
import { NgForm } from '@angular/forms';
import {
  Observable,
  BehaviorSubject,
  map,
  startWith,
  catchError,
  of,
} from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { CustomHttpResponse } from '../../interfaces/appstates';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newinvoice',
  templateUrl: './newinvoice.component.html',
  styleUrl: './newinvoice.component.scss',
})
export class NewinvoiceComponent implements OnInit {
  newInvoiceState$: Observable<State<CustomHttpResponse<any>>> =
    new Observable();
  private dataSubject = new BehaviorSubject<CustomHttpResponse<any> | null>(
    null
  );
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  readonly DataState = DataState;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newInvoiceState$ = this.customerService.newInvoices$().pipe(
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

  createInvoice(invoiceForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.newInvoiceState$ = this.customerService
      .createInvoice$(invoiceForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          // set the initial value
          //this.dataSubject.next(response);
          this.isLoadingSubject.next(false);
          this.router.navigate([`/invoices`]);
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
