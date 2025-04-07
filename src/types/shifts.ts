import type { TPropOptions } from '../types';
import type { TTimeString } from '../utils/time';
import type { TTimeObject } from './time';

export type TShiftGroup = {
  label: string;
  uuid: string;
  activeShift: TShift['uuid'] | null;
  shifts: TShift[];
  hasNextDayShifts?: boolean;
  hasMultipleActiveShifts?: boolean;
};

export type TShiftGroupedData = {
  [key: string]: TShiftGroup;
};

export type TShift = {
  uuid: string;
  label: string;
  start: TTimeObject | null;
  end: TTimeObject | null;
  prevEnd?: TTimeObject | null;
  isNextDay?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
  isClosest?: boolean;
  order?: number;
};

export type TRawShift = {
  uuid: string;
  label: string;
  startTime: TTimeString;
  endTime: TTimeString;
  order?: number;
};

export type TRawStaticShift = TRawShift & {
  group: string;
  group_uuid: string;
};

export type TStaticRawData = TPropOptions['settings']['dataSource']['static']['data'];

export type TPanelSelectOption = {
  label: string;
  value: string;
  description?: string;
  isDisabled?: boolean;
  ariaLabel?: string;
};
