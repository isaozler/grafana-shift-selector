import { TPropOptions } from '../types';
import { TShiftGroupedData, TPanelSelectOption, TShift } from '../types/shifts';
import { getTimeObject, isNextDay, timeObjectToUnix, timeStringToUnix, TTimeObject, TTimeString } from './time';

export const hasMultipleShiftGroups = (shiftsData: TShiftGroupedData | null): boolean =>
  Object.keys(shiftsData || {}).length > 1;

export const initShiftsData = (options: TPropOptions, data: TShiftGroupedData | null): TPropOptions => {
  if (!options?.data) {
    options.data = {
      shifts: { ...data },
    };
  }

  if (!options?.state?.shifts) {
    options.state = {
      shifts: {
        data: { ...data },
        hasMultipleShiftGroups: false,
      },
    };
  }

  options.data.shifts = { ...data };
  options.state.shifts.data = { ...data };
  options.state.shifts.hasMultipleShiftGroups = hasMultipleShiftGroups({ ...data });

  return options;
};

export const composeGroupUUIDSelectOptions = (shiftGroups: TShiftGroupedData | null): TPanelSelectOption[] | [] => {
  if (!shiftGroups) {
    return [];
  }

  return Object.values(shiftGroups).reduce((options, shiftGroup) => {
    return [
      ...options,
      {
        label: `${shiftGroup.label} (${shiftGroup.uuid})`,
        value: shiftGroup.uuid,
      },
    ];
  }, [] as TPanelSelectOption[]);
};

export const composeShiftUUIDSelectOptions = (shiftGroup: TShiftGroupedData['uuid']): TPanelSelectOption[] | [] => {
  if (!shiftGroup) {
    return [];
  }

  return { ...shiftGroup }.shifts.reduce((options, shift) => {
    return [
      ...options,
      {
        label: `${shift.label} (${shift.uuid})`,
        value: shift.uuid,
      },
    ];
  }, [] as TPanelSelectOption[]);
};

export const setShiftStates = (
  shiftGroup: TShiftGroupedData['uuid'],
  options: TPropOptions
): TShiftGroupedData['uuid'] => {
  let currentTime = options.settings.time?.current;

  if (!currentTime) {
    currentTime = getTimeObject(new Date());
  }

  let shifts = shiftGroup.shifts.map((shift) => {
    shift = {
      ...shift,
      isNextDay: isNextDay(shift),
    };

    shift.isActive = isActiveShift(shift, currentTime);

    if (options.settings.time?.isEndToNow && shift.isActive) {
      shift.prevEnd = shift.end;
      shift.end = getTimeObject(new Date());
    }

    return shift;
  });

  const hasMultipleActiveShifts = shifts.filter(({ isActive }) => isActive).length > 1;

  if (hasMultipleActiveShifts) {
    shiftGroup.hasMultipleActiveShifts = true;

    shifts = markClosestActiveShift(shifts, currentTime);
  }

  shiftGroup.shifts = shifts;
  shiftGroup.hasNextDayShifts = shifts.some(({ isNextDay }) => isNextDay);

  return shiftGroup;
};

export const isActiveShift = (shift: TShift, currentTime: TTimeObject): boolean => {
  if (!shift.start || !shift.end) {
    return false;
  }

  const startDateShift = new Date(timeObjectToUnix(shift.start));
  const endDateShift = new Date(timeObjectToUnix(shift.end, { isNextDay: shift.isNextDay }));
  const currentDate = new Date(timeObjectToUnix(currentTime));

  if (shift.isNextDay && currentTime.hour >= shift.end.hour) {
    endDateShift.setDate(endDateShift.getDate() + 1);
  } else if (shift.isNextDay && currentTime.hour <= shift.end.hour) {
    startDateShift.setDate(startDateShift.getDate() - 1);
  }

  return +currentDate >= +startDateShift && +currentDate < +endDateShift;
};

