import { TypedVariableModel } from '@grafana/data';
import type { TTimeString } from '../utils/time';
import { TShiftGroupedData } from './shifts';
import { TTimeObject } from './time';

export type TGlobalData = {
  options: TPropOptions | null;
};

export interface ShiftI {
  order?: number;
  uuid: string;
  start: TTimeString | string;
  end: TTimeString | string;
  label: string;
  shiftGroupName: string;
  shiftGroupUUID: string;
}

export type Option = {
  selected: boolean;
  text: string;
  value: string;
};

export type TRangeButtonViewType = 'icon-only' | 'text-and-icon' | 'text-only';
export type TOptionButtonViewType = 'text-and-icon' | 'text-only';

export type TPropOptions = {
  data: {
    shifts: TShiftGroupedData | null;
  } | null;
  state: {
    shifts: {
      data: TShiftGroupedData | null;
      hasMultipleShiftGroups: boolean;
    };
  };
  settings: {
    time: {
      current: TTimeObject;
      relativeTo: string;
      isRealTime: boolean;
      isEndToNow: boolean;
      refreshInterval: number;
    };
    dataSource: {
      type: 'static' | 'database';
      static: {
        data: string;
      };
      filter: {
        group: string;
        shifts: string[];
      };
    };
    groups: {
      label: {
        isTrimmed: boolean;
      };
    };
  };
  db: {
    table: {
      shifts: {
        name: string;
        columns: {
          uuid: string;
          name: string;
          start_time: string;
          end_time: string;
          order: string;
          group_uuid: string;
        };
      };
      shift_groups: {
        name: string;
        columns: {
          uuid: string;
          name: string;
          site_uuid: string;
        };
      };
      filter: {
        column: {
          name: string;
          value: string;
        };
      };
    };
  };
  ux: {
    time: {
      isFixed: boolean;
      value: TTimeObject | null;
    };
    realtime: {
      shift: {
        isAutoSelect: boolean;
        isEndToNow: boolean;
        refreshInterval: number;
      };
    };
  };
  ui: {
    element: {
      progressBar: {
        isVisible: boolean;
      };
      date: {
        input: {
          isVisible: boolean;
          value: string;
        };
        label: {
          isVisible: boolean;
          value: string;
        };
      };
      time: {
        input: {
          isVisible: boolean;
          value: string;
        };
      };
      rangeButton: {
        label: {
          type: 'text-and-icon' | 'icon-only' | 'text-only';
          startEnd: string;
          start: string;
          end: string;
        };
      };
      shiftButton: {
        label: {
          type: 'text-and-icon' | 'icon-only' | 'text-only';
          time: {
            isVisible: boolean;
          };
          options: {
            sunny: string[];
            sunset: string[];
            night: string[];
          };
        };
      };
      replay: {
        time: {
          isEnabled: boolean;
          unit: 'hours' | 'minutes' | undefined;
          end: TTimeObject | null;
          isNextDay: boolean;
        };
        maxTime: {
          value: number;
          min: number;
          max: number;
          step: number;
        };
      };
    };
  };
};

export type datePartOptions = 'both' | 'from' | 'to';
export enum datePartsToSet {
  both = 'both',
  from = 'from',
  to = 'to',
}

export enum EViewType {
  row = 'row',
  column = 'column',
}
export type TViewTypeOptions = keyof typeof EViewType;

export type TAlert = {
  id: number;
  type: string;
  text: string;
};

export type TOption = {
  text: string;
  value: string;
};

export interface EIVariableModel {
  query: string;
  options: TOption[];
  current: {
    value: string;
  };
}

export type IVariableModel = TypedVariableModel & EIVariableModel;

export type TSqlConfig = {
  lookup: {
    shift_groups: string;
    shifts: string;
  };
  project: {
    shift_groups: {
      name: string;
      site_uuid: string;
      uuid: string;
    };
    shifts: {
      end_time: string;
      group_uuid: string;
      order: string;
      start_time: string;
      uuid: string;
      name: string;
    };
  };
  schema: {
    shifts: string;
    shift_groups: string;
  };
  static?: {
    shifts: TStaticShift[];
  };
};

export type TStaticShift = {
  group: string;
  group_uuid: string;
  uuid: string;
  label: string;
  startTime: string;
  endTime: string;
  order: string;
};

export type TExtendedShift = ShiftI & {
  startDate: moment.Moment;
  endDate: moment.Moment;
  _: any;
};

export type ShiftData = {
  [key: string]: ShiftI[];
};

export type ExtendedShiftData = {
  [key: string]: TExtendedShift[];
};

export enum vars {
  queryShiftsOptions = 'var_shifts_options',
  queryShiftsGroup = 'var_shift_group',
  varQueryMapper = 'var_query_map',
  varDataModel = 'var_shifts_dataModel',
  varShiftsValuesName = 'shifts_values',
}

export type TMappings = {
  [key: string]: string[];
};

export type TUpdateActiveShiftProps = {
  setShiftParams: (shift: TExtendedShift, isManualUpdate?: any) => void;
  autoSelectShiftGroup: string;
  isAutoSelectShift: boolean;
  isOptionGroupLabelTrimmed: boolean;
  setProductionDate: React.Dispatch<number>;
  productionDate: number;
  shifts: {
    options: any;
    values: any;
  };
  isBlockedRender: boolean;
};

// export type TDataResponse = { data: { results: { shifts_values: { dataframes: DataFrame[] } } } }
export type TDataResponse = {
  data: {
    results: {
      [key: string]: {
        // datasource-refid
        frames: [
          {
            data: {
              values: [
                [number[]], // order
                [string[]], // group name
                [string[]], // group uuid
                [string[]], // start time
                [string[]], // end time
                [string[]], // label
                [string[]], // shiftGroupName
                [string[]] // shiftGroupUUID
              ];
            };
          }
        ];
      };
    };
  };
};

export type TDbQuery = {
  refId: string;
  datasourceId: number;
  rawSql: string;
  format: string;
};
