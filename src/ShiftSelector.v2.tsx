import React, { useEffect } from 'react';
import { PanelProps } from '@grafana/data';

import { useData } from './hooks/useData';
import { TPropOptions } from './types';
import { Dl } from './styles/debug';
import { DebugShiftTable } from './components/debug/shifts';
import { ThemeProvider } from './components/themeProvider';

const ShiftSelector: React.FC<PanelProps<TPropOptions>> = (props) => {
  const store = useData(props);

  useEffect(() => {
    store.setProps(props.options);
    store.getShifts(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <>
      {store.props && (
        <div>
          <Dl>
            {store.props.ui.element.date.input.isVisible ? (
              <>
                <dt>{store.props.ui.element.date.label.value}:</dt>
                <dd>{store.props.ui.element.date.input.value}</dd>
              </>
            ) : (
              <>
                <dt>Relative to:</dt>
                <dd>{store.props.settings.time.relativeTo}</dd>
              </>
            )}
            {store.props.ux.time.isFixed ? (
              <>
                <dt>Simulated Time:</dt>
                <dd>{store.props.ui.element.time.input.value}</dd>
              </>
            ) : (
              <></>
            )}
            <dt>Is Realtime:</dt>
            <dd>{store.props.ux.realtime.shift.isAutoSelect ? 'true' : 'false'}</dd>
            <dt>Is Ending to Now:</dt>
            <dd>{store.props.ux.realtime.shift.isEndToNow ? 'true' : 'false'}</dd>
            <dt>Refresh Interval:</dt>
            <dd>{store.props.ux.realtime.shift.refreshInterval}</dd>

            <dt>data type:</dt>
            <dd>{store.props.settings.dataSource.type}</dd>
          </Dl>
          <DebugShiftTable />
        </div>
      )}
    </>
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
