import React, { useEffect, createContext, useMemo, useCallback } from 'react';
import { ActionButtonsWrapper, ShiftConfiguratorInput } from '../../../styles/shifts/config';
import { ShiftItem } from './shiftItem';
import { AddButton, CancelButton } from './buttons';
import { AvailableShifts } from './shiftTag';
import { AccordionComponent } from '../../../styles/panel/accordion';
import { useShift } from '../../../hooks/panel/useShift';
import { TRawStaticShift } from '../../../types/shifts';
import { ActionButtons } from './actionButtons';
import { removeShift as removeShiftHandler } from '../../../utils/panels/shift.inputs';

export type TAccordionContext = {
  isDirtyRef: React.MutableRefObject<boolean | null>;
  isValidRef: React.MutableRefObject<boolean | null>;
  // selectedShift: TRawStaticShift | null;
  // groupShifts: TRawStaticShift[] | null;
  // addShift: (shift: TRawStaticShift) => void;
  // setSelectedShift: React.Dispatch<React.SetStateAction<TRawStaticShift | null>>;
  // removeShift: (shift: TRawStaticShift) => void;
  // // selectShiftHandler: React.Dispatch<React.SetStateAction<TRawStaticShift | null>>;
  groupShiftsRef: React.MutableRefObject<TRawStaticShift[] | null>;
  selectedShiftRef: React.MutableRefObject<TRawStaticShift | null>;
  initShiftFormData: TRawStaticShift;
  shiftState: TRawStaticShift;
  setShiftState: React.Dispatch<React.SetStateAction<TRawStaticShift>>
  // shiftStateRef: React.MutableRefObject<TRawStaticShift | null>;
  removeShift: (shift: TRawStaticShift) => void;
}

export const AccordionContext = createContext<TAccordionContext>({
  isDirtyRef: { current: null },
  isValidRef: { current: null },
  // selectedShift: null,
  // groupShifts: null,
  // addShift: () => {},
  // setSelectedShift: () => {},
  // removeShift: () => {},
  // // selectShiftHandler: () => {},
  groupShiftsRef: { current: null },
  selectedShiftRef: { current: null },
  initShiftFormData: {} as TRawStaticShift,
  shiftState: {} as TRawStaticShift,
  setShiftState: () => {},
  removeShift: () => {},
});

export const Accordion = ({ groupUUID }: { groupUUID: TRawStaticShift['group_uuid'] }) => {
  const ButtonRef = React.useRef<HTMLDivElement>(null);
  const AccordionBodyRef = React.useRef<HTMLDivElement>(null);
  
  const { Body, Title, Header, Handler, Container } = AccordionComponent();
  
  const [isActive, setIsActive] = React.useState(false);
  
  const initShiftFormData: TRawStaticShift = useMemo(
    () => ({
      group: '',
      group_uuid: '',
      uuid: '',
      label: '',
      startTime: '00:00',
      endTime: '00:00',
      order: 0,
    }),
    []
  );
  
  const isValidRef = React.useRef<boolean | null>(null);
  const isDirtyRef = React.useRef<boolean | null>(null);
  const selectedShiftRef = React.useRef<TRawStaticShift | null>(null);
  const [shiftState, setShiftState] = React.useState<TRawStaticShift>(initShiftFormData);
  const groupShiftsRef = React.useRef<TRawStaticShift[] | null>(null);

  const {
    handler: { addShift, filterShiftsByGroupUUID },
  } = useShift();


  const removeShift = useCallback(
    (shift: TRawStaticShift) => {
      if (shift) {
        groupShiftsRef.current = removeShiftHandler(groupShiftsRef.current??[], shift);
      }
    },
    []
  );

  useEffect(() => {
    groupShiftsRef.current = filterShiftsByGroupUUID(groupUUID);
    // setGroupShifts(() => {
    //   const shifts = filterShiftsByGroupUUID(groupUUID);
    //   return shifts;
    // });
  }, [filterShiftsByGroupUUID, groupUUID]);

  return (
    <AccordionContext.Provider value={{ 
      groupShiftsRef,
      selectedShiftRef,
      isValidRef,
      isDirtyRef,
      initShiftFormData,
      shiftState,
      setShiftState,
      removeShift,
     }}>
      <div>
        <Header ref={ButtonRef} onClick={() => setIsActive(!isActive)}>
          <Handler isActive={isActive}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="14" height="14">
              <path d="M14.83,11.29,10.59,7.05a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41L12.71,12,9.17,15.54a1,1,0,0,0,0,1.41,1,1,0,0,0,.71.29,1,1,0,0,0,.71-.29l4.24-4.24A1,1,0,0,0,14.83,11.29Z"></path>
            </svg>
          </Handler>
          <Title>
            {groupUUID} <span>{filterShiftsByGroupUUID(groupUUID).length}</span>
          </Title>
        </Header>
        <Body ref={AccordionBodyRef} isActive={isActive}>
          <Container>
            <div>
              <AvailableShifts />
              <ShiftConfiguratorInput>
                <ShiftItem />
                <ActionButtons />
              </ShiftConfiguratorInput>
            </div>
          </Container>
        </Body>
      </div>
    </AccordionContext.Provider>
  );
};
