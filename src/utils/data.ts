import { ShiftI, TDataResponse, TPropOptions } from '../types';
import {
  DataFrameJSON,
  dataFrameToJSON,
  DataSourceInstanceSettings,
  DataSourceJsonData,
  PanelData,
} from '@grafana/data';
import { TRawStaticShift, TShift } from '../types/shifts';

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

export const getFlatData = (jsonData: DataFrameJSON) => {
  const { schema, data } = jsonData ?? {};

  if (!schema || !data) {
    return [];
  }

  const { fields } = schema;
  const { values } = data;
  const result: any[] = [];
  const rowCount = values[0].length;

  for (let i = 0; i < rowCount; i++) {
    let rowObject: any = {};

    fields.forEach((field, index) => (rowObject[field.name] = values[index][i]));
    result.push(rowObject);
  }

  return result;
};

export function mapResponseData(response: DataFrameJSON[], options: TPropOptions) {
  const [firstDataSource] = response;
  let flatData = getFlatData(firstDataSource);

  if (options.db.table.filter.column.name && options.db.table.filter.column.value) {
    flatData = flatData.filter(
      (row: any) => row[options.db.table.filter.column.name] === options.db.table.filter.column.value
    );
  }

  return flatData.reduce((res, shift: any) => {
    return [
      ...res,
      {
        uuid: shift[options.db.table.shifts.columns.uuid],
        label: shift[options.db.table.shifts.columns.name],
        order: shift[options.db.table.shifts.columns.order],
        startTime: shift[options.db.table.shifts.columns.start_time],
        endTime: shift[options.db.table.shifts.columns.end_time],
        group: shift[options.db.table.shift_groups.columns.name],
        group_uuid: shift[options.db.table.shift_groups.columns.uuid],
      },
    ];
  }, [] as TShift[]);
}

export function transformGrafanaResponse(props: PanelData, options: TPropOptions): TRawStaticShift[] {
  return mapResponseData(props.series.map(dataFrameToJSON).flat(), options);
}
