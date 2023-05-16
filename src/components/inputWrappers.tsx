import React, { useState } from 'react';
import { ProductionDay, SelectorInputs } from '../styles/components';
import DatePicker from 'react-datepicker';
import { RangeButton } from './rangeButton';
import { TPropOptions, datePartsToSet } from '../types';
import { config } from '@grafana/runtime';
import { TimeRange } from '@grafana/data';
import { setTypeChangeHandler } from '../utils';

const isDark = config.theme.isDark;

type TPropInputWrapperOptions = Omit<
  TPropOptions,
  | 'isDataSourceShifts'
  | 'isAutoSelectShift'
  | 'autoSelectShiftGroup'
  | 'isShowTimeLabel'
  | 'shiftOptionsLabelType'
  | 'refreshInterval'
  | 'var_query_map_dynamic'
  | 'var_query_map_static'
  | 'var_label_mapping'
> & {
  timeRange: TimeRange;
  updateType: string;
  setTypeChangeHandler: typeof setTypeChangeHandler;
  setUpdateType: React.Dispatch<React.SetStateAction<string>>;
  setCustomTimeRange: React.Dispatch<any>;
  productionDate: number;
  setProductionDate: React.Dispatch<React.SetStateAction<number>>;
};

export const InputWrappers = (props: TPropInputWrapperOptions) => {
  const {
    isShowDayLabel,
    dayLabel,
    rangeLabelType,
    rangeOptionLabelStartEnd,
    rangeOptionLabelStart,
    rangeOptionLabelEnd,
    updateType,
    setCustomTimeRange,
    setTypeChangeHandler,
    setUpdateType,
    productionDate,
    setProductionDate,
  } = props;

  const dateFormat = 'yyyy-MM-dd';
  const [_viewType] = useState<string>('default');

  const btnStartEndIsActive = updateType === datePartsToSet.both;
  const btnStartIsActive = updateType === datePartsToSet.from;
  const btnEndIsActive = updateType === datePartsToSet.to;

  return (
    <SelectorInputs>
      <ProductionDay isDark={isDark}>
        {isShowDayLabel ? <span>{dayLabel || 'Select day'}</span> : <></>}
        <DatePicker
          className="production-day-selector"
          selected={new Date(productionDate)}
          onChange={(date: Date) => setProductionDate(+date)}
          dateFormat={dateFormat}
        />
        <RangeButton
          viewType={rangeLabelType}
          buttonType="start-end"
          title="Set shift times both from and to times"
          label={rangeOptionLabelStartEnd}
          icon="mdi-ray-start-end"
          onClick={() => setTypeChangeHandler(datePartsToSet.both, updateType, setUpdateType, setCustomTimeRange)}
          isActive={btnStartEndIsActive}
        />
        <RangeButton
          viewType={rangeLabelType}
          buttonType="start"
          title="Set shift start time"
          label={rangeOptionLabelStart}
          icon="mdi-ray-start"
          onClick={() => setTypeChangeHandler(datePartsToSet.from, updateType, setUpdateType, setCustomTimeRange)}
          isActive={btnStartIsActive}
        />
        <RangeButton
          viewType={rangeLabelType}
          buttonType="end"
          title="Set shift end time"
          label={rangeOptionLabelEnd}
          icon="mdi-ray-end"
          onClick={() => setTypeChangeHandler(datePartsToSet.to, updateType, setUpdateType, setCustomTimeRange)}
          isActive={btnEndIsActive}
        />
      </ProductionDay>
    </SelectorInputs>
  );
};
