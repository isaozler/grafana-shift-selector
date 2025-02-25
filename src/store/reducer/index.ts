import PROPS_REDUCER_MAP, { TState as TPropsState, PROPS_STORE_KEY } from './props';
import SHIFT_REDUCER_MAP, { TState as TShiftState, SHIFT_STORE_KEY } from './shift';
// import TIME_REDUCER_MAP, { TState as TTimeState, TIME_STORE_KEY } from './time';

type TStoreKey = `STORE_${string}`;

export type TRootStoreState =
  { STORE_PROPS: TPropsState }
  & { STORE_SHIFT: TShiftState }
  // & { STORE_TIME: TTimeState }

export type TStoreActions<A> = { [K in keyof A]: A[K] } & { INIT: string };

export type TReducerMap<K extends TStoreKey, A, R, S> = [K, R, A, S];

export type TStoreReducer<S, C, F, KA> = {
  [K in keyof KA]: (state: S, action: TReducerAction<KA, C>) => F;
};

type TCombinedReducers<S, C, F, KA> = {
  [reducerName: string]: TStoreReducer<S, C, F, KA>;
}

const getReducerMapState = <K extends `STORE_${string}`, R, A, S>(reducer: TReducerMap<K, R, A, S>) => {
  const [,,,reducerState] = reducer

  return reducerState
}

const allReducers: Array<[TStoreKey, TStoreReducer<any, any, any, any>, any, any]> = [
  PROPS_REDUCER_MAP,
  SHIFT_REDUCER_MAP,
  // TIME_REDUCER_MAP,
];

export const initialStates: { [K in keyof TRootStoreState]: TRootStoreState[K] } = {
  [PROPS_STORE_KEY]: getReducerMapState(PROPS_REDUCER_MAP),
  [SHIFT_STORE_KEY]: getReducerMapState(SHIFT_REDUCER_MAP),
  // [TIME_STORE_KEY]: getReducerMapState(TIME_REDUCER_MAP),
};

export type TReducerAction<A, C> = {
  type: keyof A;
  payload?: C;
};

const getReducer = <S, C, F, AT>(
  reducer: TStoreReducer<S, C, F, TStoreActions<AT>>,
  EActions: TStoreActions<AT>
) => (
  state: S,
  action: TReducerAction<TStoreActions<AT>,C>
)=> {
  let actionType = action.type

  if (typeof reducer[actionType] !== 'function') {
    actionType = EActions.INIT as typeof actionType
  }
  
  return reducer[actionType](state, action) || null;
};

export const getAllReducers = (): TCombinedReducers<any, any, any, any> => {
  const result = allReducers.reduce((combinedReducers, [STORE_KEY, REDUCER, ACTIONS]) => {
    return {
      ...combinedReducers,
      [STORE_KEY]: getReducer(REDUCER, ACTIONS),
    };
  }, {})

  return result
};
