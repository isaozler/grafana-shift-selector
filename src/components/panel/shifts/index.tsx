import React, { useEffect } from 'react';
import { useShift } from '../../../hooks/panel/useShift';
import { Accordion } from './accordion';
import { ThemeProvider } from '../../themeProvider';

export const ShiftConfigurator = ({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const stateRef = React.useRef<HTMLInputElement>(null);
  const {
    dispatchers: {
      setShifts,
    },
    states: { shifts, groupUUIDs },
  } = useShift();

  useEffect(() => {
    try {
      if (value) {
        console.log(value)
        const parsedValue = JSON.parse(value);
        setShifts(parsedValue);
      }
    } catch (e) {
      console.error('Error parsing shifts', { value, error: e });
    }
  }, [setShifts, value]);

  return (
    <ThemeProvider>
      <div>
        <input
          ref={stateRef}
          type="text"
          id={id}
          value={JSON.stringify(shifts)}
          onChange={(e) => {
            onChange(e.target.value);
            console.log('CHANGED >>> ', { value: e.target.value });
          }}
        />
        {groupUUIDs.map((groupUUID) => (
          <Accordion key={groupUUID} groupUUID={groupUUID} />
        ))}
      </div>
    </ThemeProvider>
  );
};
