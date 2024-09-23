import { Component, OnInit } from '@angular/core';
import { RegisterState } from '../../interfaces/appstates';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { NgForm } from '@angular/forms';
import { DataState } from '../../enum/datastate.enum';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  // initialise the loginState to LOADED
  regiterState$: Observable<RegisterState> = of({
    dataState: DataState.LOADED,
  });
  readonly DataState = DataState;

  // Injection de dependance
  constructor(private userService: UserService) {}

  register(registerForm: NgForm): void {
    this.regiterState$ = this.userService.save$(registerForm.value).pipe(
      map((response) => {
        console.log(response);
        registerForm.reset();
        return {
          dataState: DataState.LOADED,
          registerSuccess: true,
          message: response.message,
        };
      }),
      startWith({ dataState: DataState.LOADING, registerSuccess: false }),
      catchError((error: string) => {
        return of({
          dataState: DataState.ERROR,
          registerSuccess: false,
          error,
        });
      })
    );
  }
  createAccountForm(): void {
    this.regiterState$ = of({
      dataState: DataState.LOADED,
      registerSuccess: false,
    });
  }
}
