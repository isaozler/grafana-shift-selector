import { StateCreator } from 'zustand';
import { TStore } from '..';
import type { TPropOptions } from '../../types';
import { StorePropActions, TShiftActions } from './actions';

export type TOptions = {
  props: TPropOptions | null;
};

export type TPropsStore = TOptions & TShiftActions;

export const StoreProps: StateCreator<TStore, [['zustand/devtools', never]], [], TOptions> = (...args) => ({
  props: null,
  ...StorePropActions(...args),
});
