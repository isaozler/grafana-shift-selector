import React, { useEffect, useRef, useState } from 'react';

import './styles/core.css';
import 'react-datepicker/dist/react-datepicker.min.css';

import { PanelProps } from '@grafana/data';
import { TPropOptions, vars } from './types';
import { setTypeChangeHandler, shiftSelectHandler } from './utils';
import { ShiftSelectorWrapper, ShiftSelectorContainer } from './styles/components';
import { ShiftOptions } from './components/options';
import { InputWrappers } from './components/inputWrappers';
import { Alerts } from './components/alerts';
import { useShiftSelectorHook } from './hooks/core';
import { locationService } from '@grafana/runtime';
import { ProgressBar } from './components/progressBar';

let refreshT: NodeJS.Timer | null = null;

const ShiftSelector: React.FC<PanelProps<TPropOptions>> = (props) => {
  const [renderCount, setRenderCount] = useState(0);
  const [isBlockedRender, setIsBlockedRender] = useState(false);
  const [shiftSelectorPluginPanel, setShiftSelectorPluginPanel] = useState<NodeListOf<HTMLDivElement> | null>(null);
  const [autoSelectShiftGroup, setAutoSelectShiftGroup] = useState(
    locationService.getSearch().get(vars.queryShiftsGroup) ?? props.options.autoSelectShiftGroup
  );
  const { data: _data, width, height, timeRange } = props;
  const {
    isShowDayLabel,
    isShowTimeLabel,
    isAutoSelectShift,
    dayLabel,
    rangeLabelType,
    shiftOptionsLabelType,
    rangeOptionLabelStartEnd,
    rangeOptionLabelStart,
    rangeOptionLabelEnd,
    var_label_mapping,
    isShowRangeButtons,
    isShowProductionDateSelector,
    isProgressbarVisible,
  } = props.options;
  const {
    resetAlert,
    alerts,
    shiftOptions,
    shiftValues,
    _viewType,
    updateType,
    setAlerts,
    setClosedAlerts,
    setCustomTimeRange,
    setUpdateType,
    setManualShiftParams,
    productionDate,
    setProductionDate,
  } = useShiftSelectorHook({
    ...props,
    options: {
      ...props.options,
      autoSelectShiftGroup,
      isBlockedRender,
    },
    shiftSelectorPluginPanel,
  } as PanelProps<TPropOptions>);
  const shiftSelectorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shiftSelectorRef?.current) {
      const shiftSelectorPluginPanel: NodeListOf<HTMLDivElement> = window.document.querySelectorAll(
        '#' + shiftSelectorRef.current.id
      );

      shiftSelectorPluginPanel.forEach(
        (panel) =>
          panel?.parentNode?.childElementCount &&
          (panel?.parentNode as HTMLDivElement)?.classList.add('show-panel-datepicker')
      );

      const editorPanelsSize = window.document.querySelectorAll('[data-testid="options-category"]').length;

      setShiftSelectorPluginPanel(shiftSelectorPluginPanel);

      if (shiftSelectorPluginPanel.length > 1 && !editorPanelsSize) {
        setAlerts([
          {
            id: 9,
            text: 'There is already a shift selector plugin active on this dashboard! Multiple shift selector panels on your dashboard may cause unexpected errors like infinite loops/memory leaks.',
            type: 'brandDanger',
          },
        ]);
        setIsBlockedRender(true);
      } else {
        setIsBlockedRender(false);
      }
    }
  }, [shiftSelectorRef, setAlerts]);

  useEffect(() => {
    if (
      !!props.options.autoSelectShiftGroup &&
      !!autoSelectShiftGroup &&
      props.options.autoSelectShiftGroup !== autoSelectShiftGroup
    ) {
      locationService.partial(
        {
          [vars.queryShiftsGroup]: props.options.autoSelectShiftGroup,
          [vars.queryShiftsOptions]: null,
        },
        true
      );
      setAutoSelectShiftGroup(props.options.autoSelectShiftGroup);
    }
  }, [props.options.autoSelectShiftGroup, autoSelectShiftGroup]);

  useEffect(() => {
    if (refreshT) {
      clearInterval(refreshT);
      refreshT = null;
    }

    if (props.options._refreshInterval) {
      refreshT = setInterval(() => {
        props.eventBus.publish({ type: 'refresh', payload: undefined, origin: undefined });
        setRenderCount((d) => d + 1);
      }, props.options._refreshInterval as unknown as number);
    }

    return () => {
      if (refreshT) {
        clearInterval(refreshT);
        refreshT = null;
      }
    };
  }, [props.eventBus, props.options._refreshInterval]);

  useEffect(() => {
    if (!isAutoSelectShift && props.timeRange.from) {
      setProductionDate(props.timeRange.from.unix() * 1000);
    }
  }, [isAutoSelectShift, setProductionDate, props]);

  if (isBlockedRender) {
    return <Alerts alerts={alerts} resetAlert={resetAlert} setClosedAlerts={setClosedAlerts} />;
  }

  return (
    <ShiftSelectorWrapper ref={shiftSelectorRef} id="shift-selector-plugin">
      {isProgressbarVisible && isAutoSelectShift && (
        <ProgressBar renderCount={renderCount} refresh={props.options._refreshInterval} />
      )}
      <Alerts alerts={alerts} resetAlert={resetAlert} setClosedAlerts={setClosedAlerts} />
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
              refreshInterval={props.options.refreshInterval}
              _refreshInterval={props.options._refreshInterval}
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
              productionDate={productionDate}
              setProductionDate={setProductionDate}
              isShowProductionDateSelector={isShowProductionDateSelector}
              isShowRangeButtons={isShowRangeButtons}
              isProgressbarVisible={isProgressbarVisible}
              isBlockedRender={isBlockedRender}
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
              setShiftParams={setManualShiftParams}
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
