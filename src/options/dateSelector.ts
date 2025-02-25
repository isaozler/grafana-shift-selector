import { PanelOptionsEditorBuilder } from '@grafana/data';
import { TPropOptions } from '../types';
import { DateSelector } from '../components/panel/dateSelector';

const category = ['Production Date Selector'];

export const options = (builder: PanelOptionsEditorBuilder<TPropOptions>) => {
  return builder
    .addBooleanSwitch({
      showIf: (options) => !options.ux.realtime.shift.isAutoSelect,
      category,
      path: 'ui.element.date.input.isVisible',
      name: 'Define custom production day',
      description: 'Configure a custom production day.',
      defaultValue: true,
    })
    .addCustomEditor({
      category,
      showIf: (options) => !options.ux.realtime.shift.isAutoSelect && options.ui.element.date.input.isVisible,
      id: 'dateSelector',
      path: 'ui.element.date.input.value',
      name: 'Production day',
      description: 'Select the production date for your data',
      defaultValue: new Date().toDateString(),
      editor: (props) => {
        const { value, onChange } = props;
        return DateSelector({ id: 'dateSelector', value, onChange });
      },
    })
    .addBooleanSwitch({
      showIf: (options) => !options.ux.realtime.shift.isAutoSelect && options.ui.element.date.input.isVisible,
      category,
      path: 'ui.element.date.label.isVisible',
      name: 'Show custom production date label',
      description: 'This gives you the ability to show or hide the custom selected production day label',
      defaultValue: true,
    })
    .addTextInput({
      showIf: (options) => options.ui.element.date.input.isVisible && options.ui.element.date.label.isVisible,
      category,
      path: 'ui.element.date.label.value',
      name: 'Custom production day label',
      description: 'Define your label. Default is "Production day". To hide leave blank.',
      defaultValue: 'Production day',
    });
};
