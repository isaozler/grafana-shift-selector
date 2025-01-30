import { useState, useCallback, useEffect } from 'react';

import sqlstring from 'sqlstring';

import { DataFrame, LoadingState, Vector, TimeRange, PanelProps } from '@grafana/data';
import {
  getBackendSrv,
  getDataSourceSrv,
  toDataQueryResponse,
  RefreshEvent,
  getTemplateSrv,
  TemplateSrv,
  locationService,
  FetchResponse,
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
import { dateTimeFormat, getInitGroupUUID, getRelativeDates, startHourIsGreater, transformShiftData, updateActiveShift } from '../utils';
import { firstValueFrom } from 'rxjs';

type TDataResponse = { data: { results: { shifts_values: { dataframes: DataFrame[] } } } }

let isInitiated = false;
let refresh: null | string = null

export const useShiftSelectorHook = (props: PanelProps<TPropOptions>) => {
  const { data: _data, width, height, timeRange, eventBus } = props;
  const {
    isAutoSelectShift,
    isDataSourceShifts,
    isOptionGroupLabelTrimmed,
    var_query_map_dynamic,
    var_query_map_static,
    shiftSelectorPluginPanel,
    isBlockedRender,
  } = props.options;

  const locationSrv = locationService;
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
  const [autoSelectShiftGroup, setAutoSelectShiftGroup] = useState<string>(locationService.getSearch().get(vars.queryShiftsGroup) ?? props.options.autoSelectShiftGroup);

  const processShifts = useCallback(({ rowsCount, responseFields }: { rowsCount: number; responseFields: [] }) => {
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
  const processStaticOptions = useCallback((shiftOptions: TStaticShift[] | undefined) => {
    const options = {
      options: shiftOptions?.reduce((res: any, item: TStaticShift) => {
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
    [setAlerts, alerts]
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
    return {
      refresh: locationService.getSearch().get('refresh'),
    }
  }, []);

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
        const searchTo = locationService.getSearch().get('to');
        updateTimeRange.to = searchTo ? +searchTo : updateTimeRange.to;
        params = {};
      } else if (updateType === 'to') {
        const searchFrom = locationService.getSearch().get('from');
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
  const getValues = useCallback(async (payload?: TSqlConfig | null) => {
    let config = payload || sqlConfig;
    try {
      if (isStatic && config?.static?.shifts) {
        const staticShiftsValues = config?.static?.shifts.reduce((res: any[], item: TStaticShift) => {
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
        (templateSrv.getVariables().find(({ name }: { name: string }) => name === vars.varDataModel) as IVariableModel) || null;

      if (!datasourceRef || !config) {
        if (!alerts.find(({ id }) => id === 3)) {
          return setAlertHandler({
            id: 3,
            type: 'brandDanger',
            text: `Error! Missing data source settings please check if your ${vars.varDataModel} and ${vars.queryShiftsOptions} variables are set correctly!`,
          });
        }

        return;
      }

      const { id: datasourceId } =
        dataSources.find(({ name, uid }: { name: string, uid: string }) => name === datasourceRef.current.value || uid === datasourceRef.current.value) || {};

      if (!datasourceId) {
        return setAlertHandler({
          id: 3,
          type: 'brandDanger',
          text: `Error! Datasource 'Shifts Data Model' not found! Please make sure you have this datasource set up correctly.`,
        });
      }

      if (
        [
          ...Object.values(config.project.shift_groups),
          ...Object.values(config.project.shifts),
          ...Object.values(config.lookup),
        ].filter((v) => !v).length
      ) {
        return setAlertHandler({
          id: 3,
          type: 'brandDanger',
          text: `Error! Datasource 'Shifts Data Model' incomplete! Please make sure you have this data model set up correctly.`,
        });
      }

      const sSchema = config.schema.shift_groups ? `${config.schema.shift_groups}.` : '';
      const sgSchema = config.schema.shift_groups ? `${config.schema.shift_groups}.` : '';
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
            `sg.${config.project.shift_groups.name}`,
            `sg.${config.project.shift_groups.uuid}`,
            `s.${config.project.shifts.uuid}`,
            `s.${config.project.shifts.start_time}`,
            `s.${config.project.shifts.end_time}`,
            `s.${config.project.shifts.order}`,
            `${sSchema}${config.lookup.shifts}`,
            `${sgSchema}${config.lookup.shift_groups}`,
            `sg.${config.project.shift_groups.uuid}`,
            `s.${config.project.shifts.group_uuid}`,
            ...(siteUUID ? [`sg.${config.project.shift_groups.site_uuid}`, siteUUID] : []),
            `sg.${config.project.shift_groups.name}`,
            `s.${config.project.shifts.order}`,
          ]
        ),
        format: 'table',
      };

      const response = await firstValueFrom(db.fetch({
        url: '/api/ds/query',
        method: 'post',
        data: {
          queries: [query],
          from: '0',
          to: '0',
        },
      })) as unknown as TDataResponse;

      const { data: queries, state } = toDataQueryResponse(response as FetchResponse);

      if (state === LoadingState.Done) {
        const { fields: responseFields } =
          queries.find((instance: any) => instance.refId === vars.varShiftsValuesName) || {};
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
  }, [siteUUID, sqlConfig, isStatic, resetAlert, setAlertHandler, setShiftValues, processShifts, templateSrv, alerts]);

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
      let { refresh: _refresh } = getRefreshRate()

      if (refresh && !_refresh) {
        _refresh = refresh
      } else if (!refresh && _refresh) {
        refresh = _refresh
      }

      const query = {
        from: (new Date(isSwapDates ? to : from)).toISOString(),
        to: (new Date(isSwapDates ? from : to)).toISOString(),
        [vars.queryShiftsGroup]: autoSelectShiftGroup,
        [vars.queryShiftsOptions]: uuid,
        refresh: _refresh,
      };

      locationSrv.partial(query, false);
    }
  }, [locationSrv, customTimeRange, timeRange.to, timeRange.from, getRefreshRate, setInitDateRange, autoSelectShiftGroup, isAutoSelectShift]);

  useEffect(() => {
    if (width < 400) {
      setViewType(() => EViewType.column);
    } else {
      setViewType(() => EViewType.row);
    }
  }, [width, height, setViewType]);

  useEffect(() => {
    if (!shiftOptions?.options?.length) {
      if (!alerts.find(({ id }) => id === 5)) {
        setAlertHandler({
          id: 5,
          type: 'brandWarning',
          text: siteUUID ? `No shifts available for site "${siteUUID}"` : "No shifts available for this site",
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
    if ((sqlConfig && siteUUID) || isStatic) {
      getValues();
    } else if (sqlConfig && !siteUUID && !isStatic && !alerts.find(({ id }) => id === 3)) {
      getValues(sqlConfig);
    }
  }, [siteUUID, sqlConfig, getValues, isStatic, alerts]);

  useEffect(() => {
    if (isStatic && sqlConfig?.static?.shifts) {
      setShiftOptions(() => processStaticOptions(sqlConfig.static?.shifts));
    } else {
      const panelVariables = templateSrv.getVariables()
      setShiftOptions(panelVariables.find(({ name }: { name: string; }) => name === vars.queryShiftsOptions));
    }
  }, [isStatic, sqlConfig, setShiftOptions, processStaticOptions, templateSrv]);

  useEffect(() => {
    const isRealtimeActive = !!(isAutoSelectShift && autoSelectShiftGroup);

    if (isAutoSelectShift && !autoSelectShiftGroup && shiftOptions?.options?.length && shiftValues?.length) {
      const initGroup = getInitGroupUUID(shiftOptions.options, shiftValues)

      locationSrv.partial({
        [vars.queryShiftsGroup]: initGroup,
        ...getRefreshRate(),
      }, false);
      setAutoSelectShiftGroup(initGroup)
    }

    if (!isInitiated && isRealtimeActive && autoSelectShiftGroup && shiftOptions?.options?.length && shiftValues?.length && productionDate) {
      isInitiated = true;

      updateActiveShift({
        setShiftParams,
        autoSelectShiftGroup,
        isAutoSelectShift,
        isOptionGroupLabelTrimmed,
        shifts: {
          options: shiftOptions.options,
          values: shiftValues,
        },
        setProductionDate,
        productionDate,
        isBlockedRender,
      });
    }

    const subscriber = eventBus.getStream(RefreshEvent).subscribe((event) => {
      if (isRealtimeActive) {
        updateActiveShift({
          setShiftParams,
          autoSelectShiftGroup,
          isAutoSelectShift,
          isOptionGroupLabelTrimmed,
          shifts: {
            options: shiftOptions.options,
            values: shiftValues,
          },
          setProductionDate,
          productionDate,
          isBlockedRender,
        });
      }
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [
    locationSrv,
    productionDate,
    eventBus,
    setShiftParams,
    autoSelectShiftGroup,
    isAutoSelectShift,
    isOptionGroupLabelTrimmed,
    shiftOptions,
    shiftValues,
    props.timeRange.from,
    props.timeRange.to,
    shiftSelectorPluginPanel,
    getRefreshRate,
    isBlockedRender,
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

    try {
      const data = JSON.parse(rawSqlData);

      setIsStatic(!!data.static?.shifts);

      if (data?.values?.site_uuid) {
        resetAlert(3);
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
    let data: any;

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
          data = JSON.parse(rawSqlData);

          setIsStatic(!!data.static?.shifts);

          if (data?.values?.site_uuid) {
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
      } else if (sqlConfig?.static?.shifts.length) {
        setShiftOptions(() => processStaticOptions(sqlConfig.static?.shifts));
      } else {
        const shiftUUIDCountMap = templateSrv.getVariables().find(({ name }: { name: string }) => name === vars.queryShiftsOptions);
        setShiftOptions(() => shiftUUIDCountMap ?? null);
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

    setAlerts,
    setClosedAlerts,
    setCustomTimeRange,
    setUpdateType,
    setShiftParams,
    setManualShiftParams,

    productionDate,
    setProductionDate,
  };
};
