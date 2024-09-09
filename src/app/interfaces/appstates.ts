import { DataState } from '../enum/datastate.enum';
import { Events } from './event';
import { Role } from './role';
import { User } from './user';

export interface LoginState {
  dataState: DataState;
  loginSuccess?: boolean;
  error?: string;
  message?: string;
  isUsingMfa?: boolean;
  phone?: string;
}

export interface CustomHttpResponse<T> {
  timeStamp: Date;
  statusCode: number;
  status: string;
  message: string;
  reason?: string;
  developerMessage?: string;
  data?: T;
}

export interface Profile {
  user?: User;
  roles?: Role[];
  events?: Events[];
  access_token?: string;
  refresh_token?: string;
}
