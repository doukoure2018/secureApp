import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { CustomHttpResponse, Profile } from '../../interfaces/appstates';
import { State } from '../../interfaces/state';
import { DataState } from '../../enum/datastate.enum';
import { UserService } from '../../services/user.service';
import { NgForm } from '@angular/forms';
import { EventType } from '../../enum/event-type.enum';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profileState$: Observable<State<CustomHttpResponse<Profile>>> =
    new Observable();
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile> | null>(
    null
  );
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private isDataSavedSubject = new BehaviorSubject<boolean>(false);
  isDataSeved$ = this.isDataSavedSubject.asObservable();

  readonly DataState = DataState; // this is using to access the ENUM data
  readonly EventType = EventType;

  private showLogsSubject = new BehaviorSubject<boolean>(false);
  showLogs$ = this.showLogsSubject.asObservable();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // for the role name
    this.profileState$ = this.userService.profile$().pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next(response);
        return {
          dataState: DataState.LOADED,
          appData: this.dataSubject.value ?? undefined,
        };
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        return of({
          dataState: DataState.ERROR,
          appData: this.dataSubject.value ?? undefined,
          error,
        });
      })
    );
  }

  /**
   *
   * @param profileForm
   * Update User Profile
   */
  updateProfile(profileForm: NgForm): void {
    this.isLoadingSubject.next(true);
    // we just clicked and the data is not save yet
    this.isDataSavedSubject.next(false);
    this.profileState$ = this.userService.update$(profileForm.value).pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next({ ...response, data: response.data });
        this.isLoadingSubject.next(false);
        // data is saved
        this.isDataSavedSubject.next(true);
        return {
          dataState: DataState.LOADED,
          appData: this.dataSubject.value ?? undefined,
        };
      }),
      startWith({
        dataState: DataState.LOADED,
        appData: this.dataSubject.value ?? undefined,
      }),
      catchError((error: string) => {
        this.isLoadingSubject.next(false);
        this.isDataSavedSubject.next(false);
        return of({
          dataState: DataState.LOADED,
          appData: this.dataSubject.value ?? undefined,
          error,
        });
      })
    );
  }

  /**
   *
   * @param passwordForm
   *  Update user password
   */
  updatePassword(passwordForm: NgForm): void {
    this.isLoadingSubject.next(true);
    if (
      passwordForm.value.newPassword === passwordForm.value.confirmNewPassword
    ) {
      console.log('password correct');
      this.profileState$ = this.userService
        .updatePassword$(passwordForm.value)
        .pipe(
          map((response) => {
            console.log(response);
            passwordForm.reset();
            this.isLoadingSubject.next(false);
            return {
              dataState: DataState.LOADED,
              appData: this.dataSubject.value ?? undefined,
            };
          }),
          startWith({
            dataState: DataState.LOADED,
            appData: this.dataSubject.value ?? undefined,
          }),
          catchError((error: string) => {
            passwordForm.reset();
            this.isLoadingSubject.next(false);
            return of({
              dataState: DataState.LOADED,
              appData: this.dataSubject.value ?? undefined,
              error,
            });
          })
        );
    } else {
      console.log('incorrect password');
      passwordForm.reset();
      this.isLoadingSubject.next(false);
    }
  }

  /**
   *
   * @param roleForm
   * Update User role
   */
  updateRole(roleForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService
      .updateRole$(roleForm.value.roleName)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next({ ...response, data: response.data });
          this.isLoadingSubject.next(false);
          return {
            dataState: DataState.LOADED,
            appData: this.dataSubject.value ?? undefined,
          };
        }),
        startWith({
          dataState: DataState.LOADED,
          appData: this.dataSubject.value ?? undefined,
        }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({
            dataState: DataState.LOADED,
            appData: this.dataSubject.value ?? undefined,
            error,
          });
        })
      );
  }

  /**
   *
   * @param settingForm
   * Update user settings
   */
  updateAccountSettings(settingForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService
      .updateSetting$(settingForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next({ ...response, data: response.data });
          this.isLoadingSubject.next(false);
          return {
            dataState: DataState.LOADED,
            appData: this.dataSubject.value ?? undefined,
          };
        }),
        startWith({
          dataState: DataState.LOADED,
          appData: this.dataSubject.value ?? undefined,
        }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({
            dataState: DataState.LOADED,
            appData: this.dataSubject.value ?? undefined,
            error,
          });
        })
      );
  }

  /**
   *  toggle mfa fonctionnality
   */
  toggleMfa(): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.toggleMfa$().pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next({ ...response, data: response.data });
        this.isLoadingSubject.next(false);
        return {
          dataState: DataState.LOADED,
          appData: this.dataSubject.value ?? undefined,
        };
      }),
      startWith({
        dataState: DataState.LOADED,
        appData: this.dataSubject.value ?? undefined,
      }),
      catchError((error: string) => {
        this.isLoadingSubject.next(false);
        return of({
          dataState: DataState.LOADED,
          appData: this.dataSubject.value ?? undefined,
          error,
        });
      })
    );
  }

  /**
   * UPDATE IMAGE FONCTIONNALITY
   * @param image
   */
  updatePicture(image: File): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService
      .updateImage$(this.getFormData(image))
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next({
            ...response,
            data: {
              ...response.data,
              user: {
                ...response.data?.user,
                imageUrl: `${
                  response.data?.user?.imageUrl
                }?time=${new Date().getTime()}`,
              },
            },
          });
          this.isLoadingSubject.next(false);
          return {
            dataState: DataState.LOADED,
            appData: this.dataSubject.value ?? undefined,
          };
        }),
        startWith({
          dataState: DataState.LOADED,
          appData: this.dataSubject.value ?? undefined,
        }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({
            dataState: DataState.LOADED,
            appData: this.dataSubject.value ?? undefined,
            error,
          });
        })
      );
  }

  toggleLogs(): void {
    this.showLogsSubject.next(!this.showLogsSubject.value);
  }

  /**
   * to ensure typeScript knows it value in HTMLInputElement
   * @param event
   */
  public formatImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Check if there are files
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      this.updatePicture(file);
    } else {
      console.error('No file selected');
    }
  }

  private getFormData(image: File): FormData {
    const formData = new FormData();
    formData.append('image', image);
    return formData;
  }
}
