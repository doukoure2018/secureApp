import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  throwError,
} from 'rxjs';
import { Key } from '../enum/key.enum';
import { CustomHttpResponse, Profile } from '../interfaces/appstates';
import { UserService } from '../services/user.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isTokenRefreshing: boolean = false;
  private refreshTokenSubject: BehaviorSubject<CustomHttpResponse<Profile> | null> =
    new BehaviorSubject<CustomHttpResponse<Profile> | null>(null);

  constructor(
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID to check environment
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> | Observable<HttpResponse<unknown>> {
    let token = '';
    // Check if running in browser
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem(Key.TOKEN) || ''; // Access localStorage only if in browser
    }

    if (
      request.url.includes('verify') ||
      request.url.includes('login') ||
      request.url.includes('register') ||
      request.url.includes('refresh') ||
      request.url.includes('resetpassword')
    ) {
      return next.handle(request);
    }
    return next.handle(this.addAuthorizationTokenHeader(request, token)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          error.error.reason.includes('expired')
        ) {
          return this.handleRefreshToken(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  // handle the refresh token
  private handleRefreshToken(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.isTokenRefreshing) {
      // the token is not valid and expired
      console.log('Refreshing token .....');
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.userService.refreshToken$().pipe(
        switchMap((response) => {
          console.log('Token Refresh Response:', response);
          this.isTokenRefreshing = false;
          this.refreshTokenSubject.next(response);
          console.log('new Token :', response.data?.access_token);
          console.log('Send original request : ', request);
          const new_access_token = response.data?.access_token ?? '';
          return next.handle(
            this.addAuthorizationTokenHeader(request, new_access_token)
          );
        })
      );
    } else {
      // the token is still valid
      return this.refreshTokenSubject.pipe(
        filter((response) => response !== null), // Ensure response is not null
        switchMap((response) => {
          const access_token = response.data?.access_token ?? '';
          return next.handle(
            this.addAuthorizationTokenHeader(request, access_token)
          );
        })
      );
    }
  }

  private addAuthorizationTokenHeader(
    request: HttpRequest<unknown>,
    _token_: string
  ): HttpRequest<any> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${_token_}` },
    });
  }
}
