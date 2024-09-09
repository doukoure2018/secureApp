import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
  Subscriber,
  Subscription,
} from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { LoginState } from '../../interfaces/appstates';
import { UserService } from '../../services/user.service';
import { NgForm } from '@angular/forms';
import { Key } from '../../enum/key.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  // initialise the loginState to LOADED
  loginState$: Observable<LoginState> = of({ dataState: DataState.LOADED });
  private phoneSubject = new BehaviorSubject<string>('');
  private emailSubject = new BehaviorSubject<string>('');
  readonly DataState = DataState;

  // Injection de dependance
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    if (this.loginState$) {
      this.loginState$.subscribe((loginState) => {
        console.log('log State: ', loginState);
      });
    }
  }

  /**
   *
   * @param loginForm
   * Loging form fonctionnality
   */
  public login(loginForm: NgForm): void {
    this.loginState$ = this.userService
      .login$(loginForm.value.email, loginForm.value.password)
      .pipe(
        map((response) => {
          // if user is loged with Mfa
          if (response.data?.user?.usingMfa) {
            this.phoneSubject.next(response.data?.user?.phone ?? '');
            this.emailSubject.next(response.data?.user?.email ?? '');
            console.log(
              response.data.user.phone?.substring(
                response.data.user.phone.length - 4
              )
            );
            return {
              dataState: DataState.LOADED,
              isUsingMfa: true,
              loginSuccess: false,
              phone: response.data.user.phone?.substring(
                response.data.user.phone.length - 4
              ),
            };
          } else {
            const access_token = response.data?.access_token ?? '';
            const refresh_token = response.data?.refresh_token ?? '';
            localStorage.setItem(Key.TOKEN, access_token);
            localStorage.setItem(Key.REFRESH_TOKEN, refresh_token);
            this.router.navigate(['/']);
            return {
              dataState: DataState.LOADED,
              loginSuccess: true,
            };
          }
        }),
        startWith({ dataState: DataState.LOADING, isUsingMfa: false }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            isUsingMfa: false,
            loginSuccess: false,
            error,
          });
        })
      );
  }

  public verifyCode(verifyCodeForm: NgForm): void {
    this.loginState$ = this.userService
      .verifyCode$(this.emailSubject.value, verifyCodeForm.value.code)
      .pipe(
        map((response) => {
          const access_token = response.data?.access_token ?? '';
          const refresh_token = response.data?.refresh_token ?? '';
          localStorage.setItem(Key.TOKEN, access_token);
          localStorage.setItem(Key.REFRESH_TOKEN, refresh_token);
          this.router.navigate(['/']);
          return { dataState: DataState.LOADED, loginSuccess: true };
        }),
        startWith({
          dataState: DataState.LOADING,
          isUsingMfa: true,
          loginSuccess: false,
          phone: this.phoneSubject.value.substring(
            this.phoneSubject.value.length - 4
          ),
        }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            isUsingMfa: true,
            loginSuccess: false,
            error,
            phone: this.phoneSubject.value.substring(
              this.phoneSubject.value.length - 4
            ),
          });
        })
      );
  }

  public loginPage(): void {
    this.loginState$ = of({ dataState: DataState.LOADED });
  }
}
