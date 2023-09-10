import { VariableModel } from '@grafana/data';

export interface ShiftI {
  order?: number;
  uuid: string;
  start: any;
  end: any;
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
  refreshInterval: string;
  _refreshInterval: string;
  isDataSourceShifts: boolean;
  isAutoSelectShift: boolean;
  autoSelectShiftGroup: string;
  isShowDayLabel: boolean;
  isShowTimeLabel: boolean;
  dayLabel: string;
  rangeLabelType: TRangeButtonViewType;
  shiftOptionsLabelType: TOptionButtonViewType;
  rangeOptionLabelStartEnd: string;
  rangeOptionLabelStart: string;
  rangeOptionLabelEnd: string;
  var_query_map_dynamic: string;
  var_query_map_static: string;
  var_label_mapping: string;
  shiftSelectorPluginPanel: NodeListOf<HTMLDivElement>;
  isShowRangeButtons: boolean;
  isShowProductionDateSelector: boolean;
  isProgressbarVisible: boolean;
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

export type IVariableModel = VariableModel & EIVariableModel;

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
  setProductionDate: React.Dispatch<number>;
  productionDate: number;
  shifts: {
    options: any;
    values: any;
  };
};
