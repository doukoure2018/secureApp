import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {
  CustomerState,
  CustomHttpResponse,
  InvoiceState,
  Page,
} from '../interfaces/appstates';
import { User } from '../interfaces/user';
import { Customer } from '../interfaces/customer';
import { Stats } from '../interfaces/stats';
import { Invoice } from '../interfaces/invoice';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly server: string = 'http://localhost:8080/secureapi/customer';

  constructor(private http: HttpClient) {}

  customers$ = (page: number = 0) =>
    <Observable<CustomHttpResponse<Page<Customer> & User & Stats>>>(
      this.http
        .get<CustomHttpResponse<Page<Customer> & User & Stats>>(
          `${this.server}/list?page=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );
  /**
   * fonctionnality to handle newCustomer add
   * @param customer
   * @returns
   */
  newCustomers$ = (customer: Customer) =>
    <Observable<CustomHttpResponse<Page<Customer> & User>>>(
      this.http
        .post<CustomHttpResponse<Page<Customer> & User>>(
          `${this.server}/create`,
          customer
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * fonctionnality to handle newCustomer add
   * @param customer
   * @returns
   */
  searchCustomers$ = (name: string = '', page: number = 0) =>
    <Observable<CustomHttpResponse<Page<Customer> & User>>>(
      this.http
        .get<CustomHttpResponse<Page<Customer> & User>>(
          `${this.server}/search?name=${name}&page=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * Get costomer by id
   * @param customerId
   * @returns
   */
  customer$ = (customerId: number) =>
    <Observable<CustomHttpResponse<CustomerState>>>(
      this.http
        .get<CustomHttpResponse<CustomerState>>(
          `${this.server}/get/${customerId}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * Update custmer information
   * @param updateCustomer
   * @returns
   */
  updateCustomer$ = (updateCustomer: Customer) =>
    <Observable<CustomHttpResponse<CustomerState>>>(
      this.http
        .put<CustomHttpResponse<CustomerState>>(
          `${this.server}/update`,
          updateCustomer
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * this is the page that displays first
   * @returns
   */
  newInvoices$ = () =>
    <Observable<CustomHttpResponse<Customer[] & User>>>(
      this.http
        .get<CustomHttpResponse<Customer[] & User>>(
          `${this.server}/invoice/new`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  createInvoice$ = (invoiceForm: Invoice) =>
    <Observable<CustomHttpResponse<Invoice & User>>>(
      this.http
        .post<CustomHttpResponse<Invoice & User>>(
          `${this.server}/invoice/created`,
          invoiceForm
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  invoices$ = (page: number = 0) =>
    <Observable<CustomHttpResponse<Page<Invoice> & User>>>(
      this.http
        .get<CustomHttpResponse<Page<Invoice> & User>>(
          `${this.server}/invoice/list?page=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  invoice$ = (invoiceId: number) =>
    <Observable<CustomHttpResponse<InvoiceState>>>(
      this.http
        .get<CustomHttpResponse<InvoiceState>>(
          `${this.server}/invoice/get/${invoiceId}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  downloadReport$ = () => <Observable<HttpEvent<Blob>>>this.http
      .get(`${this.server}/download/report`, {
        reportProgress: true,
        observe: 'events',
        responseType: 'blob',
      })
      .pipe(tap(console.log), catchError(this.handleError));

  // Handle error fonctionnalite
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      console.log(error.error.message);
      errorMessage = `A client error occured - ${error.error.message}`;
    } else {
      if (error.error.message) {
        errorMessage = error.error.message;
        console.log(error.error.reason);
      } else {
        errorMessage = `An error Occurred - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
