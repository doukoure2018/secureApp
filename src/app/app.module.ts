import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { VerifyComponent } from './component/verify/verify.component';
import { ResetpasswordComponent } from './component/resetpassword/resetpassword.component';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CustomerComponent } from './component/customer/customer.component';
import { CustomersComponent } from './component/customers/customers.component';
import { HomeComponent } from './component/home/home.component';
import { ProfileComponent } from './component/profile/profile.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { StatsComponent } from './component/stats/stats.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { InvoiceComponent } from './component/invoice/invoice.component';
import { NewcustomerComponent } from './component/newcustomer/newcustomer.component';
import { InvoicesComponent } from './component/invoices/invoices.component';
import { NewinvoiceComponent } from './component/newinvoice/newinvoice.component';
import { ExtractArrayValue } from './pipes/extractvalue.pipe';
import { CacheInterceptor } from './interceptors/cache.interceptor';

@NgModule({
  declarations: [
    ExtractArrayValue,
    AppComponent,
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
    ResetpasswordComponent,
    CustomerComponent,
    CustomersComponent,
    HomeComponent,
    ProfileComponent,
    NavbarComponent,
    StatsComponent,
    InvoiceComponent,
    NewcustomerComponent,
    InvoicesComponent,
    NewinvoiceComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    [
      { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    ],
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
