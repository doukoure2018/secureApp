import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../../guard/authentication.guard';
import { InvoiceComponent } from './invoice-detail/invoice-detail.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { NewinvoiceComponent } from './newinvoice/newinvoice.component';

const invoiceroutes: Routes = [
  {
    path: 'invoices/new',
    component: NewinvoiceComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'invoices',
    component: InvoicesComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'invoices/:id/:invoiceNumber',
    component: InvoiceComponent,
    canActivate: [AuthenticationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(invoiceroutes)],
  exports: [RouterModule],
})
export class InvoiceRoutingModule {}
