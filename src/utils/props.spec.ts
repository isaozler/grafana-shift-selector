import { propStaticOptions } from '../tests/props';
import { processProps } from './props';
import { setCurrentDateTime } from './time';

describe('Panel Properties', () => {
  it('should process panel props correctly', () => {
    let processedProps = processProps(propStaticOptions);
    processedProps = setCurrentDateTime(processedProps, new Date('2000-01-01 14:30'));

    const expectedCurrentTime = {
      hour: 14,
      minute: 30,
    };

    expect(processedProps.settings).toStrictEqual({
      ...processedProps.settings,
      time: {
        current: expectedCurrentTime,
        isRealTime: false,
        isEndToNow: true,
        relativeTo: '2024-07-31',
        refreshInterval: 60000,
      },
    });

    propStaticOptions.ui.element.date.input.value = '2024-12-12';
    propStaticOptions.ux.realtime.shift.isAutoSelect = true;
    propStaticOptions.ux.realtime.shift.isEndToNow = false;
    propStaticOptions.ux.realtime.shift.refreshInterval = 50000;

    processedProps = processProps(propStaticOptions);
    processedProps = setCurrentDateTime(processedProps, new Date('2000-01-01 14:30'));

    expect(processedProps.settings).toStrictEqual({
      ...processedProps.settings,
      time: {
        current: expectedCurrentTime,
        isRealTime: true,
        isEndToNow: false,
        relativeTo: '2024-12-12',
        refreshInterval: 50000,
      },
    });
  });
});
