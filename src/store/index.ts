import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { StoreProps, type TPropsStore } from './props/index';
import { StoreShifts, type TShiftStore } from './shifts/index';

export type TStore = TPropsStore & TShiftStore;

export const useStore = create<TStore>()(
  devtools((...args) => ({
    ...StoreProps(...args),
    ...StoreShifts(...args),
  }))
);
