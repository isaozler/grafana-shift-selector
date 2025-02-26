import { TShifts } from '.';
import { TPropOptions } from '../../types';
import { TShift, TShiftGroupedData } from '../../types/shifts';
import { StateCreator } from 'zustand';
import { transformGrafanaResponse } from '../../utils/data';
import { parseDynamicData, parseStaticData } from '../../utils/static.data';
import { PanelProps } from '@grafana/data';

export type TShiftActions = {
  setShifts: (shifts: TShiftGroupedData) => void;
  setShift: (group_uuid: string, shift: TShift) => void;
  getShifts: (props: PanelProps<TPropOptions>) => void;
};

export const StoreShiftsActions: StateCreator<TShifts, [['zustand/devtools', never]], [], TShiftActions> = (set) => ({
  setShifts: (shifts) =>
    set(
      (state) => ({
        shifts: {
          ...state.shifts,
          ...shifts,
        },
      }),
      undefined,
      'store:shifts/addShifts'
    ),
  setShift: (group_uuid: string, shift: TShift) =>
    set(
      (state) => ({
        shifts: {
          ...state.shifts,
        },
      }),
      undefined,
      'store:shifts/addShifts'
    ),
  getShifts: (props) =>
    set(
      (state) => {
        let shifts;

        if (props.options.settings.dataSource.type === 'static' && props.options.settings.dataSource.static.data) {
          shifts = parseStaticData(props.options);
        } else if (props.options.settings.dataSource.type === 'database' && props.data) {
          shifts = parseDynamicData(transformGrafanaResponse(props.data, props.options), props.options);
        }

        return {
          ...state,
          shifts,
        };
      },
      undefined,
      'store:shifts/getShifts'
    ),
});
