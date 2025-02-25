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

export const getTimeNowObject = (options: TPropOptions): TTimeObject => {
  if (!!options.ui.element.time.input.value) {
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

  options.ui.element.time.input.value = time as string;
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
  let date = new Date();

  if (options?.isNextDay) {
    date.setDate(date.getDate() + 1);
  } else if (options?.isPrevDay) {
    date.setDate(date.getDate() - 1);
  }

  date.setHours(time.hour, time.minute);

  return +date;
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
