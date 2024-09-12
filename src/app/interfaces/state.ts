import { DataState } from '../enum/datastate.enum';

/**
 *  this is the state of all the interface
 *  that we are going to be making
 */
export interface State<T> {
  dataState: DataState;
  appData?: T;
  error?: string;
}
