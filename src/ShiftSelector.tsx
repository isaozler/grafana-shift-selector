import React, { useEffect, useRef, useState } from 'react';

import './styles/core.css';
import 'react-datepicker/dist/react-datepicker.min.css';

import { PanelProps } from '@grafana/data';
import { TPropOptions } from './types';
import { setTypeChangeHandler, shiftSelectHandler } from './utils';
import { ShiftSelectorWrapper, ShiftSelectorContainer } from './styles/components';
import { ShiftOptions } from './components/options';
import { InputWrappers } from './components/inputWrappers';
import { Alerts } from './components/alerts';
import { useShiftSelectorHook } from './hooks/core';

const ShiftSelector: React.FC<PanelProps<TPropOptions>> = (props) => {
  const [isBlockedRender, setIsBlockedRender] = useState(false);
  const [shiftSelectorPluginPanel, setShiftSelectorPluginPanel] = useState<NodeListOf<HTMLDivElement> | null>(null);
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
    isShowRangeButtons,
    isShowProductionDateSelector,
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
          panel.parentNode?.childElementCount &&
          (panel.parentNode as HTMLDivElement).classList.add('show-panel-datepicker')
      );

      const editorPanelsSize = window.document.querySelectorAll('[data-testid="options-category"]').length;

      setShiftSelectorPluginPanel(shiftSelectorPluginPanel);

      if (shiftSelectorPluginPanel.length > 1 && !editorPanelsSize) {
        setAlerts([
          {
            id: 9,
            text: 'There is already a shift selector plugin active on this dashboard! Having more than one shift selector panel will cause infinite loops.',
            type: 'brandDanger',
          },
        ]);
        setIsBlockedRender(true);
      } else {
        setIsBlockedRender(false);
      }
    }
  }, [shiftSelectorRef, setAlerts]);

  if (isBlockedRender) {
    return <Alerts alerts={alerts} resetAlert={resetAlert} setClosedAlerts={setClosedAlerts} />;
  }

  return (
    <ShiftSelectorWrapper ref={shiftSelectorRef} id="shift-selector-plugin">
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
