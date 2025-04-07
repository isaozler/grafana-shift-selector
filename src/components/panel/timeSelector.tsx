import React, { ChangeEvent } from 'react';
import { InputClass } from '../../styles/panel/input';
import { ThemeProvider } from '../themeProvider';

export const TimeSelector = ({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <ThemeProvider>
      <input
        className={InputClass()}
        ref={inputRef}
        id={id}
        type="time"
        value={value}
        onChange={(input: ChangeEvent<HTMLInputElement>) => onChange(input.target.value)}
      />
    </ThemeProvider>
  );
};
