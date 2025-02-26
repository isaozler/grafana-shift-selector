import React from 'react';
import { ThemeProvider } from '../../themeProvider';
import { useStore } from '../../../store';

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
  const { setShifts } = useStore();

  return (
    <ThemeProvider>
      <div>
        <input
          ref={stateRef}
          type="text"
          id={id}
          defaultValue={value}
          onBlur={(e) => {
            try {
              const data = JSON.parse(e.target.value);
              setShifts(data);
              onChange(JSON.stringify(data));
            } catch (error) {
              console.error(error);
            }
          }}
        />
      </div>
    </ThemeProvider>
  );
};
