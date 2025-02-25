import { useCallback, useEffect, useState } from 'react';
import { addShift, addShifts, removeShift, updateShift } from '../../utils/panels/shift.inputs';
import { TRawStaticShift } from '../../types/shifts';
import { globalData } from '../../data';
import { getValueByPath } from '../../utils/common';

export const useShift = () => {
  const [shifts, setShifts] = useState<TRawStaticShift[]>([]);
  const [groupUUIDs, setGroupUUIDs] = useState<string[]>([]);
  const [isValid, setIsValid] = useState<boolean>(false);

  const setValidityHandler = useCallback(
    (isShiftValid: boolean) => {
      setIsValid(() => !!isShiftValid);
    },
    [setIsValid]
  );

  const filterShiftsByGroupUUID = useCallback(
    (groupUUID: TRawStaticShift['group_uuid']) => {
      return shifts.filter((shift) => shift.group_uuid === groupUUID);
    },
    [shifts]
  );

  const addShiftsHandler = useCallback(
    (appendShifts: TRawStaticShift[]) => {
      if (appendShifts.length) {
        setShifts(() => addShifts(shifts, appendShifts));
      }
    },
    [shifts]
  );

  const addShiftHandler = useCallback(
    (shift: TRawStaticShift) => {
      if (shift) {
        setShifts(() => addShift(shifts, shift));
      }
    },
    [shifts]
  );

  const removeShiftHandler = useCallback(
    (shift: TRawStaticShift) => {
      if (shift) {
        setShifts(() => removeShift(shifts, shift));
      }
    },
    [shifts]
  );

  useEffect(() => {
    Object.keys(shifts).forEach((key: string, index: number) => {
      const shift = shifts[index];
      setGroupUUIDs((prev) => [...new Set([...prev, shift.group_uuid])]);
    });
  }, [shifts]);

  useEffect(() => {
    console.log('HOOK FILE', { isValid });
  }, [isValid]);

  useEffect(() => {
    const panelPropShifts = getValueByPath(globalData, 'options.settings.dataSource.static.data');

    if (panelPropShifts) {
      setShifts(() => JSON.parse(panelPropShifts));
    }
  }, []);

  return {
    states: {
      isValid,
      shifts,
      groupUUIDs,
    },
    dispatchers: {
      setShifts,
      // setActiveShift,
      // setActiveShiftGroupUUID,
    },
    handler: {
      addShifts: addShiftsHandler,
      addShift: addShiftHandler,
      removeShift: removeShiftHandler,
      updateShift,
      setIsValid: setValidityHandler,
      filterShiftsByGroupUUID,
    },
  };
};
