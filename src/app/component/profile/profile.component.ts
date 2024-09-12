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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profileState$: Observable<State<CustomHttpResponse<Profile>>> =
    new Observable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false); // this will be using inside of this class
  isLoading$ = this.isLoadingSubject.asObservable(); // and this one will observe it (isLoadingSubject)

  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile> | null>(
    null
  );
  readonly DataState = DataState; // this is using to access the ENUM data

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.profileState$ = this.userService.profile$().pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED, appData: response };
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

  public updateProfile(profileForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.update$(profileForm.value).pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next({ ...response, data: response.data });
        this.isLoadingSubject.next(false);
        return { dataState: DataState.LOADED, appData: response };
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
}
