import { useState, useCallback, useEffect } from 'react';

import sqlstring from 'sqlstring';

import { DataFrame, LoadingState, Vector, TimeRange, PanelProps } from '@grafana/data';
import {
  getBackendSrv,
  getDataSourceSrv,
  toDataQueryResponse,
  RefreshEvent,
  getLocationSrv,
  getTemplateSrv,
  TemplateSrv,
} from '@grafana/runtime';

import {
  datePartsToSet,
  EViewType,
  IVariableModel,
  ShiftI,
  TAlert,
  TExtendedShift,
  TPropOptions,
  TSqlConfig,
  TStaticShift,
  vars,
} from '../types';
import { dateTimeFormat, getRelativeDates, startHourIsGreater, transformShiftData, updateActiveShift } from '../utils';

export const useShiftSelectorHook = (props: PanelProps) => {
  const { data: _data, width, height, timeRange, eventBus } = props;
  const {
    isAutoSelectShift,
    autoSelectShiftGroup,
    refreshInterval,
    isDataSourceShifts,
    var_query_map_dynamic,
    var_query_map_static,
  } = props.options as TPropOptions;

  const locationSrv = getLocationSrv();
  const templateSrv = getTemplateSrv() as TemplateSrv & { timeRange: TimeRange };
  const dateRange = templateSrv.timeRange;

  const [_viewType, setViewType] = useState<string>('default');
  const [initDateRange, setInitDateRange] = useState<any>(null);
  const [shiftOptions, setShiftOptions] = useState<any>({});
  const [shiftValues, setShiftValues] = useState<any>([]);
  const [customTimeRange, setCustomTimeRange] = useState<any>(null);
  const [alerts, setAlerts] = useState<TAlert[] | []>([]);
  const [updateType, setUpdateType] = useState<string>(datePartsToSet.both);
  const [closedAlerts, setClosedAlerts] = useState<number[]>([]);
  const [productionDate, setProductionDate] = useState<number>(timeRange.from.unix() * 1000);
  const [siteUUID, setSiteUUID] = useState<any>();
  const [isStatic, setIsStatic] = useState<boolean>(false);
  const [sqlConfig, setSqlConfig] = useState<TSqlConfig | null>(null);

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
  const getRefreshRate = useCallback(() => {
    const refreshValue = new URLSearchParams(window.location.search).get('refresh');
    const refresh = {
      ...(refreshValue ? { refresh: refreshValue } : isAutoSelectShift ? { refresh: refreshInterval } : {}),
    };

    return refresh;
  }, [isAutoSelectShift, refreshInterval]);
  // const getQueryDate = useCallback(
  //   (type: string) => {
  //     const queryTime = new URLSearchParams(window.location.search).get(type);
  //     const time = !queryTime || queryTime?.includes('now') ? timeRange.from : dateTimeAsMoment(+queryTime);
  //     return time;
  //   },
  //   [timeRange.from]
  // );
  // const updateDateTime = useCallback(
  //   (shift: ShiftI) => {
  //     let { relativeFrom, relativeTo } = getRelativeDates();
  //     let fromDate: any;
  //     let toDate: any;

  //     if (updateType === datePartsToSet.from) {
  //       fromDate = dateTimeAsMoment(productionDate);
  //       toDate = timeRange.to;
  //     } else if (updateType === datePartsToSet.to) {
  //       fromDate = timeRange.from;
  //       toDate = dateTimeAsMoment(productionDate);
  //     } else {
  //       fromDate = dateTimeAsMoment(productionDate);
  //       toDate = dateTimeAsMoment(productionDate);
  //     }

  //     let tFrom: string;
  //     let tTo: string;
  //     let { start, end, order } = shift;
  //     const [mObjStart, mObjEnd] = [dateTimeAsMoment(`2020-01-01 ${start}`), dateTimeAsMoment(`2020-01-01 ${end}`)];
  //     const shiftDiffDay = mObjStart.unix() > mObjEnd.unix();

  //     if (shiftDiffDay) {
  //       if (order === 1 && (updateType === datePartsToSet.both || updateType === datePartsToSet.from)) {
  //         fromDate.subtract(1, 'days');
  //       } else if (updateType === datePartsToSet.both || updateType === datePartsToSet.to) {
  //         toDate.add(1, 'days');
  //       }
  //     }

  //     if (updateType === datePartsToSet.both) {
  //       relativeFrom = false;
  //       relativeTo = false;
  //     } else if (updateType === datePartsToSet.from) {
  //       if (!relativeTo) {
  //         end = getQueryDate('to').format('HH:mm:ss');
  //       }
  //       relativeFrom = false;
  //     } else if (updateType === datePartsToSet.to) {
  //       if (!relativeFrom) {
  //         start = getQueryDate('from').format('HH:mm:ss');
  //       }
  //       relativeTo = false;
  //     }

  //     const fromString = fromDate.format('YYYY-MM-DD');
  //     tFrom = `${fromString} ${start}`;
  //     tTo = `${toDate.format('YYYY-MM-DD')} ${end}`;
  //     const from: any = !relativeFrom
  //       ? dateTimeAsMoment(tFrom).unix() * 1000
  //       : new URLSearchParams(window.location.search).get('from');
  //     const to: any = !relativeTo
  //       ? dateTimeAsMoment(tTo).unix() * 1000
  //       : new URLSearchParams(window.location.search).get('to');
  //     const _checkFrom = dateTimeAsMoment(from);
  //     const _checkTo = dateTimeAsMoment(to);

  //     if (_checkFrom.unix() >= _checkTo.unix()) {
  //       setAlertHandler({
  //         id: 2,
  //         type: 'brandDanger',
  //         text: `Error! From (${_checkFrom.format('YYYY-MM-DD HH:mm')}) to (${_checkTo.format(
  //           'YYYY-MM-DD HH:mm'
  //         )}) is an invalid date-time range selection! Please try again.`,
  //       });
  //     } else if (alerts.find(({ id }) => id === 2)) {
  //       resetAlert(2);
  //     }

  //     return {
  //       from,
  //       to,
  //       diffSet: {},
  //     };
  //   },
  //   [alerts, getQueryDate, productionDate, resetAlert, setAlertHandler, timeRange.from, timeRange.to, updateType]
  // );
  const setShiftParams = useCallback(
    (shift: TExtendedShift, isManualUpdate = false) => {
      const { startDate, endDate } = shift || {};

      const from = startDate.unix() * 1000;
      const to = endDate.unix() * 1000;

      if (isAutoSelectShift && isManualUpdate) {
        return setAlertHandler({
          id: 10,
          type: 'brandDanger',
          text: `Warning! Currently the selector is in realtime mode. You can change this in the panel options by disabling the "Real-time shift auto-select" inside the "Behavior" panel options.`,
        });
      }

      if (from && to) {
        setCustomTimeRange(() => ({
          from,
          to,
          uuid: shift.uuid,
        }));
      }
    },
    [isAutoSelectShift, setAlertHandler, setCustomTimeRange]
  );
  const setManualShiftParams = useCallback(
    (shift: TExtendedShift, productionDate: number) => {
      const { startDate, endDate } =
        transformShiftData(
          (shift as unknown) as ShiftI & { index: number },
          startHourIsGreater(shift.start, shift.end),
          productionDate
        ) || {};

      let updateTimeRange = {
        from: startDate.unix() * 1000,
        to: endDate.unix() * 1000,
      };
      let params: { uuid?: string } = {
        uuid: shift.uuid,
      };

      if (updateType === 'from') {
        const searchTo = new URLSearchParams(window.location.search).get('to');
        updateTimeRange.to = searchTo ? +searchTo : updateTimeRange.to;
        params = {};
      } else if (updateType === 'to') {
        const searchFrom = new URLSearchParams(window.location.search).get('from');
        updateTimeRange.from = searchFrom ? +searchFrom : updateTimeRange.from;
        params = {};
      }

      if (updateTimeRange.from && updateTimeRange.to) {
        setCustomTimeRange(() => ({
          ...updateTimeRange,
          ...params,
        }));
      }
    },
    [setCustomTimeRange, updateType]
  );
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

      const db = getBackendSrv();
      const dataSources = getDataSourceSrv().getList() as any;
      const datasourceRef: IVariableModel | null =
        (templateSrv.getVariables().find(({ name }) => name === vars.varDataModel) as IVariableModel) || null;

      if (!datasourceRef || !sqlConfig) {
        return setAlertHandler({
          id: 3,
          type: 'brandDanger',
          text: `Error! Missing data source settings please check if your ${vars.varDataModel} and ${vars.queryShiftsOptions} variables are set correctly!`,
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

      const { data: queries, state } = toDataQueryResponse(response);

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

    setInitDateRange(() => dateRange);

    if (customTimeRange) {
      const { from, to, uuid } = customTimeRange || {};
      const fromCheck = typeof from === 'string' ? timeRange.from.unix() * 1000 : from;
      const toCheck = typeof to === 'string' ? timeRange.to.unix() * 1000 : to;
      const isSwapDates = fromCheck > toCheck;
      const query = {
        from: isSwapDates ? to : from,
        to: isSwapDates ? from : to,
        [vars.queryShiftsOptions]: uuid,
        ...getRefreshRate(),
      };

      locationSrv.update({
        partial: true,
        query,
      });
    }
  }, [locationSrv, customTimeRange, timeRange.to, timeRange.from, getRefreshRate, setInitDateRange]);

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
    locationSrv.update({
      partial: true,
      query: {
        ...getRefreshRate(),
      },
    });
  }, [locationSrv, getRefreshRate]);

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
    const subscriber = eventBus.getStream(RefreshEvent).subscribe((event) => {
      const isRealtimeActive = !!(isAutoSelectShift && autoSelectShiftGroup);

      if (isRealtimeActive) {
        updateActiveShift({
          setShiftParams,
          autoSelectShiftGroup,
          isAutoSelectShift,
          shifts: {
            options: shiftOptions.options,
            values: shiftValues,
          },
          setProductionDate,
          productionDate,
        });
      }
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [
    productionDate,
    eventBus,
    setShiftParams,
    autoSelectShiftGroup,
    isAutoSelectShift,
    shiftOptions,
    shiftValues,
    props.timeRange.from,
    props.timeRange.to,
  ]);

  useEffect(() => {
    const rawSqlData = isDataSourceShifts ? var_query_map_dynamic : var_query_map_static;

    if (!rawSqlData) {
      return setAlertHandler({
        id: 3,
        type: 'brandDanger',
        text: `Error! Missing the shift mapping. Please checkout your "Data Mapper" panel and provide a valid mapping!`,
      });
    }

    resetAlert(3);

    try {
      const data = JSON.parse(rawSqlData);

      setIsStatic(!!data.static?.shifts);

      if (!!data?.values?.site_uuid) {
        setSiteUUID(() => data.values.site_uuid);
      }

      setSqlConfig(() => data);
    } catch (error) {
      setAlertHandler({
        id: 3,
        type: 'brandDanger',
        text: `Error! Invalid shift mapping. Please checkout your "Data Mapper" panel and provide a valid mapping! See the documentation for more info!`,
      });
    }
  }, [isDataSourceShifts, var_query_map_dynamic, var_query_map_static, resetAlert, setAlertHandler]);

  useEffect(() => {
    try {
      if (!sqlConfig) {
        const rawSqlData = isDataSourceShifts ? var_query_map_dynamic : var_query_map_static;

        if (!rawSqlData) {
          return setAlertHandler({
            id: 3,
            type: 'brandDanger',
            text: `Error! Missing the shift mapping. Please checkout your "Data Mapper" panel and provide a valid mapping!`,
          });
        }

        resetAlert(3);

        try {
          const data = JSON.parse(rawSqlData);

          setIsStatic(!!data.static?.shifts);

          if (!!data?.values?.site_uuid) {
            setSiteUUID(() => data.values.site_uuid);
          }

          setSqlConfig(() => data);
        } catch (error) {
          setAlertHandler({
            id: 3,
            type: 'brandDanger',
            text: `Error! Invalid shift mapping. Please checkout your "Data Mapper" panel and provide a valid mapping! See the documentation for more info!`,
          });
        }
      }

      if (!!sqlConfig?.static?.shifts.length) {
        setShiftOptions(() => processStaticOptions(sqlConfig.static?.shifts));
      } else {
        setShiftOptions(() => templateSrv.getVariables().find(({ name }) => name === vars.queryShiftsOptions) || null);
      }

      if (!initDateRange) {
        setInitDateRange(() => ({
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
    resetAlert,
    isDataSourceShifts,
    var_query_map_dynamic,
    var_query_map_static,
    setSiteUUID,
    setSqlConfig,
    setAlertHandler,
    setShiftOptions,
    setInitDateRange,
    processStaticOptions,
    initDateRange,
    templateSrv,
    sqlConfig,
    siteUUID,
    dateRange,
  ]);

  return {
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
    setManualShiftParams,

    productionDate,
    setProductionDate,
  };
};
