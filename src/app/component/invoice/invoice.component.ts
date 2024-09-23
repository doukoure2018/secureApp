import { Component, OnInit } from '@angular/core';
import { State } from '../../interfaces/state';
import {
  Observable,
  BehaviorSubject,
  switchMap,
  map,
  startWith,
  catchError,
  of,
} from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { CustomHttpResponse, InvoiceState } from '../../interfaces/appstates';
import { CustomerService } from '../../services/customer.service';

import { jsPDF as pdf } from 'jspdf';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
})
export class InvoiceComponent implements OnInit {
  invoiceState$: Observable<State<CustomHttpResponse<InvoiceState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<InvoiceState> | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  readonly DataState = DataState;
  private readonly INVOICE_ID: string = 'id';

  constructor(
    private customerService: CustomerService,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.invoiceState$ = this.activatedRouter.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.customerService
          .invoice$(+params.getAll(this.INVOICE_ID))
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

  exportAsPDF(): void {
    const fileName = `invoice-${this.dataSubject.value?.data?.invoice?.invoiceNumber}.pdf`;
    const doc = new pdf();
    // invoice is defined inside 'invoice.component.html'
    doc.html(document.getElementById('invoice') ?? '', {
      margin: 5,
      windowWidth: 1000,
      width: 200,
      callback: (invoice) => invoice.save(fileName),
    });
  }
}
