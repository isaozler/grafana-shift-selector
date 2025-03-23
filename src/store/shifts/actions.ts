import { TShifts } from '.';
import { TPropOptions } from '../../types';
import { TShift, TShiftGroupedData } from '../../types/shifts';
import { StateCreator } from 'zustand';
import { transformGrafanaResponse } from '../../utils/data';
import { parseDynamicData, parseStaticData } from '../../utils/static.data';
import { PanelProps } from '@grafana/data';
import { setDashboardTime } from '../../utils/grafana/time';

export type TShiftActions = {
  setShifts: (shifts: TShiftGroupedData) => void;
  setShift: (group_uuid: string, shift: TShift) => void;
  setClickedShift: (group_uuid: string, shift: TShift, active?: TShift) => void;
  getShifts: (props: PanelProps<TPropOptions>) => void;
  unsetClickedShift: () => void;
};

export const StoreShiftsActions: StateCreator<TShifts, [['zustand/devtools', never]], [], TShiftActions> = (set) => ({
  setShifts: (shifts) =>
    set(
      (state) => {
        return {
          shifts: {
            ...state.shifts,
            ...shifts,
          },
        };
      },
      undefined,
      'store:shifts/addShifts'
    ),
  setShift: (group_uuid: string, shift: TShift) =>
    set(
      (state) => ({
        ...state,
        shifts: {
          ...state.shifts,
        },
        active: shift,
        activeGroupUUID: group_uuid,
      }),
      undefined,
      'store:shifts/setShift'
    ),
  setClickedShift: (group_uuid: string, shift: TShift /* active */) =>
    set(
      (state) => ({
        ...state,
        // active: active ?? state.active ?? shift ?? null,
        setToActive: shift,
        activeGroupUUID: group_uuid,
      }),
      undefined,
      'store:shifts/setShift/manually'
    ),
  unsetClickedShift: () =>
    set(
      (state) => ({
        ...state,
        setToActive: null,
        activeGroupUUID: null,
      }),
      undefined,
      'store:shifts/setShift/manually'
    ),
  getShifts: (props) =>
    set(
      (state) => {
        let shifts, active;

        if (props.options.settings.dataSource.type === 'static' && props.options.settings.dataSource.static.data) {
          shifts = parseStaticData(props.options);
        } else if (props.options.settings.dataSource.type === 'database' && props.data) {
          shifts = parseDynamicData(transformGrafanaResponse(props.data, props.options), props.options);
        }

        if (shifts) {
          active = setDashboardTime(shifts, props) ?? null;
        }

        return {
          ...state,
          shifts,
          active,
        };
      },
      undefined,
      'store:shifts/getShifts'
    ),
});
