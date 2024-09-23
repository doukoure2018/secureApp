import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import {
  accountType,
  CustomHttpResponse,
  verifyState,
} from '../../interfaces/appstates';
import { User } from '../../interfaces/user';
import { DataState } from '../../enum/datastate.enum';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { response } from 'express';
import { Location } from '@angular/common';
import { error } from 'console';
import { register } from 'module';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss',
})
export class VerifyComponent implements OnInit {
  verifyState$: Observable<verifyState> = new Observable();
  private userSubject = new BehaviorSubject<User | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private readonly ACCOUNT_KEY: string = 'key';
  readonly DataState = DataState;
  constructor(
    private activatedRouter: ActivatedRoute,
    private userService: UserService,
    private location: Location
  ) {}
  ngOnInit(): void {
    this.verifyState$ = this.activatedRouter.paramMap.pipe(
      switchMap((params: ParamMap) => {
        console.log(this.activatedRouter);
        // we are going to get the type : password or account
        const type: accountType = this.getAccountType(this.location.path());
        return this.userService
          .verify$(params.get(this.ACCOUNT_KEY)!, type)
          .pipe(
            map((response) => {
              console.log(response);
              // when it is password we return an object of user or it is account verification
              if (type === 'password' && response.data?.user) {
                this.userSubject.next(response.data?.user);
              } else {
                this.userSubject.next(null);
              }

              return {
                type,
                title: 'Verifie ..',
                dataState: DataState.LOADED,
                message: response.message,
                verifySuccess: true,
              };
            }),
            startWith({
              type,
              title: 'Verifie ..',
              dataState: DataState.LOADING,
              message: 'Please Wait while we are verifying your account',
              verifySuccess: false,
            }),
            catchError((error: string) => {
              return of({
                dataState: DataState.ERROR,
                error,
                title: error,
                message: error,
                verifySuccess: false,
              });
            })
          );
      })
    );
  }

  renewPassword(resetPasswordForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.verifyState$ = this.userService
      .resetnewPassword$({
        userId: this.userSubject.value?.id,
        password: resetPasswordForm.value.password,
        confirmPassword: resetPasswordForm.value.confirmPassword,
      })
      .pipe(
        map((response) => {
          console.log(response);
          resetPasswordForm.reset();
          this.isLoadingSubject.next(false);
          return {
            type: 'account' as accountType,
            dataState: DataState.LOADED,
            title: 'Success!',
            message: response.message,
            verifySuccess: true,
          };
        }),
        startWith({
          type: 'password' as accountType,
          dataState: DataState.LOADING,
          title: 'Verified!',
          verifySuccess: false,
        }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({
            type: 'password' as accountType,
            dataState: DataState.LOADED,
            message: error,
            verifySuccess: true, // still on the same page
            error,
          });
        })
      );
  }

  private getAccountType(url: string): accountType {
    return url.includes('password') ? 'password' : 'account';
  }
}
