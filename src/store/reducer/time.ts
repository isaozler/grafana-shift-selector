import { TReducerMap, TStoreActions, TStoreReducer } from ".";
import { TTimeObject } from "../../types/time";

export const TIME_STORE_KEY = `STORE_TIME`;
type TReducer = TReducerMap<typeof TIME_STORE_KEY, TStoreActions<typeof EActions>, typeof reducer, TState>

export enum EActions {
  INIT = 'INIT',
  GET = 'GET',
};

export type TState = {
  current: TTimeObject
}
  
const initState: TState = {
  current: {
    hour: 0,
    minute: 0,
  }
};

const reducer: TStoreReducer<TState, {}, TState | TTimeObject, typeof EActions> = {
  INIT: (state) => state,
  GET: (state) => state.current,
};

const reducerMap: TReducer = [
  TIME_STORE_KEY,
  reducer,
  EActions,
  initState,
]

export default reducerMap
