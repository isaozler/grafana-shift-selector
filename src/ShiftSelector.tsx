import * as React from 'react';

import './styles/core.css';
import 'react-datepicker/dist/react-datepicker.min.css';

import { PanelProps } from '@grafana/data';
import { TPropOptions } from './types';
import { getShifts, setTypeChangeHandler, shiftSelectHandler } from './utils';
import { ShiftSelectorWrapper, Alerts, ShiftSelectorContainer } from './styles/components';
import { ShiftOptions } from './components/options';
import { InputWrappers } from './components/inputWrappers';
import { useShiftSelectorHook } from './hooks/core';

const ShiftSelector: React.FC<PanelProps<{}>> = (props) => {
  const { data: _data, width, height, timeRange } = props;
  const {
    isShowDayLabel,
    isShowTimeLabel,
    isAutoSelectShift,
    autoSelectShiftGroup,
    dayLabel,
    rangeLabelType,
    shiftOptionsLabelType,
    rangeOptionLabelStartEnd,
    rangeOptionLabelStart,
    rangeOptionLabelEnd,
    var_label_mapping,
  } = props.options as TPropOptions;
  const {
    resetAlert,

    alerts,
    shiftOptions,
    shiftValues,
    _viewType,
    updateType,

    setClosedAlerts,
    setCustomTimeRange,
    setUpdateType,
    setShiftParams,

    productionDate,
  } = useShiftSelectorHook(props);

  if (shiftOptions?.options) {
    console.log('SHIFTS', getShifts(shiftOptions?.options, shiftValues, productionDate));
  }

  return (
    <ShiftSelectorWrapper>
      {JSON.stringify(timeRange)}
      {new Date().getTime()}
      {alerts.map(({ text, type, id }: { id: number; text: string; type: string }) => {
        return (
          <Alerts key={`alerts-${id}`} type={type as any}>
            {text}
            <button
              onClick={() => {
                resetAlert(id);
                setClosedAlerts((d: number[]) => [...(new Set([...d, id]) as any)]);
              }}
            >
              x
            </button>
          </Alerts>
        );
      })}
      {shiftOptions?.options?.length ? (
        <ShiftSelectorContainer
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
          viewType={_viewType as any}
        >
          {!isAutoSelectShift ? (
            <InputWrappers
              timeRange={timeRange}
              isShowDayLabel={isShowDayLabel}
              dayLabel={dayLabel}
              rangeLabelType={rangeLabelType}
              rangeOptionLabelStartEnd={rangeOptionLabelStartEnd}
              rangeOptionLabelStart={rangeOptionLabelStart}
              rangeOptionLabelEnd={rangeOptionLabelEnd}
              updateType={updateType}
              setTypeChangeHandler={setTypeChangeHandler}
              setCustomTimeRange={setCustomTimeRange}
              setUpdateType={setUpdateType}
            />
          ) : (
            <></>
          )}
          {shiftValues.length && shiftOptions?.options?.length ? (
            <ShiftOptions
              data={shiftValues}
              setType={updateType}
              viewType={_viewType}
              isShowTimeLabel={isShowTimeLabel}
              optionViewType={shiftOptionsLabelType}
              setShiftParams={setShiftParams}
              shiftSelectHandler={shiftSelectHandler}
              isAutoSelectShift={isAutoSelectShift}
              autoSelectShiftGroup={autoSelectShiftGroup}
              mappings={var_label_mapping}
              productionDate={productionDate}
              {...shiftOptions}
            />
          ) : (
            <></>
          )}
        </ShiftSelectorContainer>
      ) : (
        <></>
      )}
    </ShiftSelectorWrapper>
  );
};

export default ShiftSelector;
