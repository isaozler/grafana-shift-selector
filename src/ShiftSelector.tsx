import * as React from 'react';
import sqlstring from 'sqlstring';

const { useEffect, useState, useCallback } = React;

import {
  PanelProps,
  dateTimeAsMoment,
  TimeRange,
  DataFrame,
  LoadingState,
  DataQueryResponse,
  Vector,
  VariableModel,
} from '@grafana/data';
import {
  getLocationSrv,
  getTemplateSrv,
  TemplateSrv,
  config,
  getBackendSrv,
  BackendSrv,
  getDataSourceSrv,
  toDataQueryResponse,
} from '@grafana/runtime';

import DatePicker from 'react-datepicker';

import { ShiftI } from './types';
import { buttonTypes } from './utils';

import './styles/core.css';
import 'react-datepicker/dist/react-datepicker.min.css';
import {
  RangeButtonComp,
  ShiftOptionsWrapper,
  ShiftsWrapper,
  ShiftLabel,
  ShiftButtonsWrapper,
  ShiftButton,
  ShiftSelectorWrapper,
  Alerts,
  ShiftSelectorContainer,
  SelectorInputs,
  ProductionDay,
} from './styles/components';

const isDark = config.theme.isDark;

type Option = {
  selected: boolean;
  text: string;
  value: string;
};

type datePartOptions = 'both' | 'from' | 'to';
enum datePartsToSet {
  both = 'both',
  from = 'from',
  to = 'to',
}

enum EViewType {
  row = 'row',
  column = 'column',
}
type TViewTypeOptions = keyof typeof EViewType;

type TAlert = {
  id: number;
  type: string;
  text: string;
};

type TOption = {
  text: string;
  value: string;
};

interface EIVariableModel {
  query: string;
  options: TOption[];
  current: {
    value: string;
  };
}

type IVariableModel = VariableModel & EIVariableModel;

