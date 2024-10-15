import { NgModule } from '@angular/core';
import { ShareModule } from '../../shared/share.module';
import { NavbarComponent } from './navbar.component';

@NgModule({
  declarations: [NavbarComponent],
  imports: [ShareModule],
  exports: [NavbarComponent],
})
export class NavbarModule {}
