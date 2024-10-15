import { NgModule } from '@angular/core';
import { ShareModule } from '../../shared/share.module';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { NavbarModule } from '../navbar/navbar.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [ShareModule, ProfileRoutingModule, NavbarModule],
})
export class ProfileModule {}
