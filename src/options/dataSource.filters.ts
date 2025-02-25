import { PanelOptionsEditorBuilder } from '@grafana/data';
import { TPropOptions } from '../types';

export const options = (builder: PanelOptionsEditorBuilder<TPropOptions>) => {
  return builder
    .addFieldNamePicker({
      category: ['Data Source Filter > Group By'],
      path: 'db.table.filter.column.name',
      showIf: (options) =>
        options.settings.dataSource.type === 'database' && !!options.db.table.shift_groups.columns.uuid,
      name: 'Shift Groups [name]',
      description: 'Please provide shift group name lookup field',
      defaultValue: '',
    })
    .addTextInput({
      category: ['Data Source Filter > Group By'],
      path: 'db.table.filter.column.value',
      showIf: (options) =>
        options.settings.dataSource.type === 'database' && !!options.db.table.shift_groups.columns.uuid,
      name: 'Shift Groups [value]',
      description: 'Please provide shift group name lookup field',
      defaultValue: '',
    });
};
