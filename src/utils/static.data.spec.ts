import { propStaticOptions } from '../tests/props';
import { testShiftData } from '../tests/stub.data';
import { processProps } from './props';
import { initShiftsData } from './shift';
import { parseStaticData } from './static.data';
import { getTimeNowObject, getTimeObject, setCurrentDateTime } from './time';

describe('Static Shift Data', () => {
  it('should parse static data correctly', () => {
    let propOptions = processProps(propStaticOptions);

    testShiftData['uuid_1'].hasNextDayShifts = testShiftData['uuid_1'].shifts.some(({ isNextDay }) => isNextDay);
    testShiftData['uuid_1'].shifts[0].isActive = false;
    testShiftData['uuid_2'].shifts[0].isActive = true;
    propOptions = setCurrentDateTime(propOptions, new Date('2000-01-01 15:00'));
    propOptions.settings.time.isEndToNow = false;

    const staticShiftData = parseStaticData(propOptions);
    propOptions = initShiftsData(propOptions, staticShiftData);

    expect(staticShiftData).toStrictEqual({
      ...testShiftData,
      ['uuid_2']: {
        ...testShiftData['uuid_2'],
        hasNextDayShifts: testShiftData['uuid_2'].shifts.some(({ isNextDay }) => isNextDay),
        activeShift: testShiftData['uuid_2'].shifts[0].uuid,
      },
    });
    expect(propOptions.state.shifts.hasMultipleShiftGroups).toBeTruthy();
  });

  it('should filter only group: uuid_1', () => {
    let propOptions = { ...propStaticOptions };
    propOptions.settings.dataSource.filter.group = 'uuid_1';
    propOptions.settings.time.isEndToNow = true;
    propOptions = processProps(propOptions);
    propOptions = setCurrentDateTime(propOptions, new Date('2000-01-01 09:05'));

    const staticData = parseStaticData(propOptions);
    propOptions = initShiftsData(propOptions, staticData);

    expect(parseStaticData(propOptions)).toStrictEqual({
      ['uuid_1']: {
        ...testShiftData['uuid_1'],
        activeShift: testShiftData['uuid_1'].shifts[0].uuid,
        shifts: [
          {
            ...testShiftData['uuid_1'].shifts[0],
            isActive: true,
            end: getTimeNowObject(propOptions),
            prevEnd: testShiftData['uuid_1'].shifts[0].end,
          },
        ],
      },
    });

    const staticUUID1Data = parseStaticData(propOptions);
    propOptions = initShiftsData(propOptions, staticUUID1Data);

    expect(staticUUID1Data?.['uuid_2']).toBeUndefined();
    expect(propOptions.state.shifts.hasMultipleShiftGroups).toBeFalsy();
  });

  it('should change the end time of active shift when isEndToNow=true', () => {
    let propOptions = { ...propStaticOptions };
    propOptions.settings.dataSource.filter.group = '';
    propOptions.settings.time.isEndToNow = true;
    propOptions = processProps(propOptions);
    propOptions = setCurrentDateTime(propOptions, new Date('2000-01-01 09:00'));

    const staticData = parseStaticData(propOptions);
    propOptions = initShiftsData(propOptions, staticData);

    if (propOptions.state.shifts.data?.['uuid_1']) {
      const activeShiftGroup = propOptions.state.shifts.data['uuid_1'];
      const activeShift = activeShiftGroup.shifts.find(({ uuid }) => activeShiftGroup.activeShift === uuid);
      const upcomingShifts = activeShiftGroup.shifts.find(
        ({ isActive, start }) => !isActive && start && start?.hour > getTimeObject().hour
      );

      expect(activeShiftGroup.activeShift).toBe('shift_uuid_1');
      expect(propOptions.state.shifts.hasMultipleShiftGroups).toBeTruthy();
      expect(activeShift?.end).toStrictEqual(getTimeNowObject(propOptions));
      expect(upcomingShifts).toBeUndefined();
    }
  });

  it('should should disable upcoming shifts when isEndToNow=true', () => {
    let propOptions = { ...propStaticOptions };
    propOptions.settings.dataSource.filter.group = 'uuid_2';
    propOptions.settings.time.isEndToNow = true;
    propOptions = processProps(propOptions);
    propOptions = setCurrentDateTime(propOptions, new Date('2000-01-01 15:00'));

    const staticData = parseStaticData(propOptions);
    propOptions = initShiftsData(propOptions, staticData);

    if (propOptions.state.shifts.data?.['uuid_2']) {
      const activeShiftGroup = propOptions.state.shifts.data['uuid_2'];
      const activeShift = activeShiftGroup.shifts.find(({ uuid }) => activeShiftGroup.activeShift === uuid);
      const upcomingShifts = activeShiftGroup.shifts.filter(
        ({ isActive, start }) => !isActive && start && start?.hour >= propOptions.settings.time.current.hour
      );
      const disabledShifts = activeShiftGroup.shifts.filter(({ isDisabled }) => isDisabled);

      expect(activeShiftGroup.activeShift).toBe('shift_uuid_2');
      expect(propOptions.state.shifts.hasMultipleShiftGroups).toBeFalsy();
      expect(activeShift?.end).toStrictEqual(getTimeNowObject(propOptions));
      expect(upcomingShifts).toStrictEqual(disabledShifts);
    }
  });
});
