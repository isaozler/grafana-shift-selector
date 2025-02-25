import { TPropOptions } from '../types';
import type { TRawStaticShift, TShift, TShiftGroupedData } from '../types/shifts';
import { isUpcomingShift, setShiftStates, sortShifts } from './shift';
import { getTimeObject, parseTime } from './time';

export const parseStaticData = (options: TPropOptions): TShiftGroupedData | null => {
  try {
    let data = JSON.parse(options.settings.dataSource.static.data);
    data = groupShiftsByGroup(data, options.settings.dataSource.filter, options);

    if (options.settings?.time?.isEndToNow) {
      data = disableUpcomingShifts(data, options);
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const disableUpcomingShifts = (data: TShiftGroupedData, options: TPropOptions): TShiftGroupedData => {
  return Object.keys(data).reduce((res, groupKey) => {
    return {
      ...res,
      [groupKey]: {
        ...data[groupKey],
        shifts: data[groupKey].shifts.map((shift) => {
          if (
            !shift.isActive &&
            isUpcomingShift(data[groupKey] as TShiftGroupedData['uuid'], shift, options.settings.time.current)
          ) {
            return {
              ...shift,
              isDisabled: true,
            };
          }

          return shift;
        }),
      },
    };
  }, {} as TShiftGroupedData);
};

const groupShiftsByGroup = (
  shifts: TRawStaticShift[],
  { group: filterGroup, shifts: filterShifts }: TPropOptions['settings']['dataSource']['filter'],
  options: TPropOptions
): TShiftGroupedData => {
  const shiftGroup = sortShifts<TRawStaticShift>(shifts, 'startTime').reduce((acc, shift, index) => {
    if (!!filterGroup && shift.group_uuid !== filterGroup) {
      return acc;
    }

    const { group_uuid, group } = shift;

    if (!acc[group_uuid]) {
      acc[group_uuid] = {
        label: group,
        uuid: group_uuid,
        activeShift: null,
        shifts: [],
      };
    }

    const shiftData: TShift = {
      uuid: shift.uuid,
      label: shift.label,
      start: parseTime(shift.startTime),
      end: parseTime(shift.endTime),
      order: shift.order ?? index,
    };

    if (filterShifts?.includes(shift.uuid) || !filterShifts?.length) {
      acc[group_uuid].shifts.push(shiftData);
    }

    return acc;
  }, {} as TShiftGroupedData);

  return Object.keys(shiftGroup).reduce((acc, groupUUID) => {
    let shiftGroupData = setShiftStates(shiftGroup[groupUUID], options);
    let activeShiftData: TShift | null = null;
    let activeShift: TShift['uuid'] | null = null;

    if (shiftGroupData.hasMultipleActiveShifts) {
      activeShiftData = shiftGroupData.shifts.find(({ isActive, isClosest }) => isActive && isClosest) ?? null;
    } else {
      activeShiftData = shiftGroupData.shifts.find(({ isActive }) => isActive) ?? null;
    }

    activeShift = activeShiftData?.uuid ?? null;

    shiftGroupData = {
      ...shiftGroupData,
      shifts: shiftGroupData.shifts.map((shift) => {
        if (shift?.isActive && options.settings.time?.isEndToNow) {
          if (options.ui.element.time.input.value) {
            shift.end = options.settings.time.current;
          } else {
            shift.end = getTimeObject();
          }
        }

        return shift;
      }),
    };

    return {
      ...acc,
      [groupUUID]: {
        ...shiftGroupData,
        activeShift,
      },
    };
  }, {} as TShiftGroupedData);
};
