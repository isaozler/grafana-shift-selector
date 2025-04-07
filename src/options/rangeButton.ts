import { PanelOptionsEditorBuilder } from '@grafana/data';
import { TPropOptions } from '../types';

const category = ['Range Button Group'];

export const options = (builder: PanelOptionsEditorBuilder<TPropOptions>) => {
  return builder
    .addSelect({
      showIf: (options) => !options.ux.realtime.shift.isAutoSelect,
      category,
      path: 'ui.element.rangeButton.label.type',
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
      showIf: (options) => options.ui.element.rangeButton.label.type.includes('text-'),
      category,
      path: 'ui.element.rangeButton.label.startEnd',
      name: 'Start + End',
      description: 'Define your start and end label. Default is "Select start end range".',
      defaultValue: 'Start-End',
    })
    .addTextInput({
      showIf: (options) => options.ui.element.rangeButton.label.type.includes('text-'),
      category,
      path: 'ui.element.rangeButton.label.start',
      name: 'Start',
      description: 'Define your start and end label. Default is "Select start end range".',
      defaultValue: 'Start',
    })
    .addTextInput({
      showIf: (options) => options.ui.element.rangeButton.label.type.includes('text-'),
      category,
      path: 'ui.element.rangeButton.label.end',
      name: 'End',
      description: 'Define your start and end label. Default is "Select start end range".',
      defaultValue: 'End',
    });
};
