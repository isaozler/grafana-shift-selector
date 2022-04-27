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

export type TPropOptions = {
  isAutoSelectShift: boolean;
  autoSelectShiftGroup: string;
  isShowDayLabel: boolean;
  dayLabel: string;
  rangeLabelType: TRangeButtonViewType;
  rangeOptionLabelStartEnd: string;
  rangeOptionLabelStart: string;
  rangeOptionLabelEnd: string;
  refreshInterval: string;
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
