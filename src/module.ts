import { PanelPlugin } from '@grafana/data';
import ShiftSelector from './ShiftSelector';

export const plugin = new PanelPlugin(ShiftSelector).setPanelOptions((builder) => {
  builder
    .addBooleanSwitch({
      path: 'isAutoSelectShift',
      name: 'Real-time shift auto-select',
      description: 'This gives you the ability to track the shifts in real-time',
      defaultValue: false,
    })
    .addTextInput({
      path: 'refreshInterval',
      showIf: (c: any) => c.isAutoSelectShift,
      name: 'Custom refresh interval',
      description:
        'Determine a custom dashboard refresh interval. The global refresh interval will overwrite this value',
      defaultValue: '1h',
    })
    .addTextInput({
      path: 'autoSelectShiftGroup',
      showIf: (c: any) => c.isAutoSelectShift,
      name: 'Select group',
      description: 'Scope to specific shift group',
      defaultValue: '',
    })
    .addBooleanSwitch({
      path: 'isShowDayLabel',
      name: 'Show select day label',
      description: 'This gives you the ability to show or hide the day selection label',
      defaultValue: true,
    })
    .addTextInput({
      path: 'dayLabel',
      name: 'Select day label',
      description: 'Define your label. Default is "Select day". To hide leave blank.',
      defaultValue: 'Select day',
    })
    .addSelect({
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
      path: 'rangeOptionLabelStartEnd',
      name: 'Start + End',
      description: 'Define your start and end label. Default is "Select start end range".',
      defaultValue: 'Start-End',
    })
    .addTextInput({
      path: 'rangeOptionLabelStart',
      name: 'Start',
      description: 'Define your start and end label. Default is "Select start end range".',
      defaultValue: 'Start',
    })
    .addTextInput({
      path: 'rangeOptionLabelEnd',
      name: 'End',
      description: 'Define your start and end label. Default is "Select start end range".',
      defaultValue: 'End',
    });

  return builder;
});