type TSqlConfig = {
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

type TStaticShift = {
  group: string;
  group_uuid: string;
  uuid: string;
  label: string;
  startTime: string;
  endTime: string;
  order: string;
};

const parseShiftData = (uuid: string, values: any[]) => {
  const { text: data } = values.find(({ value }) => value === uuid) || {};

  if (!data) {
    return null;
  }

  const [shiftGroupName, shiftGroupUUID, , start, end, order] = data.split('|');

  return {
    shiftGroupName,
    shiftGroupUUID,
    start,
    end,
    order: +order,
  };
};

type ShiftData = {
  [key: string]: ShiftI[];
};

enum vars {
  queryShiftsOptions = 'var_shifts_options',
  varQueryMapper = 'var_query_map',
  varDataModel = 'var_shifts_dataModel',
  varShiftsValuesName = 'shifts_values',
}

const ShiftOptions = ({
  options,
  shiftSelectHandler,
  setType,
  viewType,
  data: optionsData,
}: {
  data: any[];
  setType: datePartOptions;
  viewType: TViewTypeOptions;
  options: Option[];
  shiftSelectHandler: (shift: ShiftI) => void;
}) => {
  const shifts: ShiftData = options.reduce((res: any, { text, value: uuid }, index: number) => {
    const data = parseShiftData(uuid, optionsData);

    if (!data) {
      return res;
    }

    return {
      ...res,
      [data.shiftGroupUUID]: [
        ...(res[data.shiftGroupUUID] || []),
        {
          ...data,
          uuid,
          label: text,
          index,
        },
      ],
    };
  }, {});

  if (!viewType) {
    viewType = EViewType.row;
  }

  return (
    <ShiftOptionsWrapper viewType={viewType as any}>
      {Object.keys(shifts).map((key: string) => {
        return (
          <ShiftsWrapper
            key={key}
            viewType={viewType as any}
            isDark={isDark}
            isSingleOption={Object.keys(shifts).length === 1}
          >
            {Object.keys(shifts).length > 1 && (
              <ShiftLabel>{shifts[key][0] ? shifts[key][0].shiftGroupName : key}</ShiftLabel>
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

                  return (
                    <ShiftButton
                      key={uuid}
                      isDark={isDark}
                      isActive={isActive}
                      className={`btn navbar-button mdi mdi-weather-${buttonTypes(label)}`}
                      onClick={() => shiftSelectHandler(item)}
                    >
                      {label} ({setType === 'both' ? `${start} - ${end}` : setType === 'from' ? `${start}` : `${end}`})
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

const RangeButton = ({
  title,
  icon,
  isActive,
  onClick,
}: {
  title: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <RangeButtonComp
      title={title}
      onClick={onClick}
      isDark={isDark}
      isActive={isActive}
      className={`btn mdi ${icon}`}
    />
  );
};

const ShiftSelector: React.FC<PanelProps<{}>> = (props) => {
  const { data: _data, width, height, timeRange } = props;
  const locationSrv = getLocationSrv();
  const templateSrv = getTemplateSrv() as TemplateSrv & { timeRange: TimeRange };
  const dateRange = templateSrv.timeRange;
  const [_viewType, setViewType] = useState<string>('default');
  const [initDateRage, setInitDateRage] = useState<any>(null);
  const [shiftOptions, setShiftOptions] = useState<any>({});
  const [shiftValues, setShiftValues] = useState<any>([]);
  const [customTimeRange, setCustomTimeRange] = useState<any>(null);
  const [alerts, setAlerts] = useState<TAlert[] | []>([]);
  const [updateType, setUpdateType] = useState<string>(datePartsToSet.both);
  const [closedAlerts, setClosedAlerts] = useState<number[]>([]);
  const [productionDate, setProductionDate] = useState<any>(timeRange.from.unix() * 1000);
  const [siteUUID, setSiteUUID] = useState<any>();
  const [isStatic, setIsStatic] = useState<boolean>(false);
  const [sqlConfig, setSqlConfig] = useState<TSqlConfig | null>(null);

  const btnStartEndIsActive = updateType === datePartsToSet.both;
  const btnStartIsActive = updateType === datePartsToSet.from;
  const btnEndIsActive = updateType === datePartsToSet.to;

  const processShifts = useCallback(({ rowsCount, responseFields }) => {
    return Array.from({ length: rowsCount })
      .reduce((res: any[], _row: any, rowIndex: number) => {
        return [
          ...res,
          responseFields.reduce((resFields: {}, field: any) => {
            return {
              ...resFields,
              [field.name]: field.values.toArray()[rowIndex],
            };
          }, {}),
        ];
      }, [])
      .reduce((shiftRes, shift) => {
        return [
          ...shiftRes,
          {
            selected: false,
            text: Object.values(shift).join('|'),
            value: shift.uuid,
          },
        ];
      }, []);
  }, []);
  const processStaticOptions = useCallback((shiftOptions) => {
    const options = {
      options: shiftOptions.reduce((res: any, item: TStaticShift) => {
        return [
          ...res,
          {
            text: item.label,
            value: item.uuid,
            selected: false,
          },
        ];
      }, []),
    };
    return options;
  }, []);
  const setAlertHandler = useCallback(
    (alert: TAlert) => {
      const isDuplicate = !!alerts.find(({ id, text }) => id === alert.id && text === alert.text);

      if (isDuplicate) {
        return;
      }

      const allAlerts = alerts.filter(({ id }: { id: number }) => alert.id !== id);
      return setAlerts(() => [...allAlerts, alert]);
    },
    [alerts]
  );

  const resetAlert = useCallback(
    (id: number) => {
      const isExisting = !!alerts.find((alert) => id === alert.id);

      if (!isExisting) {
        return;
      }

      return setAlerts((alerts: TAlert[]) => [...alerts.filter(({ id: _id }: { id: number }) => _id !== id)]);
    },
    [alerts]
  );

  const setTypeChangeHandler = (type: string) => {
    if (type !== updateType) {
      setUpdateType(type);
      setCustomTimeRange((d: any) => ({
        ...d,
        uuid: null,
      }));
    }
  };
  const shiftSelectHandler = (shift: ShiftI) => setShiftParams(shift);
  const setShiftParams = (shift: ShiftI) => {
    const { from, to } = updateDateTime(shift) || {};

    if (from && to) {
      setCustomTimeRange(() => ({
        from,
        to,
        uuid: shift.uuid,
      }));
    }
  };
  const getQueryDate = (type: string) => {
    const queryTime = new URLSearchParams(window.location.search).get(type);
    const time = !queryTime || queryTime?.includes('now') ? timeRange.from : dateTimeAsMoment(+queryTime);
    return time;
  };
  const dateFormat = 'yyyy-MM-dd';
  const dateTimeFormat = `YYYY-MM-DD HH:mm:ss`;

  function getRelativeDates() {
    const relativeFrom = new URLSearchParams(window.location.search).get('from')?.includes('now');
    const relativeTo = new URLSearchParams(window.location.search).get('to')?.includes('now');

    return {
      relativeFrom,
      relativeTo,
    };
  }

  function updateDateTime(shift: ShiftI) {
    let { relativeFrom, relativeTo } = getRelativeDates();
    let fromDate: any;
    let toDate: any;

    if (updateType === datePartsToSet.from) {
      fromDate = dateTimeAsMoment(productionDate);
      toDate = timeRange.to;
    } else if (updateType === datePartsToSet.to) {
      fromDate = timeRange.from;
      toDate = dateTimeAsMoment(productionDate);
    } else {
      fromDate = dateTimeAsMoment(productionDate);
      toDate = dateTimeAsMoment(productionDate);
    }

    let tFrom: string;
    let tTo: string;
    let { start, end, order } = shift;
    const [mObjStart, mObjEnd] = [dateTimeAsMoment(`2020-01-01 ${start}`), dateTimeAsMoment(`2020-01-01 ${end}`)];
    const shiftDiffDay = mObjStart.unix() > mObjEnd.unix();

    if (shiftDiffDay) {
      if (order === 1 && (updateType === datePartsToSet.both || updateType === datePartsToSet.from)) {
        fromDate.subtract(1, 'days');
      } else if (updateType === datePartsToSet.both || updateType === datePartsToSet.to) {
        toDate.add(1, 'days');
      }
    }

    if (updateType === datePartsToSet.both) {
      relativeFrom = false;
      relativeTo = false;
    } else if (updateType === datePartsToSet.from) {
      if (!relativeTo) {
        end = getQueryDate('to').format('HH:mm:ss');
      }
      relativeFrom = false;
    } else if (updateType === datePartsToSet.to) {
      if (!relativeFrom) {
        start = getQueryDate('from').format('HH:mm:ss');
      }
      relativeTo = false;
    }

    const fromString = fromDate.format('YYYY-MM-DD');
    tFrom = `${fromString} ${start}`;
    tTo = `${toDate.format('YYYY-MM-DD')} ${end}`;
    const from: any = !relativeFrom
      ? dateTimeAsMoment(tFrom).unix() * 1000
      : new URLSearchParams(window.location.search).get('from');
    const to: any = !relativeTo
      ? dateTimeAsMoment(tTo).unix() * 1000
      : new URLSearchParams(window.location.search).get('to');
    const _checkFrom = dateTimeAsMoment(from);
    const _checkTo = dateTimeAsMoment(to);

    if (_checkFrom.unix() >= _checkTo.unix()) {
      setAlertHandler({
        id: 2,
        type: 'brandDanger',
        text: `Error! From (${_checkFrom.format('YYYY-MM-DD HH:mm')}) to (${_checkTo.format(
          'YYYY-MM-DD HH:mm'
        )}) is an invalid date-time range selection! Please try again.`,
      });
    } else if (alerts.find(({ id }) => id === 2)) {
      resetAlert(2);
    }

    return {
      from,
      to,
      diffSet: {},
    };
  }

  const getValues = useCallback(async () => {
    try {
      if (isStatic && sqlConfig?.static?.shifts) {
        const staticShiftsValues = sqlConfig?.static?.shifts.reduce((res: any[], item: TStaticShift) => {
          return [
            ...res,
            {
              selected: false,
              text: [item.group, item.group_uuid, item.uuid, item.startTime, item.endTime, item.order].join('|'),
              value: item.uuid,
            },
          ];
        }, []);

        if (staticShiftsValues.length) {
          setShiftValues(() => staticShiftsValues);
          return resetAlert(4);
        }
      }

      const db = getBackendSrv() as BackendSrv;
      const dataSources = getDataSourceSrv().getList() as any;
      const datasourceRef: IVariableModel | null =
        (templateSrv.getVariables().find(({ name }) => name === vars.varDataModel) as IVariableModel) || null;

      if (!datasourceRef || !sqlConfig) {
        return setAlertHandler({
          id: 3,
          type: 'brandDanger',
          text: `Error! Missing ${vars.varQueryMapper} variable for the mapping!`,
        });
      }

      const { id: datasourceId } =
        dataSources.find(({ name }: { name: string }) => name === datasourceRef.current.value) || {};

      if (!datasourceId) {
        return setAlertHandler({
          id: 3,
          type: 'brandDanger',
          text: `Error! Datasource 'Shifts Data Model' not found! Please make sure you have this datasource set up correctly.`,
        });
      }

      if (
        [
          ...Object.values(sqlConfig.project.shift_groups),
          ...Object.values(sqlConfig.project.shifts),
          ...Object.values(sqlConfig.lookup),
        ].filter((v) => !!!v).length
      ) {
        return setAlertHandler({
          id: 3,
          type: 'brandDanger',
          text: `Error! Datasource 'Shifts Data Model' incomplete! Please make sure you have this data model set up correctly.`,
        });
      }

      const sSchema = sqlConfig.schema.shift_groups ? `${sqlConfig.schema.shift_groups}.` : '';
      const sgSchema = sqlConfig.schema.shift_groups ? `${sqlConfig.schema.shift_groups}.` : '';
      const refId = vars.varShiftsValuesName;
      const query = {
        refId,
        datasourceId,
        rawSql: sqlstring.format(
          `SELECT ??, ?? AS group_uuid, ??, ??, ??, ??
FROM ?? s
LEFT JOIN ?? sg ON ?? = ??
${siteUUID ? 'WHERE ?? = ?' : ''}
ORDER by ??, ??
`,
          [
            `sg.${sqlConfig.project.shift_groups.name}`,
            `sg.${sqlConfig.project.shift_groups.uuid}`,
            `s.${sqlConfig.project.shifts.uuid}`,
            `s.${sqlConfig.project.shifts.start_time}`,
            `s.${sqlConfig.project.shifts.end_time}`,
            `s.${sqlConfig.project.shifts.order}`,
            `${sSchema}${sqlConfig.lookup.shifts}`,
            `${sgSchema}${sqlConfig.lookup.shift_groups}`,
            `sg.${sqlConfig.project.shift_groups.uuid}`,
            `s.${sqlConfig.project.shifts.group_uuid}`,
            ...(siteUUID ? [`sg.${sqlConfig.project.shift_groups.site_uuid}`, siteUUID] : []),
            `sg.${sqlConfig.project.shift_groups.name}`,
            `s.${sqlConfig.project.shifts.order}`,
          ]
        ),
        format: 'table',
      };

      const response = ((await db
        .fetch({
          url: '/api/ds/query',
          method: 'post',
          data: {
            queries: [query],
            from: '0',
            to: '0',
          },
        })
        .toPromise()) as { data: { results: { shifts_values: { dataframes: DataFrame[] } } } }) as any;

      const { data: queries, state } = toDataQueryResponse(response) as DataQueryResponse;

      if (state === LoadingState.Done) {
        const { fields: responseFields } =
          queries.find((instance) => instance.refId === vars.varShiftsValuesName) || {};
        const [field]: [{ name: string; values: Vector }] = responseFields;
        const rowsCount = field?.values?.toArray().length || 0;

        if (rowsCount) {
          const shifts = processShifts({ rowsCount, responseFields });

          if (shifts.length) {
            setShiftValues(() => shifts);
            return resetAlert(4);
          }
        }

        setAlertHandler({
          id: 4,
          type: 'brandWarning',
          text: `Warning! Couldn\'t retrieve shift values for site with UUID: ${siteUUID}`,
        });
      }
    } catch (error: any) {
      setAlertHandler({
        id: 4,
        type: 'brandDanger',
        text: `Service error: ${error?.message || error?.statusText}`,
      });
      throw error;
    }
  }, [siteUUID, sqlConfig, isStatic, resetAlert, setAlertHandler, setShiftValues, processShifts, templateSrv]);

  useEffect(() => {
    const dateRange = {
      from: timeRange.from.format(dateTimeFormat),
      to: timeRange.to.format(dateTimeFormat),
    };

    setInitDateRage(() => dateRange);

    if (customTimeRange) {
      const { from, to, uuid } = customTimeRange || {};
      const fromCheck = typeof from === 'string' ? timeRange.from.unix() * 1000 : from;
      const toCheck = typeof to === 'string' ? timeRange.to.unix() * 1000 : to;
      const isSwapDates = fromCheck > toCheck;

      locationSrv.update({
        partial: true,
        query: {
          from: isSwapDates ? to : from,
          to: isSwapDates ? from : to,
          [vars.queryShiftsOptions]: uuid,
        },
        replace: true,
      });
    }
  }, [dateTimeFormat, locationSrv, customTimeRange, timeRange.to, timeRange.from, setInitDateRage]);

  useEffect(() => {
    if (width < 400) {
      setViewType(() => EViewType.column);
    } else {
      setViewType(() => EViewType.row);
    }
  }, [width, height, setViewType]);

  useEffect(() => {
    if (!shiftOptions || !shiftOptions?.options?.length) {
      if (shiftOptions?.options?.length === 0) {
        setAlertHandler({
          id: 5,
          type: 'brandWarning',
          text: `No shifts available for this site ${siteUUID}`,
        });
      } else {
        setAlertHandler({
          id: 5,
          type: 'brandDanger',
          text: `Error! Please configure the panel variables. For more info see documentation`,
        });
      }
    } else if (alerts.find(({ id }) => id === 5)) {
      resetAlert(5);
    }
  }, [resetAlert, shiftOptions, alerts, setAlertHandler, siteUUID]);

  useEffect(() => {
    if (shiftValues.length && shiftOptions?.options && !closedAlerts.includes(1)) {
      const shiftGroupUUIDs: { [key: string]: number } = shiftValues.reduce((res: any, { text }: { text: string }) => {
        const [, shiftGroupUUID] = text.split('|');
        return {
          ...res,
          [shiftGroupUUID]: res[shiftGroupUUID] ? ++res[shiftGroupUUID] : 1,
        };
      }, {});
      const shiftOptionsCount = Object.values(shiftGroupUUIDs).reduce((acc: number, d: number): number => acc + d, 0);

      if (shiftOptionsCount !== shiftOptions.options.length) {
        if (shiftOptions.options.length > 1) {
          return setAlertHandler({
            id: 1,
            type: 'brandWarning',
            text:
              'Warning! You are missing shifts because some shiftnames are not unique. Please make sure all shifts have unique names!',
          });
        } else {
          return setAlertHandler({
            id: 1,
            type: 'brandWarning',
            text: 'Warning! No shifts available. Please check your shift options variable.',
          });
        }
      }

      if (alerts.find(({ id }) => id === 1)) {
        resetAlert(1);
      }
    }
  }, [closedAlerts, alerts, shiftOptions, shiftValues, resetAlert, setAlertHandler]);

  useEffect(() => {
    if (sqlConfig) {
      getValues();
    }
  }, [siteUUID, sqlConfig, getValues]);

  useEffect(() => {
    if (isStatic && sqlConfig?.static?.shifts) {
      setShiftOptions(() => processStaticOptions(sqlConfig.static?.shifts));
    } else {
      setShiftOptions(() =>
        templateSrv.getVariables().find(({ name }: { name: string }) => name === vars.queryShiftsOptions)
      );
    }
  }, [isStatic, sqlConfig, setShiftOptions, processStaticOptions, templateSrv]);

  useEffect(() => {
    try {
      if (!sqlConfig) {
        const rawSqlData: IVariableModel | null =
          (templateSrv.getVariables().find(({ name }) => name === vars.varQueryMapper) as IVariableModel) || null;

        if (!rawSqlData) {
          return setAlertHandler({
            id: 3,
            type: 'brandDanger',
            text: `Error! Missing ${vars.varQueryMapper} variable for the mapping!`,
          });
        }

        const data = JSON.parse(rawSqlData.current.value);

        setIsStatic(!!data.static?.shifts);

        if (!!data?.values?.site_uuid) {
          setSiteUUID(() => data.values.site_uuid);
        }

        setSqlConfig(() => data);
      }

      if (!!sqlConfig?.static?.shifts.length) {
        setShiftOptions(() => processStaticOptions(sqlConfig.static?.shifts));
      } else {
        setShiftOptions(() => templateSrv.getVariables().find(({ name }) => name === vars.queryShiftsOptions) || null);
      }

      if (!initDateRage) {
        setInitDateRage(() => ({
          from: dateRange.from.format(dateTimeFormat),
          to: dateRange.to.format(dateTimeFormat),
        }));
      }

      getRelativeDates();
    } catch (error) {
      setAlertHandler({
        id: 3,
        type: 'brandDanger',
        text: `Error! Missing ${vars.varQueryMapper} variable for the mapping!`,
      });
    }
  }, [
    setSiteUUID,
    setSqlConfig,
    setAlertHandler,
    setShiftOptions,
    setInitDateRage,
    processStaticOptions,
    initDateRage,
    templateSrv,
    sqlConfig,
    siteUUID,
    dateTimeFormat,
    dateRange,
  ]);

  return (
    <ShiftSelectorWrapper>
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
          <SelectorInputs>
            <ProductionDay isDark={isDark}>
              <span>Select day</span>
              <DatePicker
                className="production-day-selector"
                selected={productionDate}
                onChange={(date: Date) => setProductionDate(+date)}
                dateFormat={dateFormat}
              />
              <RangeButton
                title="Set shift times both from and to times"
                icon="mdi-ray-start-end"
                onClick={() => setTypeChangeHandler(datePartsToSet.both)}
                isActive={btnStartEndIsActive}
              />
              <RangeButton
                title="Set shift start time"
                icon="mdi-ray-start"
                onClick={() => setTypeChangeHandler(datePartsToSet.from)}
                isActive={btnStartIsActive}
              />
              <RangeButton
                title="Set shift end time"
                icon="mdi-ray-end"
                onClick={() => setTypeChangeHandler(datePartsToSet.to)}
                isActive={btnEndIsActive}
              />
            </ProductionDay>
          </SelectorInputs>
          {shiftValues.length && shiftOptions?.options?.length ? (
            <ShiftOptions
              data={shiftValues}
              setType={updateType}
              viewType={_viewType}
              shiftSelectHandler={shiftSelectHandler}
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
