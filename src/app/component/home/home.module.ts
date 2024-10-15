import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { ShareModule } from '../../shared/share.module';
import { HomeRoutingModule } from './home-routing.module';
import { NavbarModule } from '../navbar/navbar.module';
import { StatsModule } from '../stats/stats.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [ShareModule, HomeRoutingModule, NavbarModule, StatsModule],
})
export class HomeModule {}
