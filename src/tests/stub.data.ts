import type { TShiftGroupedData, TStaticRawData } from '../types/shifts';

export const staticShiftData: TStaticRawData = JSON.stringify([
  {
    group: 'Group 1 eg. Summer',
    group_uuid: 'uuid_1',
    uuid: 'shift_uuid_1',
    label: 'Morning Custom',
    startTime: '06:00:00',
    endTime: '14:00:00',
    order: 1,
  },
  {
    group: 'Group 2 eg. Winter',
    group_uuid: 'uuid_2',
    uuid: 'shift_uuid_2',
    label: 'Afternoon Custom',
    startTime: '14:00:00',
    endTime: '22:00:00',
    order: 1,
  },
  {
    group: 'Group 2 eg. Winter',
    group_uuid: 'uuid_2',
    uuid: 'shift_uuid_3',
    label: 'Night Custom',
    startTime: '22:00:00',
    endTime: '06:00:00',
    order: 2,
  },
]);

export const testShiftData: TShiftGroupedData = {
  uuid_1: {
    label: 'Group 1 eg. Summer',
    uuid: 'uuid_1',
    activeShift: null,
    shifts: [
      {
        uuid: 'shift_uuid_1',
        label: 'Morning Custom',
        start: {
          hour: 6,
          minute: 0,
        },
        end: {
          hour: 14,
          minute: 0,
        },
        order: 1,
        isActive: false,
        isNextDay: false,
      },
    ],
  },
  uuid_2: {
    label: 'Group 2 eg. Winter',
    uuid: 'uuid_2',
    activeShift: null,
    shifts: [
      {
        uuid: 'shift_uuid_2',
        label: 'Afternoon Custom',
        start: {
          hour: 14,
          minute: 0,
        },
        end: {
          hour: 22,
          minute: 0,
        },
        order: 1,
        isActive: false,
        isNextDay: false,
      },
      {
        uuid: 'shift_uuid_3',
        label: 'Night Custom',
        start: {
          hour: 22,
          minute: 0,
        },
        end: {
          hour: 6,
          minute: 0,
        },
        order: 2,
        isActive: false,
        isNextDay: true,
      },
    ],
  },
};
