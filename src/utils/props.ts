import { TPropOptions } from '../types';
import { formatToDate, getTimeNowObject } from './time';

const setTimeSettings = (options: TPropOptions): TPropOptions['settings']['time'] => {
  return {
    current: getTimeNowObject(options),
    isRealTime: options.ux.realtime.shift.isAutoSelect,
    isEndToNow: options.ux.realtime.shift.isEndToNow,
    relativeTo: options.ui.element.date.input.value || formatToDate(),
    refreshInterval: options.ux.realtime.shift.refreshInterval,
  };
};

export const processProps = (options: TPropOptions): TPropOptions => {
  if (!options.ui.element.date.input.isVisible) {
    options.ui.element.date.input.value = '';
  }

  options.settings.time = setTimeSettings(options);

  return options;
};
