import { PanelOptionsEditorBuilder } from '@grafana/data';
import { TPropOptions } from '../types';

export const options = (builder: PanelOptionsEditorBuilder<TPropOptions>) => {
  return builder
    .addTextInput({
      category: ['Data Source Mappings > DB Tables'],
      path: 'db.table.shifts.name',
      showIf: (options) => options.settings.dataSource.type === 'database',
      name: 'Shifts table',
      description: 'Please provide shift group name lookup field',
      defaultValue: 'shifts',
    })

    .addTextInput({
      category: ['Data Source Mappings > DB Tables'],
      path: 'db.table.shift_groups.name',
      showIf: (options) => options.settings.dataSource.type === 'database',
      name: 'Shift Groups table',
      description: 'Please provide shift group name lookup field',
      defaultValue: 'shift_groups',
    })
    .addFieldNamePicker({
      category: ['Data Source Mappings > Shift Group'],
      path: 'db.table.shift_groups.columns.uuid',
      showIf: (options) => options.settings.dataSource.type === 'database' && !!options.db.table.shift_groups.name,
      name: 'Shift groups [uuid]',
      description: 'Please provide shift group uuid lookup field',
      defaultValue: 'uuid',
    })
    .addFieldNamePicker({
      category: ['Data Source Mappings > Shift Group'],
      path: 'db.table.shift_groups.columns.name',
      showIf: (options) => options.settings.dataSource.type === 'database' && !!options.db.table.shift_groups.name,
      name: 'Shift groups [name]',
      description: 'Please provide shift group name lookup field',
      defaultValue: 'name',
    })
    .addFieldNamePicker({
      category: ['Data Source Mappings > Shift Group'],
      path: 'db.table.shift_groups.columns.site_uuid',
      showIf: (options) => options.settings.dataSource.type === 'database' && !!options.db.table.shift_groups.name,
      name: 'Shift groups [site_uuid]',
      description: 'Please provide shift group site_uuid lookup field',
      defaultValue: 'site_uuid',
    })
    .addFieldNamePicker({
      category: ['Data Source Mappings > Shift Lookup'],
      path: 'db.table.shifts.columns.uuid',
      showIf: (options) => options.settings.dataSource.type === 'database' && !!options.db.table.shifts.name,
      name: 'Shift [uuid]',
      description: 'Please provide shift group site_uuid lookup field',
      defaultValue: 'uuid',
    })
    .addFieldNamePicker({
      category: ['Data Source Mappings > Shift Lookup'],
      path: 'db.table.shifts.columns.name',
      showIf: (options) => options.settings.dataSource.type === 'database' && !!options.db.table.shifts.name,
      name: 'Shift [name]',
      description: 'Please provide shift group site_uuid lookup field',
      defaultValue: 'name',
    })
    .addFieldNamePicker({
      category: ['Data Source Mappings > Shift Lookup'],
      path: 'db.table.shifts.columns.start_time',
      showIf: (options) => options.settings.dataSource.type === 'database' && !!options.db.table.shifts.name,
      name: 'Shift [start_time]',
      description: 'Please provide shift group site_uuid lookup field',
      defaultValue: 'start_time',
    })
    .addFieldNamePicker({
      category: ['Data Source Mappings > Shift Lookup'],
      path: 'db.table.shifts.columns.end_time',
      showIf: (options) => options.settings.dataSource.type === 'database' && !!options.db.table.shifts.name,
      name: 'Shift [end_time]',
      description: 'Please provide shift group site_uuid lookup field',
      defaultValue: 'end_time',
    })
    .addFieldNamePicker({
      category: ['Data Source Mappings > Shift Lookup'],
      path: 'db.table.shifts.columns.order',
      showIf: (options) => options.settings.dataSource.type === 'database' && !!options.db.table.shifts.name,
      name: 'Shift [order]',
      description: 'Please provide shift group site_uuid lookup field',
      defaultValue: 'shift_order',
    })
    .addFieldNamePicker({
      category: ['Data Source Mappings > Shift Lookup'],
      path: 'db.table.shifts.columns.group_uuid',
      showIf: (options) => options.settings.dataSource.type === 'database' && !!options.db.table.shifts.name,
      name: 'Shift [group_uuid]',
      description: 'Please provide shift group site_uuid lookup field',
      defaultValue: 'shift_group_uuid',
    });
};
