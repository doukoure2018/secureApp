import { DataState } from '../enum/datastate.enum';
import { Customer } from './customer';
import { Events } from './event';
import { Invoice } from './invoice';
import { Role } from './role';
import { User } from './user';

// when it comes to one table
export interface LoginState {
  dataState: DataState;
  loginSuccess?: boolean;
  error?: string;
  message?: string;
  isUsingMfa?: boolean;
  phone?: string;
}

/**
 *  T can be Profile
 *  T can be Customer
 *  T Can be Invoice
 *  .....
 */
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

// Pagination
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
}

export interface CustomerState {
  user?: User;
  customer?: Customer;
}

export interface InvoiceState {
  user?: User;
  customer?: Customer;
  invoice?: Invoice;
}

export interface RegisterState {
  dataState?: DataState;
  registerSuccess?: boolean;
  message?: string;
  error?: string;
}

export type accountType = 'account' | 'password';
export interface verifyState {
  dataState: DataState; // to get the user information when it comes to reset the password
  verifySuccess?: boolean;
  message?: string;
  error?: string;
  title?: string;
  type?: accountType;
}
