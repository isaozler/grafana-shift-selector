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
  } else {
    options.ui.element.date.input.value = options.ui.element.date.input.value || formatToDate();
  }

  options.settings.time = setTimeSettings(options);

  if (options.ux.time.isFixed && !options.ux.realtime.shift.isEndToNow) {
    options.ux.realtime.shift.isAutoSelect = false;
    options.ux.realtime.shift.isEndToNow = false;
    options.ux.realtime.shift.isCustomRefreshInterval = false;
    options.ux.realtime.shift.refreshInterval = 0;
    options.ui.element.progressBar.isVisible = false;
  }

  return options;
};
