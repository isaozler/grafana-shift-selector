import React, { ChangeEvent } from 'react';
import { formatToDate } from '../../utils/time';
import { InputClass } from '../../styles/panel/input';
import { ThemeProvider } from '../themeProvider';

export const DateSelector = ({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const maxDate = formatToDate(new Date());

  return (
    <ThemeProvider>
      <input
        className={InputClass()}
        ref={inputRef}
        id={id}
        type="date"
        value={value}
        onChange={(input: ChangeEvent<HTMLInputElement>) => onChange(input.target.value)}
        max={maxDate}
      />
    </ThemeProvider>
  );
};
