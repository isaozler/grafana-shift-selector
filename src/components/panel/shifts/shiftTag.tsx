import React, { useCallback, useContext, useEffect, useRef } from 'react';
import {
  AvailableShiftTagWrapper as TagWrapper,
  AvailableShiftWrapper as Wrapper,
  AvailableShiftTagLabel as TagLabel,
  AvailableShiftTagRemoveButton as RemoveButton,
} from '../../../styles/panel/shift.tag';
import { useShift } from '../../../hooks/panel/useShift';
import { TRawStaticShift } from '../../../types/shifts';
import { AccordionContext } from './accordion';

export const AvailableShifts = ({
  // groupUUID,
  // selectShiftHandler,
  // groupShifts,
  // selectedShift,
}: {
  // groupUUID: TRawStaticShift['group_uuid'];
  // selectShiftHandler: React.Dispatch<React.SetStateAction<TRawStaticShift | null>>;
  // groupShifts: TRawStaticShift[] | null;
  // selectedShift: TRawStaticShift | null;
}) => {
  // const {
  //   handler: { removeShift },
  // } = useShift();
  const {
    groupShiftsRef,
    selectedShiftRef,
    setShiftState,
    // selectedShift,
    removeShift,
  } = useContext(AccordionContext);

  // const setShiftState = useCallback(
  //   (shift: TRawStaticShift) => {
  //     if (selectedShiftRef.current?.uuid === shift.uuid) {
  //       selectedShiftRef.current = null;
  //     } else {
  //       selectedShiftRef.current = shift;
  //     }
  //   },
  //   [selectedShiftRef]
  // );

  return (
    <Wrapper>
      <div>Available Shifts</div>
      <div>
        {groupShiftsRef.current?.map((shift) => {
          return (
            <TagWrapper key={shift.uuid} isActive={shift.uuid === selectedShiftRef.current?.uuid}>
              <TagLabel onClick={() => setShiftState(shift)}>{shift.label}</TagLabel>
              <RemoveButton onClick={() => removeShift(shift)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
                  <path d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path>
                </svg>
              </RemoveButton>
            </TagWrapper>
          );
        })}
      </div>
    </Wrapper>
  );
};