export const isUpcomingShift = (
  shiftGroup: TShiftGroupedData['uuid'],
  shift: TShift,
  currentTime: TTimeObject
): boolean => {
  if (shift.start && shift.end) {
    const startDateShift = new Date(timeObjectToUnix(shift.start));
    const endDateShift = new Date(timeObjectToUnix(shift.end));
    const nowDate = new Date(timeObjectToUnix(currentTime));

    const isNextDayShiftActive = shiftGroup.shifts.some(({ isNextDay, isActive }) => isNextDay && isActive);

    if (!shift.isNextDay) {
      if (currentTime.hour >= shift.start.hour) {
        startDateShift.setDate(startDateShift.getDate() - 1);
      } else if (shiftGroup.hasNextDayShifts) {
        if (isNextDayShiftActive) {
          return false;
        }
      }
    } else {
      endDateShift.setDate(endDateShift.getDate() + 1);

      if (isNextDayShiftActive && currentTime.hour <= shift.start.hour) {
        nowDate.setDate(nowDate.getDate() + 1);
      }

      if (+startDateShift >= +nowDate && +endDateShift >= +nowDate) {
        startDateShift.setDate(startDateShift.getDate() + 1);
        // } else if (shift.start.hour >= currentTime.hour && shift.end.hour <= currentTime.hour) {
        //   return false;
      } else if (+startDateShift >= +nowDate && +endDateShift <= +nowDate) {
        return false;
      } else {
        return false;
      }
    }

    return +startDateShift > +nowDate;
  }

  return false;
};

export function sortShifts<T>(shifts: T[], sortKey: keyof T): T[] {
  if (!shifts.length) {
    return shifts;
  }

  return shifts.sort((a, b) => {
    const aStart = a as unknown as T & { order: number };
    const bStart = b as unknown as T & { order: number };

    return compareNumbersWithAlts(
      [timeStringToUnix(aStart[sortKey] as TTimeString) ?? 0, aStart.order, 99],
      [timeStringToUnix(bStart[sortKey] as TTimeString) ?? 0, bStart.order, 99]
    );
  });
}

type TShiftSortNumbers = [number, number, number];

export const compareNumbersWithAlts = (a: TShiftSortNumbers, b: TShiftSortNumbers) => {
  if (a.length < 3 || b.length < 3) {
    throw new Error('Both arrays must have at least 3 elements representing startTime, order, and fallback value.');
  }

  const [time, order, fallback] = [0, 1, 2];

  if (a[time] !== b[time]) {
    return a[time] - b[time];
  }

  if (a[order] !== b[order]) {
    return a[order] - b[order];
  }

  return a[fallback] - b[fallback];
};

export const markClosestActiveShift = (shifts: TShift[], currentTime: TTimeObject | null): TShift[] => {
  if (shifts.length <= 1) {
    return shifts;
  }

  currentTime = currentTime || getTimeObject(new Date());
  const firstActiveShiftIndex = shifts.findIndex(({ isActive }) => isActive);
  const currentUnix = timeObjectToUnix(currentTime);
  const closestShiftIndex = shifts.reduce((closestIndex, shift, index) => {
    if (currentTime && shift.isActive && shift.start && shift.end && shifts[closestIndex].start) {
      const [startUnix, endUnix] = [
        timeObjectToUnix(shift.start),
        timeObjectToUnix(shift.end, { isNextDay: shift.isNextDay }),
      ];

      const startDateShift = new Date(startUnix);
      const endDateShift = new Date(endUnix);

      if (shift.isNextDay && currentTime.hour >= shift.end.hour) {
        endDateShift.setDate(endDateShift.getDate() + 1);
      } else if (shift.isNextDay && currentTime.hour <= shift.end.hour) {
        startDateShift.setDate(startDateShift.getDate() - 1);
      }

      if (!shifts[closestIndex].start) {
        return closestIndex;
      }

      const closestTime = timeObjectToUnix(shifts[closestIndex].start as TTimeObject);

      return Math.abs(+startDateShift - currentUnix) < Math.abs(closestTime - currentUnix) ? index : closestIndex;
    }

    return closestIndex;
  }, firstActiveShiftIndex);

  const activeShifts = shifts.filter(({ isActive }) => isActive);

  if (activeShifts.length > 1) {
    activeShifts.sort((a, b) => {
      if (a.end && b.end && a.start && b.start) {
        const aEnd = timeObjectToUnix(a.end, { isNextDay: a.isNextDay });
        const bEnd = timeObjectToUnix(b.end, { isNextDay: b.isNextDay });
        const aStart = timeObjectToUnix(a.start);
        const bStart = timeObjectToUnix(b.start);

        if (aEnd !== bEnd) {
          return aEnd - bEnd;
        }

        return bStart - aStart;
      }

      return 0;
    });

    const closestActiveShift = activeShifts[0];
    const closestActiveShiftIndex = shifts.findIndex(({ uuid }) => uuid === closestActiveShift.uuid);
    shifts[closestActiveShiftIndex].isClosest = true;
  } else if (closestShiftIndex >= 0) {
    shifts[closestShiftIndex].isClosest = true;
  }

  return shifts;
};
