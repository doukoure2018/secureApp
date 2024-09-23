import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {
  accountType,
  CustomHttpResponse,
  Profile,
} from '../interfaces/appstates';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../interfaces/user';
import { Key } from '../enum/key.enum';
import { NewPasswordForm } from '../interfaces/newPasswordForm';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly server: string = 'http://localhost:8080/auth/secureapi';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  // login service
  login$ = (email: string, password: string) =>
    <Observable<CustomHttpResponse<Profile>>>this.http
      .post<CustomHttpResponse<Profile>>(
        `${this.server}/login`,
        {
          email,
          password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Save user into database
   * @param user
   * @returns
   */
  save$ = (user: User) => <Observable<CustomHttpResponse<Profile>>>this.http
      .post<CustomHttpResponse<Profile>>(`${this.server}/register`, user, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Verification Code for mfa
   * @param email
   * @param code
   * @returns
   */
  verifyCode$ = (email: string, code: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(
          `${this.server}/verify/code/${email}/${code}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  verify$ = (key: string, type: accountType) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(
          `${this.server}/verify/${type}/${key}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  resetnewPassword$ = (newPasswordForm: NewPasswordForm) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .put<CustomHttpResponse<Profile>>(
          `${this.server}/new/password`,
          newPasswordForm
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * Reset password by email
   * @param email
   * @returns
   */
  requestPasswordReset$ = (email: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(
          `${this.server}/resetpassword/${email}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  profile$ = () =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(`${this.server}/profile`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *
   * @param user
   * @returns
   * Update user information
   */
  update$ = (user: User) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(`${this.server}/update`, user)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *
   * @returns
   * this functions handle refresh token
   */
  refreshToken$ = () => <Observable<CustomHttpResponse<Profile>>>this.http
      .get<CustomHttpResponse<Profile>>(`${this.server}/refresh/token`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(Key.REFRESH_TOKEN)}`,
        },
      })
      .pipe(
        tap((response) => {
          const access_token = response.data?.access_token ?? '';
          const refresh_token = response.data?.refresh_token ?? '';
          console.log(response);
          localStorage.removeItem(Key.TOKEN);
          localStorage.removeItem(Key.REFRESH_TOKEN);
          localStorage.setItem(Key.TOKEN, access_token);
          localStorage.setItem(Key.REFRESH_TOKEN, refresh_token);
        }),
        catchError(this.handleError)
      );

  /**
   *
   * @param form
   * Update  Password when user is logged in
   * @returns
   */
  updatePassword$ = (form: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/update/password`,
          form
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *
   * @param roleName
   * @returns
   * Update UserRole
   */
  updateRole$ = (roleName: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/update/role/${roleName}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *
   * @param settings
   * Update Settings
   * @returns
   */
  updateSetting$ = (settings: { enabled: boolean; notLocked: boolean }) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/update/settings`,
          settings
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *
   * @returns
   * if user  need to use MFA
   */
  toggleMfa$ = () =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(`${this.server}/togglemfa`, {})
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * Update image profile fonctionnality
   * @param formData
   * @returns
   */
  updateImage$ = (formData: FormData) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/update/image`,
          formData
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *  Functionnaly for logout
   */
  logOut(): void {
    localStorage.removeItem(Key.TOKEN);
    localStorage.removeItem(Key.REFRESH_TOKEN);
  }

  /**
   *
   * @returns
   *  Functionality if user is still logged in
   */
  isAuthenticated = (): boolean => {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(Key.TOKEN);

      if (token && !this.jwtHelper.isTokenExpired(token)) {
        return true;
      }
    }
    return false;
  };

  // Handle error fonctionnalite
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      console.log(error.error.message);
      errorMessage = `A client error occured - ${error.error.message}`;
    } else {
      if (error.error.message) {
        errorMessage = error.error.message;
        console.log(error.error.reason);
      } else {
        errorMessage = `An error Occurred - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
