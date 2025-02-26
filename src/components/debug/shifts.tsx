import React from 'react';
import { DebugShiftTable as ShiftTable, DebugShiftGroupTable as ShiftGroupTable } from '../../styles/debug';
import { useStore } from '../../store';

export const DebugShiftTable = () => {
  const { shifts } = useStore();

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
