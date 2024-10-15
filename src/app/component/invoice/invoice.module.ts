import { NgModule } from '@angular/core';
import { ShareModule } from '../../shared/share.module';
import { NewinvoiceComponent } from './newinvoice/newinvoice.component';
import { InvoiceComponent } from './invoice-detail/invoice-detail.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { NavbarModule } from '../navbar/navbar.module';

@NgModule({
  declarations: [InvoiceComponent, InvoicesComponent, NewinvoiceComponent],
  imports: [ShareModule, InvoiceRoutingModule, NavbarModule],
})
export class InvoiceModule {}
