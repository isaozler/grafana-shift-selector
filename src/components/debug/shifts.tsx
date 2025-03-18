import React from 'react';
import { DebugShiftTable as ShiftTable, DebugShiftGroupTable as ShiftGroupTable } from '../../styles/debug';
import { useStore } from '../../store';
import { ShiftButton } from './shifts.css';
import { TShift } from '../../types/shifts';
import { locationService } from '@grafana/runtime';
import { getDateByTimeObjectByContext } from '../../utils/time';
import { PanelProps } from '@grafana/data';
import { TPropOptions } from '../../types';

export const DebugShiftTable = () => {
  const store = useStore();

  const { shifts, setToActive, setClickedShift, unsetClickedShift } = store;

  const changeShift = React.useCallback(
    (uuid: string, shift: TShift) => {
      const path = locationService.getLocation();
      const url = new URLSearchParams(path.search);

      if (store.props && shift) {
        const { startDate, endDate } =
          getDateByTimeObjectByContext({ options: store.props } as PanelProps<TPropOptions>, shift) ?? {};

        if (startDate && endDate) {
          url.set('from', startDate.toISOString());
          url.set('to', typeof endDate === 'string' ? endDate : endDate.toISOString());
        }
      }

      if (store.setToActive?.uuid === shift.uuid) {
        url.delete('group_uuid');
        url.delete('active_shift_uuid');
        unsetClickedShift();
      } else {
        url.set('group_uuid', uuid);
        url.set('active_shift_uuid', shift.uuid);
        setClickedShift(uuid, shift);
      }
      
      locationService.push('?' + url.toString());
    },
    [setClickedShift, store.props, store.setToActive?.uuid, unsetClickedShift]
  );

  return (
    <>
      {shifts && Object.keys(shifts).length ? (
        <div>
          {Object.values(shifts).map(({ uuid, label, hasMultipleActiveShifts }) => (
            <ShiftGroupTable key={uuid}>
              <div>
                <div>Group Label: {label}</div>
                <div>Group UUID: {uuid}</div>
                <div>Multiple Active: {hasMultipleActiveShifts ? 'true' : 'false'}</div>
              </div>
              <div>
                {shifts[uuid]?.shifts.map((shift) => (
                  <ShiftTable
                    key={shift.uuid}
                    isActive={shift.isActive}
                    isClosest={shift.isClosest}
                    isManualActive={setToActive?.uuid === shift.uuid}
                  >
                    {Object.keys(shift).map((shiftKey) =>
                      typeof (shift as any)[shiftKey] === 'string' || typeof (shift as any)[shiftKey] === 'number' ? (
                        <div key={shiftKey}>
                          <strong>{shiftKey}:</strong> {(shift as any)[shiftKey]}
                        </div>
                      ) : (
                        <div key={shiftKey}>
                          <strong>{shiftKey}:</strong> {JSON.stringify((shift as any)[shiftKey])}
                        </div>
                      )
                    )}
                    <ShiftButton onClick={() => changeShift(uuid, shift)}>Set Shift {`${shift.label}`}</ShiftButton>
                  </ShiftTable>
                ))}
              </div>
            </ShiftGroupTable>
          ))}
        </div>
      ) : (
        <div>No or Invalid shift data provided</div>
      )}
    </>
  );
};
