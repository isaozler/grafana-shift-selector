import { useDispatch as _useThunkDispatch } from 'react-redux';
import { Dispatch, Store } from 'redux';

import { initializeStore } from './index';
import { TRootStoreState } from './reducer';
import { BehaviorSubject } from 'rxjs';

const reduxStore: Store = initializeStore();

reduxStore.subscribe(() => {
  console.log('1 DEBUGGGG', reduxStore.getState());
})

export const useStore = () => {
  return reduxStore
}

export const useStoreState = <K extends keyof TRootStoreState>(key?: K): TRootStoreState[K] | null => {
  const rootState = useRootStoreState();
  const storeState = key && rootState?.[key] ? rootState[key] : null

  return storeState
};

export const useSubscribe = <S>(subject: BehaviorSubject<S>) => {
  return (setState: React.Dispatch<React.SetStateAction<S>>) =>
    subject.subscribe(setState)
};

export const useRootStoreState = (): TRootStoreState => {
  return reduxStore.getState();
};

export const useDispatch = (): Dispatch => {
  return reduxStore.dispatch;
};

export const useThunkDispatch = () => _useThunkDispatch<Dispatch>();
