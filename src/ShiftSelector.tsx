import React, { ComponentType, useEffect } from 'react';
import { PanelProps } from '@grafana/data';

import { useData } from './hooks/useData';
import { TPropOptions } from './types';
import { ThemeProvider } from './components/themeProvider';
import { Wrapper } from './components/ui/container';
import { DateIndicator } from './components/ui/dateIndicator';
import { Shifts } from './components/ui/shifts';

const ShiftSelector: React.FC<PanelProps<TPropOptions>> = (props) => {
  const store = useData(props);

  useEffect(() => {
    store.setProps(props.options);
    store.getShifts(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <Wrapper>
      <DateIndicator />
      <Shifts />
    </Wrapper>
  );
};

const App: ComponentType<PanelProps<TPropOptions>> | null = (props) => {
  return (
    <ThemeProvider>
      <ShiftSelector {...props} />
    </ThemeProvider>
  );
};

export default App;
