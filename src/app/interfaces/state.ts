import { DataState } from '../enum/datastate.enum';

/**
 *  this is the state of all the interface
 *  that we are going to be making when the user is logged in
 *  for multiple object table
 */
export interface State<T> {
  dataState: DataState;
  appData?: T;
  error?: string;
}
