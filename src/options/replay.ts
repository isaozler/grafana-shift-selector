import { PanelOptionsEditorBuilder } from '@grafana/data';
import type { TGlobalData, TPropOptions } from '../types';
import { changeMaxTimeSettings } from '../utils/panels/replay';
import { stringifyTime } from '../utils/time';
import { HiddenField } from '../components/panel/hiddenField';

const category = ['Replay'];

export const options = (builder: PanelOptionsEditorBuilder<TPropOptions>, globalData: TGlobalData) => {
  let sliderDescription = 'Interpolate between specified current time.';

  if (globalData.options?.settings.time.current && globalData.options.ui.element.replay?.time?.end) {
    const { isNextDay } = globalData.options.ui.element.replay.time;
    const { hour, minute } = globalData.options.ui.element.replay.time.end;
    sliderDescription = `The replay will start at ${stringifyTime(globalData.options.settings.time.current)} until ${
      isNextDay ? ' the next day at ' : ''
    } ${stringifyTime({ hour, minute })}`;
  }

  return builder
    .addBooleanSwitch({
      category,
      path: 'ui.element.replay.time.isEnabled',
      name: 'Enable Replay',
      description: 'This feature allows you to replay the data from the specified time.',
      defaultValue: false,
    })
    .addSelect({
      showIf: (options) => options.ui.element.replay.time.isEnabled,
      category,
      path: 'ui.element.replay.time.unit',
      name: 'Replay Time Unit',
      description: 'Specify the replay time unit',
      defaultValue: '',
      settings: {
        options: [
          {
            label: 'Hours',
            value: 'hours',
          },
          {
            label: 'Minutes',
            value: 'minutes',
          },
        ],
      },
    })
    .addSliderInput({
      category,
      showIf: (options) =>
        options.ui.element.replay.time.isEnabled &&
        !!options.ui.element.time.input.value &&
        !!options.ui.element.replay.time.unit,
      path: 'ui.element.replay.maxTime.value',
      name: 'Additional Time',
      description: sliderDescription,
      settings: changeMaxTimeSettings(globalData.options?.ui?.element?.replay?.time?.unit ?? 'hours'),
    })
    .addCustomEditor({
      category,
      showIf: () => false,
      id: 'replayEndTime',
      path: 'ui.element.replay.time.end',
      name: 'Replay End Time',
      description: 'Time the replay will end',
      defaultValue: '',
      editor: (props) => {
        // const { value } = props;
        return HiddenField(/* { id: 'dateSelector', value, targetPath: 'ui.element.replay.time.end' } */);
      },
    });
};
