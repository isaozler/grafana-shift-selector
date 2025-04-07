import type { TGlobalData } from '../../types';
import { addTimeUnitsToCurrentTime, roundToNearestFive } from './replay';

export const processGlobalProps = (globalData: TGlobalData): TGlobalData => {
  return /* syncShifts( */ resetFixedTime(resetRelativeTime(setReplayProps(globalData))) /* ) */;
};

export const resetFixedTime = (globalData: TGlobalData): TGlobalData => {
  if (!globalData.options?.ux.time.isFixed && globalData.options?.ui.element.time.input.value) {
    globalData.options.ui.element.time.input.value = '';
  }

  return globalData;
};

export const resetRelativeTime = (globalData: TGlobalData): TGlobalData => {
  if (!globalData.options?.ui.element.date.input.isVisible && !!globalData.options?.settings.time.relativeTo) {
    globalData.options.settings.time.relativeTo = '';
  }

  return globalData;
};

export const setReplayProps = (globalData: TGlobalData): TGlobalData => {
  if (globalData.options?.settings?.time?.current && globalData.options?.ui?.element?.replay?.maxTime?.value >= 0) {
    if (
      globalData.options?.ui?.element?.replay?.time?.unit === 'hours' &&
      globalData.options?.ui?.element?.replay?.maxTime?.value > 24
    ) {
      globalData.options.ui.element.replay.maxTime.value = 24;
    } else if (globalData.options?.ui?.element?.replay?.time?.unit === 'minutes') {
      globalData.options.ui.element.replay.maxTime.value = roundToNearestFive(
        globalData.options.ui.element.replay.maxTime.value
      );
    }

    const { isNextDay, time } = addTimeUnitsToCurrentTime(
      globalData.options.settings.time.current,
      globalData.options?.ui?.element?.replay?.time?.unit || 'hours',
      globalData.options?.ui?.element?.replay?.maxTime?.value || 0
    );
    globalData.options.ui.element.replay.time.isNextDay = isNextDay;
    globalData.options.ui.element.replay.time.end = time;
  }

  return globalData;
};

export const toCamelCase = (str: string): string => {
  return str
    .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''))
    .replace(/^[a-z]/, (firstLetter) => firstLetter.toUpperCase());
};

export const flattenKeysWithValues = (obj: Record<string, any>, prefix = ''): Record<string, string> => {
  return Object.keys(obj).reduce<Record<string, string>>((acc, key) => {
    const camelCasedKey = prefix ? `${prefix}${toCamelCase(key)}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && typeof obj[key] !== 'function') {
      Object.assign(acc, flattenKeysWithValues(obj[key], camelCasedKey));
    } else {
      acc[camelCasedKey] = obj[key];
    }

    return acc;
  }, {});
};

export const checkIfIsDirty = (obj: Record<string, any>, original: Record<string, any>): boolean => {
  return Object.keys(obj).some((key) => obj[key] !== original[key]);
};
