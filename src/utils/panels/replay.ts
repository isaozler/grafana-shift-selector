import { TPropOptions } from '../../types';
import { getDateByTimeObject, getTimeObject, TTimeObject } from '../time';

type TTimeUnit = TPropOptions['ui']['element']['replay']['time']['unit'];
type TMaxTimeSettings = TPropOptions['ui']['element']['replay']['maxTime'];

export const changeMaxTimeSettings = (unit: TTimeUnit): Omit<TMaxTimeSettings, 'value'> => {
  if (unit === 'hours') {
    return {
      min: 0,
      max: 24,
      step: 1,
    };
  } else {
    return {
      min: 0,
      max: 55,
      step: 5,
    };
  }
};

export const addTimeUnitsToCurrentTime = (
  currentTime: TTimeObject,
  additionalTimeUnit: TTimeUnit,
  addValue: number
) => {
  const date = getDateByTimeObject(currentTime);
  const startDateDay = date.getDay();

  if (additionalTimeUnit === 'hours' && addValue) {
    if (currentTime.hour + addValue === 24) {
      date.setDate(date.getDate() + 1);
      date.setHours(0, currentTime.minute);
    } else {
      date.setHours(currentTime.hour + addValue);
    }
  } else if (additionalTimeUnit === 'hours' && addValue === 0) {
    date.setHours(currentTime.hour, currentTime.minute);
  } else if (additionalTimeUnit === 'minutes' && addValue) {
    if (currentTime.minute + addValue > 59) {
      const diff = Math.abs(addValue - 60);
      date.setHours(currentTime.hour + 1, diff);
    } else {
      date.setMinutes(currentTime.minute + addValue);
    }
  }

  return {
    isNextDay: startDateDay !== date.getDay(),
    time: getTimeObject(date),
  };
};

export const roundToNearestFive = (value: number) => {
  const remainder = value % 5;

  if (remainder === 0) {
    return value;
  }

  return remainder < 2.5 ? value - remainder : value + (5 - remainder);
};
