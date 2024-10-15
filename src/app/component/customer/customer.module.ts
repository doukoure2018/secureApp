import { NgModule } from '@angular/core';
import { ShareModule } from '../../shared/share.module';
import { CustomersComponent } from './customers/customers.component';
import { NewcustomerComponent } from './newcustomer/newcustomer.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { NavbarModule } from '../navbar/navbar.module';

@NgModule({
  declarations: [
    CustomerDetailComponent,
    CustomersComponent,
    NewcustomerComponent,
  ],
  imports: [ShareModule, CustomerRoutingModule, NavbarModule],
})
export class CustomerModule {}
