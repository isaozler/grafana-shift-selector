import React, { useCallback } from 'react';
import { ShiftConfiguratorButton } from '../../../styles/shifts/config';
import { TRawStaticShift, TStaticRawData } from '../../../types/shifts';

export const AddButton = ({
  isValid,
  isNewShift,
  shift,
}: {
  isValid: boolean;
  isNewShift: boolean;
  shift: TRawStaticShift | null;
}) => {
  console.log('BUTTON', { isValid });

  const handler = useCallback((shift: TRawStaticShift) => {
    console.log('ADD SHIFT', shift);
  }, []);

  return (
    <div>
      <ShiftConfiguratorButton type="button" onClick={() => shift && handler(shift)} disabled={!isValid}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
          {isNewShift ? (
            <path d="M19,11H13V5a1,1,0,0,0-2,0v6H5a1,1,0,0,0,0,2h6v6a1,1,0,0,0,2,0V13h6a1,1,0,0,0,0-2Z"></path>
          ) : (
            <path d="M7.5,6A1.5,1.5,0,1,0,9,7.5,1.5,1.5,0,0,0,7.5,6Zm13.62,4.71L12.71,2.29A1,1,0,0,0,12,2H3A1,1,0,0,0,2,3v9a1,1,0,0,0,.29.71l8.42,8.41a3,3,0,0,0,4.24,0L21.12,15a3,3,0,0,0,0-4.24Zm-1.41,2.82h0l-6.18,6.17a1,1,0,0,1-1.41,0L4,11.59V4h7.59l8.12,8.12a1,1,0,0,1,.29.71A1,1,0,0,1,19.71,13.53Z"></path>
          )}
        </svg>
        <span>{isNewShift ? 'Add Shift' : 'Update Shift'}</span>
      </ShiftConfiguratorButton>
    </div>
  );
};

export const CancelButton = ({ selectedShiftRef }: { selectedShiftRef: React.MutableRefObject<TRawStaticShift | null> }) => {
  return (
    <div>
      <ShiftConfiguratorButton type="button" onClick={() => selectedShiftRef.current = null }>
        <svg
          style={{ transform: 'rotate(45deg)' }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="14"
          height="14"
        >
          <path d="M19,11H13V5a1,1,0,0,0-2,0v6H5a1,1,0,0,0,0,2h6v6a1,1,0,0,0,2,0V13h6a1,1,0,0,0,0-2Z"></path>
        </svg>
        <span>Cancel</span>
      </ShiftConfiguratorButton>
    </div>
  );
};
