import { TRawStaticShift } from '../../types/shifts';

export const isValidShiftData = (shift: TRawStaticShift): boolean => {
  if (
    shift.group &&
    shift.group_uuid &&
    shift.uuid &&
    shift.label &&
    shift.startTime &&
    shift.endTime &&
    shift.startTime !== shift.endTime &&
    typeof shift.order !== 'undefined' &&
    shift.order >= 0
  ) {
    return true;
  }

  return false;
};

export const addShifts = (shifts: TRawStaticShift[], newShifts: TRawStaticShift[]): TRawStaticShift[] => {
  if (newShifts.every((shift) => isValidShiftData(shift))) {
    return [...shifts, ...newShifts];
  }

  return shifts;
};

export const addShift = (shifts: TRawStaticShift[], shift: TRawStaticShift): TRawStaticShift[] => {
  if (isValidShiftData(shift)) {
    return [...shifts, shift];
  }

  return shifts;
};

export const removeShift = (shifts: TRawStaticShift[], shift: TRawStaticShift): TRawStaticShift[] => {
  const filteredShifts = shifts.filter((s) => s.uuid !== shift.uuid && s.group_uuid !== shift.group_uuid);
  return filteredShifts;
};

export const updateShift = (shifts: TRawStaticShift[], shift: TRawStaticShift): TRawStaticShift[] => {
  if (isValidShiftData(shift)) {
    return shifts.map((s) => {
      if (s.uuid === shift.uuid) {
        return shift;
      }

      return s;
    });
  }

  return shifts;
};
