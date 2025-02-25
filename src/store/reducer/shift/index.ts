import { BehaviorSubject } from "rxjs";
import { TReducerMap, TStoreActions, TStoreReducer } from "..";
import { TShift } from "../../../types/shifts";

/**
 * Constants & Store
 */

export const SHIFT_STORE_KEY = `STORE_SHIFT`;

export enum EActions {
  INIT = 'INIT',
};

const initState: TState = {};

export const store = {
  subject: new BehaviorSubject<TState>(initState),
}

/**
 * Types
 */

type TReducer = TReducerMap<
  typeof SHIFT_STORE_KEY,
  TStoreActions<typeof EActions>,
  typeof reducer,
  TState
>
export type TState = {}
type TResponseState = TState;
type TPayload = Partial<TShift>;


/**
 * Reducer
 */

const reducer: TStoreReducer<TState, TPayload, TResponseState, typeof EActions> = {
  INIT: (state) => state,
};

const reducerSet: TReducer = [
  SHIFT_STORE_KEY,
  reducer,
  EActions,
  initState,
]

export default reducerSet
