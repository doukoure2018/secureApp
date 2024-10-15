import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { VerifyComponent } from './verify/verify.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ShareModule } from '../../shared/share.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
    ResetpasswordComponent,
  ],
  imports: [ShareModule, AuthRoutingModule],
})
export class AuthModule {}
