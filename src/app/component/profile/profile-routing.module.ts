import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../../guard/authentication.guard';
import { ProfileComponent } from './profile.component';

const profileroutes: Routes = [
  /**
   *  i don't want to load the user profile unless we click on it.
   *  path should be empty and modifie the app-routing.module
   */

  // before

  //   {
  //     path: 'profile',

  //     component: ProfileComponent,
  //     canActivate: [AuthenticationGuard],
  //   },

  // After
  {
    path: '',
    children: [
      {
        path: '',
        component: ProfileComponent,
        canActivate: [AuthenticationGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(profileroutes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
