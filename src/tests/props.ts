import { TPropOptions } from '../types';
import { staticShiftData } from './stub.data';

export const propStaticOptions: TPropOptions = {
  data: null,
  state: {
    shifts: {
      data: null,
      hasMultipleShiftGroups: true,
    },
  },
  settings: {
    dataSource: {
      type: 'static',
      static: {
        data: staticShiftData,
      },
      filter: {
        group: '',
      },
    },
    groups: {
      label: {
        isTrimmed: false,
      },
    },
    // missing computed time
  } as TPropOptions['settings'],
  db: {
    table: {
      shifts: {
        name: 'shifts',
        columns: {
          uuid: 'uuid',
          name: 'name',
          start_time: 'start_time',
          end_time: 'end_time',
          order: 'shift_order',
          group_uuid: 'shift_group_uuid',
        },
      },
      shift_groups: {
        name: 'shift_groups',
        columns: {
          uuid: 'uuid',
          name: 'name',
          site_uuid: 'site_uuid',
        },
      },
      filter: {
        column: {
          name: '',
          value: '',
        },
      },
    },
  },
  ux: {
    time: {
      isFixed: false,
      value: {
        hour: 0,
        minute: 0,
      },
    },
    realtime: {
      shift: {
        isAutoSelect: false,
        isEndToNow: true,
        refreshInterval: 60000,
        isCustomRefreshInterval: true,
      },
    },
  },
  ui: {
    element: {
      replay: {
        time: {
          isEnabled: false,
          unit: undefined,
          end: {
            hour: 0,
            minute: 0,
          },
          isNextDay: false,
        },
        maxTime: {
          value: 0,
          min: 0,
          max: 0,
          step: 0,
        },
      },
      progressBar: {
        isVisible: true,
      },
      date: {
        input: {
          isVisible: true,
          value: '2024-07-31',
        },
        label: {
          isVisible: true,
          value: 'Production Day',
        },
      },
      time: {
        input: {
          isVisible: true,
          value: '2024-07-31',
        },
      },
      rangeButton: {
        label: {
          type: 'icon-only',
          startEnd: 'Start-End',
          start: 'Start',
          end: 'End',
        },
      },
      shiftButton: {
        label: {
          type: 'icon-only',
          time: {
            isVisible: true,
          },
          options: {
            sunny: ['sabah', 'spät'],
            sunset: ['ikindi', 'früh'],
            night: ['akşam', 'nacht'],
          },
        },
      },
    },
  },
};
