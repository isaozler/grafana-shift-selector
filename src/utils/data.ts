import { getBackendSrv, getDataSourceSrv, getTemplateSrv, TemplateSrv } from '@grafana/runtime';
import { firstValueFrom } from 'rxjs';
import { IVariableModel, ShiftI, TDataResponse, TDbQuery, TSqlConfig, vars } from '../types';
import { DataSourceInstanceSettings, DataSourceJsonData, TimeRange } from '@grafana/data';
import sqlstring from 'sqlstring';

export const loadDbData = async ({ query }: { query: TDbQuery }): Promise<TDataResponse['data'] | null> => {
  try {
    const db = getBackendSrv();

    const { data } =
      ((await firstValueFrom(
        db?.fetch({
          url: '/api/ds/query',
          method: 'post',
          data: {
            queries: [query],
            from: '0',
            to: '0',
          },
        })
      )) as unknown as TDataResponse) || {};

    return data;
  } catch (error) {
    console.error('Error loading Database Data', error);
    return null;
  }
};

export const composeQuery = (
  {
    refId,
    sqlConfig,
    dataSource,
  }: { refId: IVariableModel; sqlConfig: TSqlConfig; dataSource: DataSourceInstanceSettings<DataSourceJsonData> },
  { siteUUID, shiftSchema, shiftGroupSchema }: { siteUUID: string; shiftSchema: string; shiftGroupSchema: string }
): TDbQuery | null => {
  try {
    if (refId && sqlConfig && dataSource) {
      return {
        refId: refId.current.value,
        datasourceId: dataSource.id,
        rawSql: sqlstring.format(
          `SELECT ??, ?? AS group_uuid, ??, ?? AS shift_name, ??, ??, ??
            FROM ?? s
            LEFT JOIN ?? sg ON ?? = ??
            ${siteUUID ? 'WHERE ?? = ?' : ''}
            ORDER by ??, ??
          `,
          [
            `sg.${sqlConfig.project.shift_groups.name}`,
            `sg.${sqlConfig.project.shift_groups.uuid}`,
            `s.${sqlConfig.project.shifts.uuid}`,
            `s.${sqlConfig.project.shifts.name}`,
            `s.${sqlConfig.project.shifts.start_time}`,
            `s.${sqlConfig.project.shifts.end_time}`,
            `s.${sqlConfig.project.shifts.order}`,
            `${shiftSchema}${sqlConfig.lookup.shifts}`,
            `${shiftGroupSchema}${sqlConfig.lookup.shift_groups}`,
            `sg.${sqlConfig.project.shift_groups.uuid}`,
            `s.${sqlConfig.project.shifts.group_uuid}`,
            ...(siteUUID ? [`sg.${sqlConfig.project.shift_groups.site_uuid}`, siteUUID] : []),
            `sg.${sqlConfig.project.shift_groups.name}`,
            `s.${sqlConfig.project.shifts.order}`,
          ]
        ),
        format: 'table',
      };
    }

    return null;
  } catch (error) {
    console.error('Error setting query from config:', error);

    return null;
  }
};

export const processSQLConfig = ({ rawData }: { rawData: string }): TSqlConfig | null => {
  try {
    return JSON.parse(rawData) as TSqlConfig;
  } catch (error) {
    return null;
  }
};

export const mapShiftData = ({
  data,
  dataSource,
}: {
  data: TDataResponse['data'];
  dataSource: DataSourceInstanceSettings<DataSourceJsonData>;
}): ShiftI[] | null => {
  const { values } = data.results[dataSource.uid].frames[0].data;

  if (values) {
    const mappedData: ShiftI[] = values[0].reduce((res: any[], _: any, index: number) => {
      return [
        ...res,
        {
          group: values[0][index],
          group_uuid: values[1]?.[index],
          uuid: values[2]?.[index],
          label: values[3]?.[index],
          startTime: values[4]?.[index],
          endTime: values[5]?.[index],
          order: values[6]?.[index],
        },
      ];
    }, []);

    return mappedData;
  } else {
    return null;
  }
};

export const getDataSource = (): {
  dataSourceId: DataSourceInstanceSettings<DataSourceJsonData> | null;
  datasourceRef: IVariableModel | null;
} => {
  const templateSrv = getTemplateSrv() as TemplateSrv & { timeRange: TimeRange };

  const datasourceRef: IVariableModel | null =
    (templateSrv.getVariables().find(({ name }: { name: string }) => name === vars.varDataModel) as IVariableModel) ||
    null;

  const [{ text }] = datasourceRef.options.filter(({ value }) => value !== '$__all') || [];
  const dataSourceList = getDataSourceSrv().getList();
  const dataSourceId = dataSourceList.find(({ name }) => name === text) || null;

  return {
    dataSourceId,
    datasourceRef,
  };
};
