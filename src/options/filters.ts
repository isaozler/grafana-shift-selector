import { PanelOptionsEditorBuilder } from '@grafana/data';
import { TGlobalData, TPropOptions } from '../types';
import { composeGroupUUIDSelectOptions, composeShiftUUIDSelectOptions } from '../utils/shift';
import { TPanelSelectOption } from '../types/shifts';

const category = ['Filter Data'];

export const options = (builder: PanelOptionsEditorBuilder<TPropOptions>, globalData: TGlobalData) => {
  const groups = composeGroupUUIDSelectOptions(
    (globalData.options?.data?.shifts ? { ...globalData.options.data.shifts } : {}) || null
  );
  let shifts: TPanelSelectOption[] | [] = [];

  if (globalData.options?.settings.dataSource.filter.group && globalData.options?.data?.shifts) {
    shifts = composeShiftUUIDSelectOptions(
      { ...globalData.options.data.shifts }[globalData.options?.settings.dataSource.filter.group]
    );
  }

  return builder
    .addSelect({
      showIf: (options) => options.settings.dataSource.type === 'static' && !!options.settings.dataSource.static.data,
      category,
      path: 'settings.dataSource.filter.group',
      name: 'Group UUID',
      description:
        'In case your panel contains multiple shift groups you can specify a certain group to cycle through in real-time mode. Scope to specific shift group (provide the group uuid). Once your group is set, the border outline of that group should be colored orange.',
      defaultValue: '',
      settings: {
        allowCustomValue: true,
        options: groups,
        isClearable: true,
      },
    })
    .addMultiSelect({
      showIf: (options) => !!options.settings.dataSource.filter.group,
      category,
      path: 'settings.dataSource.filter.shifts',
      name: 'Shift UUID',
      description: 'Filter specific shifts within a shift group.',
      defaultValue: '',
      settings: {
        options: shifts,
      },
    });
};
