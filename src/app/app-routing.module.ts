import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home/home.component';
import { AuthenticationGuard } from './guard/authentication.guard';

const routes: Routes = [
  /**
   *  Don't load user profile unless we click on it
   *  so we create a callback function for the user
   */
  {
    path: 'profile',
    loadChildren: () =>
      import('./component/profile/profile.module').then(
        (module) => module.ProfileModule
      ),
  },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: HomeComponent, canActivate: [AuthenticationGuard] },
];

@NgModule({
  /**
   * Now anyway i want to preload all the module on the background but profile module
   * preloadingStrategy: PreloadAllModules
   */
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
