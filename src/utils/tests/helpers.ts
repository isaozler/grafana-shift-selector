import { TRawShift, TStaticRawData } from '../../types/shifts';

export const appendShiftToStaticData = (shiftData: TStaticRawData, ...rawShifts: TRawShift[]): TRawShift[] => {
  const tempData = JSON.parse(shiftData);

  return [...tempData, ...rawShifts];
};

export const appendShiftToStaticDataAsString = (shiftData: TStaticRawData, ...rawShifts: TRawShift[]): string => {
  try {
    return JSON.stringify(appendShiftToStaticData(shiftData, ...rawShifts));
  } catch (error) {
    console.error(error);
    return '';
  }
};
