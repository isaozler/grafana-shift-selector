import React, { useEffect, useState } from 'react';
import { TShiftGroupedData } from '../../types/shifts';
import { DebugShiftTable as ShiftTable, DebugShiftGroupTable as ShiftGroupTable } from '../../styles/debug';
import { useStoreState, useSubscribe } from '../../store/hook';
// import { useSelector } from 'react-redux';
import { store, TState } from '../../store/reducer/shift';
import { useProps } from '../../store/hooks/props';

export const DebugShiftTable = ({ data }: { data: TShiftGroupedData | null }) => {
  const { getState } = useProps();

  console.log('SHIDFTS COMPONENT UPDATE', { state: getState() });

  return (
    <>
      {data && Object.keys(data).length ? (
        <div>
          {Object.values(data).map(({ uuid, label, hasMultipleActiveShifts }) => (
            <ShiftGroupTable key={uuid}>
              <div>
                <div>Group Label: {label}</div>
                <div>Group UUID: {uuid}</div>
                <div>Multiple Active: {hasMultipleActiveShifts ? 'true' : 'false'}</div>
              </div>
              <div>
                {data[uuid].shifts.map((shift) => (
                  <ShiftTable key={shift.uuid} isActive={shift.isActive} isClosest={shift.isClosest}>
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
