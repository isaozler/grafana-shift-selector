import React, { memo, useContext, useEffect, useState } from 'react';
import { ActionButtonsWrapper } from '../../../styles/shifts/config';
import { AddButton, CancelButton } from './buttons';
import { TRawStaticShift } from '../../../types/shifts';
import { AccordionContext } from './accordion';

export const ActionButtons =
  ({
    // isValidRef,
    // isDirtyRef,
    // groupShifts,
    // selectedShift,
    // addShift,
    // setSelectedShift,
  }: {
    // isValidRef: React.MutableRefObject<boolean | null>;
    // isDirtyRef: React.MutableRefObject<boolean | null>;
    // groupShifts: TRawStaticShift[] | null;
    // selectedShift: TRawStaticShift | null;
    // addShift: (shift: TRawStaticShift) => void;
    // setSelectedShift: React.Dispatch<React.SetStateAction<TRawStaticShift | null>>;
  }) => {
    const {
      isValidRef,
      isDirtyRef,
      groupShiftsRef,
      selectedShiftRef,
      // addShift,
      // setSelectedShift,
    } = useContext(AccordionContext)

    console.log('isValidRef', isValidRef.current);
    console.log('selectedShiftRef', selectedShiftRef.current);

    // useEffect(() => { 
    //   console.log('isValidRef', isValidRef.current);
    //   console.log('isDirtyRef', isDirtyRef.current);
    // }, [isValidRef, isDirtyRef]);

    return (
      <ActionButtonsWrapper>
        isvalid: {isDirtyRef.current ? 'T' : 'F'}<br/>
        isdirty: {isDirtyRef.current ? 'T' : 'F'}
        <AddButton
          isNewShift={!groupShiftsRef.current?.find(({ uuid }) => uuid === selectedShiftRef.current?.uuid)}
          isValid={!!isValidRef.current && !!isDirtyRef.current}
          shift={selectedShiftRef.current}
        />
        <CancelButton selectedShiftRef={selectedShiftRef} />
      </ActionButtonsWrapper>
    );
  }
  // });
  // ActionButtons.displayName = 'ActionButtons';
