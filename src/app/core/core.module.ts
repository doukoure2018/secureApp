import { NgModule } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { CacheInterceptor } from '../interceptors/cache.interceptor';
import { UserService } from '../services/user.service';
import { CustomerService } from '../services/customer.service';
import { HttpCacheService } from '../services/http.cache.service';
import { NotificationService } from '../services/notification.service';

@NgModule({
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    [
      UserService,
      CustomerService,
      HttpCacheService,
      NotificationService,
      { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    ],
  ],
})
export class CoreModule {}
