import { PanelOptionsEditorBuilder } from '@grafana/data';
import { TPropOptions } from '../types';
import { ShiftConfigurator } from '../components/panel/shifts';

const category = ['Data Source'];
const categoryP1 = ['Static Shifts Data'];

export const options = (builder: PanelOptionsEditorBuilder<TPropOptions>) => {
  return builder
    .addSelect({
      category,
      path: 'settings.dataSource.type',
      name: 'Data source type',
      description: 'Enable if shifts are being fetched from a data source',
      defaultValue: 'static',
      settings: {
        options: [
          {
            label: 'Static',
            value: 'static',
          },
          {
            label: 'Database',
            value: 'database',
          },
        ],
      },
    })
    .addCustomEditor({
      category: categoryP1,
      showIf: (options) => options.settings.dataSource.type === 'static',
      id: 'shiftStaticData',
      path: 'settings.dataSource.static.data',
      name: 'Static Shifts Configurator',
      description: 'Configure your static shifts data',
      defaultValue: JSON.stringify(
        [
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
        null,
        4
      ),
      editor: (props) => {
        const { value, onChange } = props;
        // debugger
        return ShiftConfigurator({ id: 'shiftStaticData', value, onChange });
      },
    });
};
