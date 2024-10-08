import { Component } from '@angular/core';
import { RegisterState } from '../../interfaces/appstates';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { NgForm } from '@angular/forms';
import { DataState } from '../../enum/datastate.enum';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss',
})
export class ResetpasswordComponent {
  resetPasswordState$: Observable<RegisterState> = of({
    dataState: DataState.LOADED,
  });
  readonly DataState = DataState;

  // Injection de dependance
  constructor(private userService: UserService) {}

  resetPassword(resetPasswordForm: NgForm): void {
    this.resetPasswordState$ = this.userService
      .requestPasswordReset$(resetPasswordForm.value.email)
      .pipe(
        map((response) => {
          console.log(response);
          resetPasswordForm.reset();
          return {
            dataState: DataState.LOADED,
            registerSuccess: true,
            message: response.message,
          };
        }),
        startWith({
          dataState: DataState.LOADING,
          registerSuccess: false,
        }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            registerSuccess: false,
            error,
          });
        })
      );
  }
}
