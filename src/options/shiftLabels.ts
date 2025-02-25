import { PanelOptionsEditorBuilder } from '@grafana/data';
import { TPropOptions } from '../types';

const category = ['Shift Button'];

export const options = (builder: PanelOptionsEditorBuilder<TPropOptions>) => {
  return builder
    .addSelect({
      showIf: (options) => !options.ux.realtime.shift.isAutoSelect,
      category,
      path: 'ui.element.shiftButton.label.type',
      name: 'Show options for the shift buttons',
      description: 'This gives you the ability to customize shift button labels',
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
    .addBooleanSwitch({
      showIf: (options) => options.ui.element.shiftButton.label.type.includes('text-'),
      category,
      path: 'ui.element.shiftButton.label.time.isVisible',
      name: 'Show time range of shift',
      description: 'This gives you the option to show or hide the time range within shift option labels',
      defaultValue: true,
    })
    .addStringArray({
      showIf: (options) => options.ui.element.shiftButton.label.type.includes('text-'),
      category,
      path: 'ui.element.shiftButton.label.options.sunny',
      name: 'Shift labels Sunny',
      description:
        'Extend your labels with localized labels. These labels will be linked to your shifts. E.g. the sunny icon will be applied once the label contains "sabah" in Turkish or "spät" in case you have German labels for your shifts.',
      defaultValue: ['sabah', 'spät'],
    })
    .addStringArray({
      showIf: (options) => options.ui.element.shiftButton.label.type.includes('text-'),
      category,
      path: 'ui.element.shiftButton.label.options.sunset',
      name: 'Shift labels Sunset',
      defaultValue: ['ikindi', 'früh'],
    })
    .addStringArray({
      showIf: (options) => options.ui.element.shiftButton.label.type.includes('text-'),
      category,
      path: 'ui.element.shiftButton.label.options.night',
      name: 'Shift labels Night',
      defaultValue: ['akşam', 'nacht'],
    })
    .addBooleanSwitch({
      category,
      path: 'settings.groups.label.isTrimmed',
      showIf: (options) =>
        options.ui.element.shiftButton.label.type.includes('text-') && options.settings.dataSource.type === 'database',
      name: 'Filter shift group names from shift labels',
      description:
        "To fetch all shifts without filtering out overlapping shift names, you could concatenate shift option labels with the group name. This option allows you to filter the group name from the labels. You won't get the warning message of missing redundant shifts.",
      defaultValue: false,
    });
};
