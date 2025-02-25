import React from 'react';
import { PanelProps } from '@grafana/data';

import { useData } from './hooks/useData';
import { TPropOptions } from './types';
import { Dl } from './styles/debug';
import { DebugShiftTable } from './components/debug/shifts';
import { ThemeProvider } from './components/themeProvider';

const ShiftSelector: React.FC<PanelProps<TPropOptions>> = (props) => {
  const { data } = useData(props);

  return (
    <div>
      <Dl>
        {props.options.ui.element.date.input.value ? (
          <>
            <dt>{props.options.ui.element.date.label.value}:</dt>
            <dd>{props.options.ui.element.date.input.value}</dd>
          </>
        ) : (
          <>
            <dt>Relative to:</dt>
            <dd>{props.options.settings.time.relativeTo}</dd>
          </>
        )}
        {props.options.ui.element.time.input.value ? (
          <>
            <dt>Simulated Time:</dt>
            <dd>{props.options.ui.element.time.input.value}</dd>
          </>
        ) : (
          <></>
        )}
        <dt>Is Realtime:</dt>
        <dd>{props.options.settings.time.isRealTime ? 'true' : 'false'}</dd>
        <dt>Is Ending to Now:</dt>
        <dd>{props.options.settings.time.isEndToNow ? 'true' : 'false'}</dd>
        <dt>Refresh Interval:</dt>
        <dd>{props.options.settings.time.refreshInterval}</dd>

        <dt>data type:</dt>
        <dd>{props.options.settings.dataSource.type}</dd>
      </Dl>
      <DebugShiftTable data={data.state.shifts.data} />
    </div>
  );
};

const App: React.FC<PanelProps<TPropOptions>> = (props) => {
  return (
    <ThemeProvider>
      <ShiftSelector {...props} />
    </ThemeProvider>
  );
};

export default App;
