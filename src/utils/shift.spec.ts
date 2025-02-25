import { propStaticOptions } from '../tests/props';
import { testShiftData, staticShiftData } from '../tests/stub.data';
import type { TRawStaticShift } from '../types/shifts';
import { processProps } from './props';
import { hasMultipleShiftGroups, initShiftsData } from './shift';
import { parseStaticData } from './static.data';
import { appendShiftToStaticDataAsString } from './tests/helpers';
import { parseTime, setCurrentDateTime } from './time';

describe('Shift Processes', () => {
  it('should initialize shifts data correctly', () => {
    const updatedDataWithShifts = initShiftsData(propStaticOptions, testShiftData);

    expect(updatedDataWithShifts.state?.shifts.data).toStrictEqual(testShiftData);
  });

  it('should evaluate shift group counts correctly', () => {
    expect(hasMultipleShiftGroups(propStaticOptions.state?.shifts.data || null)).toBeTruthy();
    expect(propStaticOptions.state.shifts.hasMultipleShiftGroups).toBeTruthy();
  });

  it('should evaluate shift group count correctly', () => {
    const singleShiftGroup = {
      ...propStaticOptions.state?.shifts.data,
    };

    delete singleShiftGroup['uuid_2'];

    const updatedDataWithShifts = initShiftsData(propStaticOptions, singleShiftGroup);

    expect(hasMultipleShiftGroups(singleShiftGroup)).toBeFalsy();
    expect(updatedDataWithShifts.state.shifts.hasMultipleShiftGroups).toBeFalsy();
  });

  it('should process filtered shifts correctly', () => {
    const groupUUID = 'uuid_2';
    const shiftUUIDs = ['shift_uuid_3'];

    let propOptions = processProps(propStaticOptions);
    propOptions.settings.time.isEndToNow = false;
    propOptions.settings.dataSource.filter.group = groupUUID;
    propOptions.settings.dataSource.filter.shifts = shiftUUIDs;
    propOptions = setCurrentDateTime(propOptions, new Date('2000-01-01 15:00'));

    const _staticShiftData = parseStaticData(propOptions);
    const shifts = testShiftData[groupUUID].shifts.filter(({ uuid }) => shiftUUIDs.includes(uuid));

    propOptions = initShiftsData(propOptions, _staticShiftData);

    expect(_staticShiftData).toStrictEqual({
      [groupUUID]: {
        ...testShiftData[groupUUID],
        hasNextDayShifts: shifts.some(({ isNextDay }) => isNextDay),
        shifts,
      },
    });

    expect(hasMultipleShiftGroups(propOptions.state?.shifts.data || null)).toBeFalsy();
    expect(propOptions.state.shifts.hasMultipleShiftGroups).toBeFalsy();
    expect(propOptions.state.shifts.data?.[groupUUID].activeShift).toBeNull();

    if (propOptions.state?.shifts.data && propOptions.data?.shifts?.[groupUUID]) {
      const filteredShiftGroup = propOptions.data.shifts[groupUUID];
      filteredShiftGroup.shifts = filteredShiftGroup.shifts.filter(({ uuid }) => shiftUUIDs.includes(uuid));
      filteredShiftGroup.hasNextDayShifts = filteredShiftGroup.shifts.some(({ isNextDay }) => isNextDay);
      expect(propOptions.state.shifts.data).toStrictEqual({
        [groupUUID]: filteredShiftGroup,
      });
    }
  });

  it('should mark shifts correctly with overlapping end and start time', () => {
    const groupUUID = 'uuid_2';

    const morningShift: TRawStaticShift = {
      group: 'Group 2 eg. Morning',
      group_uuid: 'uuid_2',
      uuid: 'shift_uuid_0',
      label: 'Morning Custom',
      startTime: '06:00:00',
      endTime: '14:00:00',
      order: 1,
    };
    propStaticOptions.settings.dataSource.static.data = appendShiftToStaticDataAsString(
      propStaticOptions.settings.dataSource.static.data,
      morningShift
    );

    let propOptions = processProps(propStaticOptions);
    propOptions.settings.time.isEndToNow = false;
    propOptions.settings.dataSource.filter.group = groupUUID;
    propOptions.settings.dataSource.filter.shifts = [];
    propOptions = setCurrentDateTime(propOptions, new Date('2000-01-01 14:00'));

    const _staticShiftData = parseStaticData(propOptions);
    propOptions = initShiftsData(propOptions, _staticShiftData);
    const shifts = propOptions.state?.shifts.data?.[groupUUID].shifts;
    const afternoonShift = shifts?.find(({ uuid }) => uuid === 'shift_uuid_2');

    expect(shifts?.[0].uuid).toBe(morningShift.uuid);
    expect(shifts?.[0].isActive).toBeFalsy();
    expect(afternoonShift?.isActive).toBeTruthy();
  });

  it('should mark closest and active flags for shifts properly', () => {
    const groupUUID = 'uuid_2';

    const morningShift1: TRawStaticShift = {
      group: 'Group 2 eg. Morning',
      group_uuid: 'uuid_2',
      uuid: 'shift_uuid_4',
      label: 'Morning 1 Custom',
      startTime: '04:00:00',
      endTime: '11:00:00',
      order: 1,
    };
    const morningShift2: TRawStaticShift = {
      group: 'Group 2 eg. Morning',
      group_uuid: 'uuid_2',
      uuid: 'shift_uuid_5',
      label: 'Morning 2 Custom',
      startTime: '06:00:00',
      endTime: '14:00:00',
      order: 0,
    };
    propStaticOptions.settings.dataSource.static.data = appendShiftToStaticDataAsString(
      staticShiftData,
      morningShift1,
      morningShift2
    );

    let propOptions = processProps(propStaticOptions);
    propOptions.settings.time.isEndToNow = true;
    propOptions.settings.dataSource.filter.group = groupUUID;
    propOptions.settings.dataSource.filter.shifts = [];
    propOptions = setCurrentDateTime(propOptions, new Date('2000-01-01 09:05'));

    const _staticShiftData = parseStaticData(propOptions);
    propOptions = initShiftsData(propOptions, _staticShiftData);
    const shifts = propOptions.state?.shifts.data?.[groupUUID].shifts;

    const _morningShift1 = shifts?.find(({ uuid }) => uuid === 'shift_uuid_4');
    const _morningShift2 = shifts?.find(({ uuid }) => uuid === 'shift_uuid_5');
    const _afternoonShift = shifts?.find(({ uuid }) => uuid === 'shift_uuid_2');
    const _nightShift = shifts?.find(({ uuid }) => uuid === 'shift_uuid_3');
    const _closestShift = shifts?.find(({ isActive, isClosest }) => isActive && isClosest);

    expect(propOptions.state?.shifts.data?.[groupUUID].hasMultipleActiveShifts).toBeTruthy();
    expect(propOptions.state?.shifts.data?.[groupUUID].activeShift).toBe(_closestShift?.uuid);

    expect(_morningShift1?.isActive).toBeTruthy();
    expect(_morningShift1?.prevEnd).toStrictEqual(parseTime(morningShift1.endTime));
    expect(_morningShift2?.isActive).toBeTruthy();
    expect(_morningShift2?.prevEnd).toStrictEqual(parseTime(morningShift2.endTime));
    expect(_morningShift2?.isClosest).toBeTruthy();
    expect(_afternoonShift?.isActive).toBeFalsy();
    expect(_afternoonShift?.isClosest).toBeUndefined();
    expect(_afternoonShift?.isDisabled).toBeTruthy();
    expect(_nightShift?.isActive).toBeFalsy();
    expect(_nightShift?.isClosest).toBeUndefined();
    expect(_nightShift?.isDisabled).toBeTruthy();
  });

  it('should mark closest and active flags for next day shifts properly', () => {
    const groupUUID = 'uuid_2';

    const morningShift1: TRawStaticShift = {
      group: 'Group 2 eg. Morning',
      group_uuid: 'uuid_2',
      uuid: 'shift_uuid_4',
      label: 'Morning 1 Custom',
      startTime: '04:00:00',
      endTime: '11:00:00',
      order: 1,
    };
    const morningShift2: TRawStaticShift = {
      group: 'Group 2 eg. Morning',
      group_uuid: 'uuid_2',
      uuid: 'shift_uuid_5',
      label: 'Morning 2 Custom',
      startTime: '06:00:00',
      endTime: '14:00:00',
      order: 0,
    };
    const nightShift2: TRawStaticShift = {
      group: 'Group 2 eg. Morning',
      group_uuid: 'uuid_2',
      uuid: 'shift_uuid_6',
      label: 'Night 2 Custom',
      startTime: '23:50:00',
      endTime: '06:00:00',
      order: 20,
    };
    propStaticOptions.settings.dataSource.static.data = appendShiftToStaticDataAsString(
      staticShiftData,
      morningShift1,
      morningShift2,
      nightShift2
    );

    let propOptions = processProps(propStaticOptions);
    propOptions.settings.time.isEndToNow = true;
    propOptions.settings.dataSource.filter.group = groupUUID;
    propOptions.settings.dataSource.filter.shifts = [];
    propOptions = setCurrentDateTime(propOptions, new Date('2000-01-01 01:05'));

    const _staticShiftData = parseStaticData(propOptions);
    propOptions = initShiftsData(propOptions, _staticShiftData);
    const shifts = propOptions.state?.shifts.data?.[groupUUID].shifts;

    const _morningShift1 = shifts?.find(({ uuid }) => uuid === 'shift_uuid_4');
    const _morningShift2 = shifts?.find(({ uuid }) => uuid === 'shift_uuid_5');
    const _afternoonShift = shifts?.find(({ uuid }) => uuid === 'shift_uuid_2');
    const _nightShift = shifts?.find(({ uuid }) => uuid === 'shift_uuid_3');
    const _nightShift2 = shifts?.find(({ uuid }) => uuid === 'shift_uuid_6');
    const _closestShift = shifts?.find(({ isActive, isClosest }) => isActive && isClosest);

    expect(propOptions.state?.shifts.data?.[groupUUID].hasMultipleActiveShifts).toBeTruthy();
    expect(propOptions.state?.shifts.data?.[groupUUID].activeShift).toBe(_closestShift?.uuid);

    expect(_morningShift1?.isActive).toBeFalsy();
    expect(_morningShift1?.prevEnd).toBeUndefined();
    expect(_morningShift2?.isActive).toBeFalsy();
    expect(_morningShift2?.prevEnd).toBeUndefined();
    expect(_morningShift2?.isClosest).toBeFalsy();
    expect(_afternoonShift?.isActive).toBeFalsy();
    expect(_afternoonShift?.isClosest).toBeUndefined();
    expect(_afternoonShift?.isDisabled).toBeUndefined();
    expect(_nightShift?.isActive).toBeTruthy();
    expect(_nightShift?.isClosest).toBeUndefined();
    expect(_nightShift?.isDisabled).toBeUndefined();
    expect(_nightShift2?.isActive).toBeTruthy();
    expect(_nightShift2?.isClosest).toBeTruthy();
    expect(_nightShift2?.isDisabled).toBeUndefined();
  });

  it('should mark closest and active flags for next day past shifts properly', () => {
    const groupUUID = 'uuid_2';

    const morningShift1: TRawStaticShift = {
      group: 'Group 2 eg. Morning',
      group_uuid: 'uuid_2',
      uuid: 'shift_uuid_4',
      label: 'Morning 1 Custom',
      startTime: '04:00:00',
      endTime: '11:00:00',
      order: 1,
    };
    const morningShift2: TRawStaticShift = {
      group: 'Group 2 eg. Morning',
      group_uuid: 'uuid_2',
      uuid: 'shift_uuid_5',
      label: 'Morning 2 Custom',
      startTime: '06:00:00',
      endTime: '14:00:00',
      order: 0,
    };
    const nightShift2: TRawStaticShift = {
      group: 'Group 2 eg. Morning',
      group_uuid: 'uuid_2',
      uuid: 'shift_uuid_6',
      label: 'Night 2 Custom',
      startTime: '23:50:00',
      endTime: '06:00:00',
      order: 20,
    };
    const nightShift3: TRawStaticShift = {
      group: 'Group 2 eg. Morning',
      group_uuid: 'uuid_2',
      uuid: 'shift_uuid_7',
      label: 'Night 3 Custom',
      startTime: '23:50:00',
      endTime: '02:00:00',
      order: 21,
    };

    propStaticOptions.settings.dataSource.static.data = appendShiftToStaticDataAsString(
      staticShiftData,
      morningShift1,
      morningShift2,
      nightShift2,
      nightShift3
    );

    let propOptions = processProps(propStaticOptions);
    propOptions.settings.time.isEndToNow = true;
    propOptions.settings.dataSource.filter.group = groupUUID;
    propOptions.settings.dataSource.filter.shifts = [];
    propOptions = setCurrentDateTime(propOptions, new Date('2000-01-01 03:15'));

    const _staticShiftData = parseStaticData(propOptions);
    propOptions = initShiftsData(propOptions, _staticShiftData);
    const shifts = propOptions.state?.shifts.data?.[groupUUID].shifts;

    const _morningShift1 = shifts?.find(({ uuid }) => uuid === 'shift_uuid_4');
    const _morningShift2 = shifts?.find(({ uuid }) => uuid === 'shift_uuid_5');
    const _afternoonShift = shifts?.find(({ uuid }) => uuid === 'shift_uuid_2');
    const _nightShift = shifts?.find(({ uuid }) => uuid === 'shift_uuid_3');
    const _nightShift2 = shifts?.find(({ uuid }) => uuid === 'shift_uuid_6');
    const _nightShift3 = shifts?.find(({ uuid }) => uuid === 'shift_uuid_7');
    const _closestShift = shifts?.find(({ isActive, isClosest }) => isActive && isClosest);

    expect(propOptions.state?.shifts.data?.[groupUUID].hasMultipleActiveShifts).toBeTruthy();
    expect(propOptions.state?.shifts.data?.[groupUUID].activeShift).toBe(_closestShift?.uuid);

    expect(_morningShift1?.isActive).toBeFalsy();
    expect(_morningShift1?.prevEnd).toBeUndefined();
    expect(_morningShift2?.isActive).toBeFalsy();
    expect(_morningShift2?.prevEnd).toBeUndefined();
    expect(_morningShift2?.isClosest).toBeFalsy();
    expect(_afternoonShift?.isActive).toBeFalsy();
    expect(_afternoonShift?.isClosest).toBeUndefined();
    expect(_afternoonShift?.isDisabled).toBeUndefined();
    expect(_nightShift?.isActive).toBeTruthy();
    expect(_nightShift?.isClosest).toBeFalsy();
    expect(_nightShift?.isDisabled).toBeUndefined();
    expect(_nightShift2?.isActive).toBeTruthy();
    expect(_nightShift2?.isClosest).toBeTruthy();
    expect(_nightShift2?.isDisabled).toBeUndefined();
    expect(_nightShift3?.isActive).toBeFalsy();
    expect(_nightShift3?.isDisabled).toBeUndefined();
    expect(_nightShift3?.isClosest).toBeUndefined();
  });
});
