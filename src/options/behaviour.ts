import { PanelOptionsEditorBuilder } from '@grafana/data';
import { TPropOptions } from '../types';
import { TimeSelector } from '../components/panel/timeSelector';
import { customRefreshIntervalOptions } from '../utils/grafana/time';

const category = ['Behaviour'];

export const options = (builder: PanelOptionsEditorBuilder<TPropOptions>) => {
  return builder
    .addBooleanSwitch({
      category,
      path: 'ux.time.isFixed',
      name: 'Enable fixed time',
      description: 'This feature enables to setting a specific time.',
      defaultValue: false,
    })
    .addCustomEditor({
      category,
      showIf: (options) => !options.ux.realtime.shift.isAutoSelect && options.ux.time.isFixed,
      id: 'timeSelector',
      path: 'ui.element.time.input.value',
      name: 'Fixed Time',
      description: 'Simulate specific time',
      defaultValue: new Date().toDateString(),
      editor: (props) => {
        const { value, onChange } = props;
        return TimeSelector({ id: 'timeSelector', value, onChange });
      },
    })
    .addBooleanSwitch({
      showIf: (options) => !options.ui.element.date.input.isVisible,
      category,
      path: 'ux.realtime.shift.isAutoSelect',
      name: 'Real-time shift auto-select',
      description: 'This gives you the ability to track the shifts in real-time',
      defaultValue: false,
    })
    .addBooleanSwitch({
      showIf: (options) => !options.ui.element.date.input.isVisible,
      category,
      path: 'ux.realtime.shift.isEndToNow',
      name: 'Change the end of time-range to now',
      description: 'This will seek the current end of the time-range to now instead of ending shift time',
      defaultValue: true,
    })
    .addSelect({
      category,
      path: 'ux.realtime.shift.refreshInterval',
      name: 'Custom refresh interval',
      description: 'Determine a custom dashboard refresh interval to check shifts.',
      defaultValue: 60 * 1000,
      settings: {
        options: customRefreshIntervalOptions,
      },
    })
    .addBooleanSwitch({
      showIf: (options) => options.ux.realtime.shift.isAutoSelect,
      category,
      path: 'ui.element.progressBar.isVisible',
      name: 'Show refresh progress',
      description: 'Show or hide the progress of the refresh rate.',
      defaultValue: true,
    });
};
