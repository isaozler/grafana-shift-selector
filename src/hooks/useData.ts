import { PanelProps } from '@grafana/data';
import type { TPropOptions } from '../types';
import { parseDynamicData, parseStaticData } from '../utils/static.data';
import { initShiftsData } from '../utils/shift';
import { useEffect } from 'react';
import { transformGrafanaResponse } from '../utils/data';
import { useStore } from '../store';
import { processProps } from '../utils/props';

export const useData = (props: PanelProps<TPropOptions>) => {
  const store = useStore();

  useEffect(() => {
    let shifts;
    props.options = processProps(props.options);

    if (props.options.settings.dataSource.type === 'static' && props.options.settings.dataSource.static.data) {
      shifts = parseStaticData(props.options);
    } else if (props.options.settings.dataSource.type === 'database' && props.data) {
      shifts = parseDynamicData(transformGrafanaResponse(props.data, props.options), props.options);
    }

    if (shifts) {
      store.setProps(initShiftsData(props.options, shifts));
      store.setShifts(shifts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...store,
  };
};
