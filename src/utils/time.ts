import { TPropOptions } from '../types';
import type { TShift } from '../types/shifts';
import { TUnixTimeOptions } from '../types/time';

export type TTimeString = `${number}:${number}:${number}` | `${number}:${number}`;
export type TTimeObject = {
  hour: number;
  minute: number;
};

const isTimeString = (time: string) =>
  new RegExp(/^\d{2}:\d{2}:\d{2}$/).test(time) || new RegExp(/^\d{2}:\d{2}$/).test(time);

export const getTimeObject = (datetime = new Date()): TTimeObject => {
  const hour = datetime.getHours();
  const minute = datetime.getMinutes();

  return {
    hour,
    minute,
  };
};

export const getDateByTimeObject = (currentTime: TTimeObject): Date => {
  const date = new Date();

  if (currentTime.hour && currentTime.minute) {
    date.setHours(currentTime.hour, currentTime.minute);
  }

  return date;
};

export const getDateByTimeObjectByContext = (
  options: TPropOptions,
  shift: TShift
): {
  startDate: Date;
  endDate: Date | string;
} => {
  const isFixedTime = options.ux.time.isFixed;
  const currentTime = !isFixedTime ? getTimeObject() : options.settings.time.current;
  const productionDate =
    options.ui.element.date.input.value && options.ui.element.date.input.isVisible
      ? new Date(options.ui.element.date.input.value)
      : new Date();

  let startDate: Date;
  let endDate: Date | string = 'now';

  if (!isFixedTime && shift.start) {
    startDate = new Date(productionDate.setHours(shift.start.hour, shift.start.minute, 0, 0));
  } else {
    startDate = new Date(productionDate.setHours(currentTime.hour, currentTime.minute, 0, 0));
  }

  if (shift.isNextDay && shift.isActive) {
    startDate = new Date(productionDate.setDate(productionDate.getDate() - 1));
  }

  if (endDate === 'now' && !options.settings.time.relativeTo) {
    endDate = new Date();
  } else if (
    shift.end &&
    ((endDate === 'now' && options.settings.time.relativeTo) || (!options.ux.realtime.shift.isEndToNow && shift.end))
  ) {
    if (shift.isNextDay) {
      productionDate.setDate(productionDate.getDate() + 1);
    }

    endDate = new Date(productionDate.setHours(shift.end.hour, shift.end.minute, 0, 0));
  }

  return {
    startDate: startDate,
    endDate: endDate,
  };
};

export const getTimeNowObject = (options: TPropOptions): TTimeObject => {
  if (options.ui.element.time.input.value && options.ux.time.isFixed) {
    const inputTime = parseTime(options.ui.element.time.input.value as TTimeString);

    if (inputTime) {
      return inputTime;
    }
  }

  return getTimeObject();
};

export const setCurrentDateTime = (options: TPropOptions, currentDateTime = new Date()): TPropOptions => {
  options.settings.time.current = getTimeObject(currentDateTime);

  const time = stringifyTime(options.settings.time.current) as string;

  options.ui.element.time.input.value = time;
  options.ux.time.isFixed = true;
  return options;
};

export const parseTime = (time: TTimeString): TTimeObject | null => {
  if (!isTimeString(time)) {
    return null;
  }

  const [hour, minute] = time.split(':');

  return {
    hour: parseInt(hour, 10),
    minute: parseInt(minute, 10),
  };
};

export const stringifyTime = (time: TTimeObject): TTimeString | null => {
  if (time.hour === null || time.minute === null) {
    return null;
  }

  return Object.values(time)
    .map((n) => String(n).padStart(2, '0'))
    .join(':') as TTimeString;
};

export const isNextDay = (shift: TShift | Omit<TShift, 'isNextDay'>): boolean => {
  if (shift.end?.hour && shift.start?.hour) {
    if (
      shift.end.hour < shift.start.hour ||
      (shift.end.hour === shift.start.hour && shift.end.minute < shift.start.minute)
    ) {
      return true;
    }
  }

  return false;
};

export const formatToDate = (date = new Date()): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return [year, month, day].join('-');
};

export const timeObjectToUnix = (time: TTimeObject, options?: TUnixTimeOptions): number => {
  let date = options?.date ?? new Date();

  if (options?.isNextDay) {
    date.setDate(date.getDate() + 1);
  } else if (options?.isPrevDay) {
    date.setDate(date.getDate() - 1);
  }

  date.setHours(time.hour, time.minute);

  return +date;
};

export const getNowDate = (date: string | TTimeObject, options: TPropOptions): Date => {
  const newDate =
    options.ui.element.date.input.value && options.ui.element.date.input.isVisible
      ? new Date(options.ui.element.date.input.value)
      : new Date();

  if (typeof date === 'string') {
    const currentTime = new Date();
    newDate.setHours(currentTime.getHours(), currentTime.getMinutes());
    return newDate;
  }

  newDate.setHours(date.hour, date.minute);

  return newDate;
};

export const calculateShiftProgress = (shift: TShift, options: TPropOptions | null): number => {
  if (!shift.start || !shift.end || !options) {
    return 0;
  }

  const now = getNowDate(options.settings.time.current, options).getTime();

  const { startDate, endDate } = getDateByTimeObjectByContext(options, shift);
  const start = startDate.getTime();
  const end = typeof endDate === 'string' ? now : endDate.getTime();

  if (now < start) {
    return 0;
  }
  if (now > end) {
    return 100;
  }

  const totalDuration = end - start;
  const currentDuration = now - start;
  return (currentDuration * 100) / totalDuration;
};

export const timeStringToUnix = (time: TTimeString | null): number | null => {
  if (!time || !isTimeString(time)) {
    return null;
  }

  const [hour, minute] = time.split(':').map((value) => parseInt(value, 10));

  return timeObjectToUnix({
    hour,
    minute,
  });
};
