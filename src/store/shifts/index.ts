import { StateCreator } from 'zustand';
import { TStore } from '..';
import type { TShift, TShiftGroupedData } from '../../types/shifts';
import { StoreShiftsActions, TShiftActions } from './actions';

export type TShifts = {
  shifts: TShiftGroupedData | null;
  active: TShift | null;
  setToActive: TShift | null;
  activeGroupUUID: string | null;
};

export const initialState: TShifts = {
  shifts: null,
  active: null,
  setToActive: null,
  activeGroupUUID: null,
};

export type TShiftStore = TShifts & TShiftActions;

export const StoreShifts: StateCreator<TStore, [['zustand/devtools', never]], [], TShifts> = (...args) => ({
  ...initialState,
  ...StoreShiftsActions(...args),
});
