import { StateCreator } from 'zustand';
import { TStore } from '..';
import type { TShiftGroupedData } from '../../types/shifts';
import { StoreShiftsActions, TShiftActions } from './actions';

export type TShifts = {
  shifts: TShiftGroupedData | null;
};

export const initialState: TShifts = {
  shifts: null,
};

export type TShiftStore = TShifts & TShiftActions;

export const StoreShifts: StateCreator<TStore, [['zustand/devtools', never]], [], TShifts> = (...args) => ({
  ...initialState,
  ...StoreShiftsActions(...args),
});
