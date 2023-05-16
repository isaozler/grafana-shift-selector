import { PanelPlugin } from '@grafana/data';
import ShiftSelector from './ShiftSelector';

export const plugin = new PanelPlugin(ShiftSelector).setPanelOptions((builder) => {
  builder
    .addBooleanSwitch({
      category: ['Data Mapper'],
      path: 'isDataSourceShifts',
      name: 'Shifts from a data source',
      description: 'Enable if shifts are being fetched from a data source',
      defaultValue: false,
    })
    .addTextInput({
      category: ['Data Mapper'],
      path: 'var_query_map_dynamic',
      showIf: (c: any) => c.isDataSourceShifts,
      name: 'Data sourced shifts mapping',
      description: 'Please provide your mapper object. You can find an example in the "var_query_map.example.js" file',
      defaultValue: JSON.stringify(
        {
          project: {
            shift_groups: {
              name: 'name',
              uuid: 'uuid',
              site_uuid: 'site_uuid',
            },
            shifts: {
              uuid: 'uuid',
              start_time: 'start_time',
              end_time: 'end_time',
              order: 'shift_order',
              group_uuid: 'shift_group_uuid',
            },
          },
          lookup: {
            shifts: 'shifts',
            shift_groups: 'shift_groups',
          },
          schema: {
            shifts: '',
            shift_groups: '',
          },
          values: {
            site_uuid: '',
          },
        },
        null,
        4
      ),
      settings: {
        useTextarea: true,
        rows: 5,
      },
    })
    .addTextInput({
      category: ['Data Mapper'],
      path: 'var_query_map_static',
      showIf: (c: any) => !c.isDataSourceShifts,
      name: 'Static shifts mapping',
      description: 'Please provide your shifts. You can find an static example in the "var_query_map.example.js" file',
      defaultValue: JSON.stringify(
        {
          static: {
            shifts: [
              {
                group: 'Group 1 eg. Summer',
                group_uuid: 'uuid_1',
                uuid: 'shift_uuid_1',
                label: 'Morning Custom',
                startTime: '06:00:00',
                endTime: '14:00:00',
                order: 1,
              },
              {
                group: 'Group 2 eg. Winter',
                group_uuid: 'uuid_2',
                uuid: 'shift_uuid_2',
                label: 'Afternoon Custom',
                startTime: '14:00:00',
                endTime: '22:00:00',
                order: 1,
              },
              {
                group: 'Group 2 eg. Winter',
                group_uuid: 'uuid_2',
                uuid: 'shift_uuid_3',
                label: 'Night Custom',
                startTime: '22:00:00',
                endTime: '06:00:00',
                order: 2,
              },
            ],
          },
        },
        null,
        4
      ),
      settings: {
        useTextarea: true,
        rows: 5,
      },
    })
    .addBooleanSwitch({
      category: ['Behavior'],
      path: 'isAutoSelectShift',
      name: 'Real-time shift auto-select',
      description: 'This gives you the ability to track the shifts in real-time',
      defaultValue: false,
    })
    .addTextInput({
      category: ['Behavior'],
      path: 'autoSelectShiftGroup',
      showIf: (c: any) => c.isAutoSelectShift,
      name: 'Select group',
      description: 'In case your panel contains multiple shift groups you can specify a certain group to cycle through in real-time mode. Scope to specific shift group (provide the group uuid). Once your group is set, the border outline of that group should be colored orange.',
      defaultValue: '',
    })
    .addBooleanSwitch({
      showIf: (c: any) => !c.isAutoSelectShift,
      category: ['Range Labels'],
      path: 'isShowDayLabel',
      name: 'Show select day label',
      description: 'This gives you the ability to show or hide the day selection label',
      defaultValue: true,
    })
    .addTextInput({
      showIf: (c: any) => !c.isAutoSelectShift,
      category: ['Range Labels'],
      path: 'dayLabel',
      name: 'Select day label',
      description: 'Define your label. Default is "Select day". To hide leave blank.',
      defaultValue: 'Select day',
    })
    .addSelect({
      showIf: (c: any) => !c.isAutoSelectShift,
      category: ['Range Labels'],
      path: 'rangeLabelType',
      name: 'Show options for the range buttons',
      description: 'This gives you the ability to customize range button labels',
      settings: {
        options: [
          {
            label: 'Icon only',
            value: 'icon-only',
          },
          {
            label: 'Text and Icon',
            value: 'text-and-icon',
          },
          {
            label: 'Text only',
            value: 'text-only',
          },
        ],
      },
      defaultValue: 'icon-only',
    })
    .addTextInput({
      showIf: (c: any) => !c.isAutoSelectShift,
      category: ['Range Labels'],
      path: 'rangeOptionLabelStartEnd',
      name: 'Start + End',
      description: 'Define your start and end label. Default is "Select start end range".',
      defaultValue: 'Start-End',
    })
    .addTextInput({
      showIf: (c: any) => !c.isAutoSelectShift,
      category: ['Range Labels'],
      path: 'rangeOptionLabelStart',
      name: 'Start',
      description: 'Define your start and end label. Default is "Select start end range".',
      defaultValue: 'Start',
    })
    .addTextInput({
      showIf: (c: any) => !c.isAutoSelectShift,
      category: ['Range Labels'],
      path: 'rangeOptionLabelEnd',
      name: 'End',
      description: 'Define your start and end label. Default is "Select start end range".',
      defaultValue: 'End',
    })
    .addSelect({
      category: ['Option Labels'],
      path: 'shiftOptionsLabelType',
      name: 'Show options for the shift buttons',
      description: 'This gives you the ability to customize shift button labels and icons',
      settings: {
        options: [
          {
            label: 'Text and Icon',
            value: 'text-and-icon',
          },
          {
            label: 'Text only',
            value: 'text-only',
          },
        ],
      },
      defaultValue: 'icon-only',
    })
    .addBooleanSwitch({
      category: ['Option Labels'],
      path: 'isShowTimeLabel',
      name: 'Show time range of shift',
      description: 'This gives you the option to show or hide the time range within shift option labels',
      defaultValue: true,
    })
    .addTextInput({
      category: ['Option Labels'],
      path: 'var_label_mapping',
      name: 'Shift labels',
      description: 'Extend your labels with localized labels. These labels will be linked to your shifts. E.g. the sunny icon will be applied once the label contains "sabah" in Turkish or "spät" in case you have German labels for your shifts.',
      defaultValue: JSON.stringify(
        {
          sunny: ['sabah', 'spät'],
          sunset: ['ikindi', 'früh'],
          night: ['akşam', 'nacht'],
        },
        null,
        4
      ),
      settings: {
        useTextarea: true,
        rows: 5,
      },
    });

  return builder;
});
