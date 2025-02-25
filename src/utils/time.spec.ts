import { propStaticOptions } from '../tests/props';
import { processProps } from './props';
import { initShiftsData } from './shift';
import { parseStaticData } from './static.data';
import { formatToDate, setCurrentDateTime } from './time';

describe('Parse Time Data', () => {
  it('should parse start and end time correctly', () => {
    const groupUUID1 = 'uuid_1';
    propStaticOptions.settings.dataSource.filter.group = groupUUID1;

    const staticShiftData = parseStaticData(propStaticOptions);

    if (staticShiftData?.[groupUUID1]) {
      const groupUUID1Data = staticShiftData[groupUUID1];
      const [firstShift] = groupUUID1Data.shifts;

      expect(firstShift.start).toStrictEqual({
        hour: 6,
        minute: 0,
      });
      expect(firstShift.end).toStrictEqual({
        hour: 14,
        minute: 0,
      });
    }
  });

  it('should process isNextDay correctly', () => {
    let propOptions = processProps(propStaticOptions);
    propOptions.settings.dataSource.filter.group = '';

    const staticShiftData = parseStaticData(propOptions);
    propOptions = initShiftsData(propStaticOptions, staticShiftData);

    expect(staticShiftData?.uuid_1.shifts[0].isNextDay).toBeFalsy();
    expect(staticShiftData?.uuid_2.shifts[1].isNextDay).toBeTruthy();
  });

  it('should format date correctly', () => {
    const date = new Date('2024-07-31');

    expect(formatToDate(date)).toBe('2024-07-31');
  });

  it('should set current time correctly 9:01', () => {
    let processedProps = processProps(propStaticOptions);
    processedProps = setCurrentDateTime(processedProps, new Date('2000-01-01 9:01'));

    const expectedCurrentTime = {
      hour: 9,
      minute: 1,
    };

    expect(processedProps.settings).toStrictEqual({
      ...processedProps.settings,
      time: {
        ...processedProps.settings.time,
        current: expectedCurrentTime,
      },
    });
  });

  it('should set current time correctly 14:30', () => {
    let processedProps = processProps(propStaticOptions);
    processedProps = setCurrentDateTime(processedProps, new Date('2000-01-01 14:30'));

    const expectedCurrentTime = {
      hour: 14,
      minute: 30,
    };

    expect(processedProps.settings).toStrictEqual({
      ...processedProps.settings,
      time: {
        ...processedProps.settings.time,
        current: expectedCurrentTime,
      },
    });
  });

  it('should set current time correctly 23:59', () => {
    let processedProps = processProps(propStaticOptions);
    processedProps = setCurrentDateTime(processedProps, new Date('2000-01-01 23:59'));

    const expectedCurrentTime = {
      hour: 23,
      minute: 59,
    };

    expect(processedProps.settings).toStrictEqual({
      ...processedProps.settings,
      time: {
        ...processedProps.settings.time,
        current: expectedCurrentTime,
      },
    });
  });
});
