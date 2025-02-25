import { BehaviorSubject } from "rxjs";
import { TReducerMap, TStoreActions, TStoreReducer } from "..";
import { TPropOptions } from "../../../types";

/**
 * Constants & Store
 */

export const PROPS_STORE_KEY = `STORE_PROPS`;

export enum EActions {
  INIT = 'INIT',
  SET_PROPS = 'SET_PROPS',
};

const initState: TState = {} as TState;

export const store = {
  subject: new BehaviorSubject<TState>(initState),
}

/**
 * Types
 */

type TReducer = TReducerMap<
  typeof PROPS_STORE_KEY,
  TStoreActions<typeof EActions>,
  typeof reducer,
  TState
>
export type TState = TPropOptions
type TResponseState = TState | {} | null;
type TPayload = { path: string } | undefined;


/**
 * Reducer
 */

const reducer: TStoreReducer<TState, TPayload, TResponseState, typeof EActions> = {
  INIT: (state) => state,
  SET_PROPS: (state, { payload }) => {
    return {
      ...state,
      ...store.subject.getValue(),
      ...payload
    }
  },
};

const reducerSet: TReducer = [
  PROPS_STORE_KEY,
  reducer,
  EActions,
  initState,
]

export default reducerSet
