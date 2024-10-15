import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthModule } from './component/auth/auth.module';
import { CustomerModule } from './component/customer/customer.module';
import { HomeModule } from './component/home/home.module';
import { InvoiceModule } from './component/invoice/invoice.module';
import { ProfileModule } from './component/profile/profile.module';
import { StatsModule } from './component/stats/stats.module';
import { NotificationModule } from './notification.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    AuthModule,
    CustomerModule,
    HomeModule,
    InvoiceModule,
    ProfileModule,
    StatsModule,
    AppRoutingModule,
    NotificationModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
