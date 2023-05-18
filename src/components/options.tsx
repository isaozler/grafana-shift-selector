import React from 'react';

import { config } from '@grafana/runtime';
import {
  ShiftOptionsWrapper,
  ShiftsWrapper,
  ShiftLabel,
  ShiftButtonsWrapper,
  ShiftButton,
  ShiftLabelSpan,
} from '../styles/components';
import {
  EViewType,
  Option,
  ShiftI,
  TMappings,
  TOptionButtonViewType,
  TViewTypeOptions,
  datePartOptions,
  vars,
} from '../types';
import { buttonTypes, getShifts, shiftSelectHandler as utilShiftSelectHandler } from '../utils';

const isDark = config.theme.isDark;

export const ShiftOptions = ({
  options,
  setShiftParams,
  shiftSelectHandler,
  setType,
  viewType,
  data: optionsData,
  isAutoSelectShift,
  isShowTimeLabel,
  autoSelectShiftGroup,
  optionViewType,
  mappings,
  productionDate,
}: {
  data: any[];
  setType: datePartOptions;
  viewType: TViewTypeOptions;
  optionViewType: TOptionButtonViewType;
  options: Option[];
  setShiftParams: (shift: ShiftI, isManualUpdate?: any) => void;
  shiftSelectHandler: typeof utilShiftSelectHandler;
  isAutoSelectShift: boolean;
  isShowTimeLabel: boolean;
  autoSelectShiftGroup: string | undefined;
  mappings: string;
  productionDate: number;
}) => {
  const shifts = getShifts(options, optionsData, productionDate);

  if (!viewType) {
    viewType = EViewType.row;
  }

  let mappingsParsed: TMappings = {};

  try {
    mappingsParsed = JSON.parse(mappings);
  } catch (error) {
    console.error('Invalid mapping data');
    console.error(error);
  }

  const { sunny, sunset, night } = mappingsParsed;

  const allMappings = {
    sunny: ['morning', 'morgen', 'day', ...(sunny ? sunny : [])],
    'sunset-down': ['afternoon', 'middag', ...(sunset ? sunset : [])],
    night: ['night', 'nacht', ...(night ? night : [])],
  };

  return (
    <ShiftOptionsWrapper viewType={viewType as any}>
      {Object.keys(shifts).map((key: string) => {
        const isRealtimeActive = isAutoSelectShift && autoSelectShiftGroup === shifts[key][0].shiftGroupUUID;
        return (
          <ShiftsWrapper
            key={key}
            viewType={viewType as any}
            isDark={isDark}
            isSingleOption={Object.keys(shifts).length === 1}
            isRealtime={isRealtimeActive}
          >
            {Object.keys(shifts).length > 1 && (
              <ShiftLabel viewType={viewType}>{shifts[key][0] ? shifts[key][0].shiftGroupName : key}</ShiftLabel>
            )}
            <ShiftButtonsWrapper>
              {shifts[key]
                .filter((d) => d)
                .sort((a: any, b: any) => a?.order - b?.order)
                .map((item: ShiftI) => {
                  const { uuid, label, start: _start, end: _end } = item || {};
                  const [sh, sm] = _start.split(':');
                  const [eh, em] = _end.split(':');
                  const start = `${sh}:${sm}`;
                  const end = `${eh}:${em}`;
                  const isActive =
                    new URLSearchParams(window.location.search).get(vars.queryShiftsOptions) === uuid ||
                    new URLSearchParams(window.location.search).get(vars.queryShiftsOptions) === 'All';
                  const fromTimeLabel = setType === 'from' ? `${start}` : `${end}`;
                  const timeLabel = setType === 'both' ? `${start} - ${end}` : fromTimeLabel;

                  return (
                    <ShiftButton
                      key={uuid}
                      isDark={isDark}
                      isActive={isActive}
                      className={`btn navbar-button ${
                        buttonTypes(label, allMappings) && optionViewType.includes('icon')
                          ? `mdi mdi-weather-${buttonTypes(label, allMappings)}`
                          : ''
                      }`}
                      onClick={() => shiftSelectHandler(item, setShiftParams, productionDate)}
                      isRealtime={isRealtimeActive}
                    >
                      <ShiftLabelSpan>
                        {label} {isShowTimeLabel ? <>({timeLabel})</> : <></>}
                      </ShiftLabelSpan>
                    </ShiftButton>
                  );
                })}
            </ShiftButtonsWrapper>
          </ShiftsWrapper>
        );
      })}
    </ShiftOptionsWrapper>
  );
};
