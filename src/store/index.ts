import { useMemo } from 'react';
import { combineReducers, legacy_createStore as createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { getAllReducers, initialStates } from './reducer';
import { BehaviorSubject } from 'rxjs';

export type TStore = ReturnType<typeof initStore>;

let store: TStore | undefined;

// export const getSubject = <S>(state: S) => new BehaviorSubject(state)

export const setState = <S>(subject: BehaviorSubject<S>, state: S) => {
  subject.next(state)
}

function initStore(preloadedState: any) {
  return createStore(
    combineReducers(getAllReducers()),
    preloadedState || initialStates,
    composeWithDevTools(),
  );
}

export const initializeStore = (preloadState?: any) => {
  let _store = store ?? initStore(preloadState);

  if (preloadState && store) {
    _store = initStore({
      ...(store.getState() || {}),
      ...preloadState,
    });

    store = undefined;
  }

  if (typeof window === 'undefined') {
    return _store;
  }

  if (!store) {
    store = _store
  }

  return _store;
};

export const useStore = (initialState: any): Store => useMemo(() => initializeStore(initialState), [initialState]);
